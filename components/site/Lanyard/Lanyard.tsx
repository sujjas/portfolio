"use client";

/* eslint-disable react/no-unknown-property */
import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, extend, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, useGLTF } from "@react-three/drei";
import {
  BallCollider,
  CuboidCollider,
  Physics,
  RigidBody,
  useRopeJoint,
  useSphericalJoint,
  type RapierRigidBody,
} from "@react-three/rapier";
import { MeshLineGeometry, MeshLineMaterial } from "meshline";
import * as THREE from "three";

import "./Lanyard.css";
import { haptic } from "@/lib/haptics";

extend({ MeshLineGeometry, MeshLineMaterial });

const CARD_GLB = "/lanyard/card.glb";

useGLTF.preload(CARD_GLB);

type LanyardProps = {
  position?: [number, number, number];
  gravity?: [number, number, number];
  fov?: number;
  transparent?: boolean;
};

export default function Lanyard({
  position = [0, 0, 12],
  gravity = [0, -40, 0],
  fov = 20,
  transparent = true,
}: LanyardProps) {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== "undefined" && window.innerWidth < 768,
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="lanyard-wrapper">
      <Canvas
        camera={{ position, fov }}
        dpr={[1, isMobile ? 1.5 : 2]}
        gl={{ alpha: transparent, antialias: true }}
        onCreated={({ gl }) =>
          gl.setClearColor(new THREE.Color(0x000000), transparent ? 0 : 1)
        }
      >
        <ambientLight intensity={Math.PI} />
        <Physics gravity={gravity} timeStep={1 / 60}>
          <Band isMobile={isMobile} />
        </Physics>
        <Environment blur={0.75}>
          <Lightformer
            intensity={2}
            color="white"
            position={[0, -1, 5]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[-1, -1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={3}
            color="white"
            position={[1, 1, 1]}
            rotation={[0, 0, Math.PI / 3]}
            scale={[100, 0.1, 1]}
          />
          <Lightformer
            intensity={10}
            color="white"
            position={[-10, 0, 14]}
            rotation={[0, Math.PI / 2, Math.PI / 3]}
            scale={[100, 10, 1]}
          />
        </Environment>
      </Canvas>
    </div>
  );
}

// Plain dark strap with a procedurally-drawn weave. Intensity is baked at
// 2.0 — opacities multiplied below already reflect that.
function useStrapTexture(): THREE.Texture {
  return useMemo(() => {
    if (typeof document === "undefined") {
      return new THREE.Texture();
    }
    const W = 256;
    const H = 64;
    const canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext("2d");
    if (!ctx) return new THREE.Texture();

    // Base
    ctx.fillStyle = "#0a0a0a";
    ctx.fillRect(0, 0, W, H);

    // Diagonal weave
    ctx.lineWidth = 1;
    ctx.strokeStyle = "rgba(255, 255, 255, 0.24)";
    for (let x = -H; x < W + H; x += 6) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x + H, H);
      ctx.stroke();
    }
    ctx.strokeStyle = "rgba(0, 0, 0, 1)";
    for (let x = -H; x < W + H; x += 6) {
      ctx.beginPath();
      ctx.moveTo(x + 3, 0);
      ctx.lineTo(x + 3 - H, H);
      ctx.stroke();
    }

    // Stitched ribbon edges
    ctx.strokeStyle = "rgba(255, 255, 255, 0.16)";
    ctx.beginPath();
    ctx.moveTo(0, 2);
    ctx.lineTo(W, 2);
    ctx.moveTo(0, H - 2);
    ctx.lineTo(W, H - 2);
    ctx.stroke();

    const t = new THREE.CanvasTexture(canvas);
    t.wrapS = THREE.RepeatWrapping;
    t.wrapT = THREE.RepeatWrapping;
    t.colorSpace = THREE.SRGBColorSpace;
    t.anisotropy = 8;
    return t;
  }, []);
}

// ------------------------------------------------------------------
// Custom card-face texture: portrait at top + name + meta at bottom.
// Drawn to a 2D canvas and uploaded as a THREE.CanvasTexture, then used
// in place of the GLB's default base map so the card silhouette and
// clip stay identical to the React Bits original.
// ------------------------------------------------------------------
// The card.glb's embedded base texture is a square atlas where the front
// face samples the LEFT half (where the atom logo originally sat) and the
// back face samples the RIGHT half (where the reactbits.dev design sat).
// Both faces only use the top ~55% of the canvas — the bottom is unused.
// We mirror that exact layout so the GLB UVs hit our content correctly.
const CARD_TEX_SIZE = 1024;
// Vertical UV coverage for both faces, observed from the source texture.
const FACE_V_EXTENT = 0.55;

// Front-name placement, baked in after slider tuning.
const NAME_OFFSET_Y = -146;
const NAME_SIZE = 84;

function useCardTexture(): THREE.Texture {
  // Stable canvas + texture across renders. The image is loaded once and
  // cached in a ref so we can repaint on slider changes without re-fetching.
  const imgRef = useRef<HTMLImageElement | null>(null);
  const [imgReady, setImgReady] = useState(false);

  const refs = useMemo(() => {
    if (typeof document === "undefined") {
      return { texture: new THREE.Texture(), ctx: null as null | CanvasRenderingContext2D };
    }
    const canvas = document.createElement("canvas");
    canvas.width = CARD_TEX_SIZE;
    canvas.height = CARD_TEX_SIZE;
    const ctx = canvas.getContext("2d");
    if (!ctx) return { texture: new THREE.Texture(), ctx: null };
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 16;
    // The GLB's UVs put v=0 at the card-top, so don't flip the canvas.
    texture.flipY = false;
    return { texture, ctx };
  }, []);

  // Load the portrait once.
  useEffect(() => {
    if (typeof document === "undefined") return;
    if (imgRef.current && imgRef.current.complete) {
      setImgReady(true);
      return;
    }
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      imgRef.current = img;
      setImgReady(true);
    };
    img.onerror = () => setImgReady(true);
    img.src = "/portrait.png";
  }, []);

  // Repaint the canvas whenever inputs change.
  useEffect(() => {
    const ctx = refs.ctx;
    const texture = refs.texture;
    if (!ctx) return;

    const W = CARD_TEX_SIZE;
    const H = CARD_TEX_SIZE;

    // Front face: left half. Back face: right half. Top ~55% of canvas.
    const HALF = W / 2;
    const FACE_H = Math.round(H * FACE_V_EXTENT);
    const PAD = 24;
    // The card.glb's outer corner radius, estimated in canvas pixels.
    // Inner radius = outer − padding keeps the curves concentric so the
    // gap around the portrait reads as a uniform border.
    const OUTER_RADIUS = 48;
    const INNER_RADIUS = Math.max(0, OUTER_RADIUS - PAD);

    const FRONT_X = PAD;
    const FRONT_Y = PAD;
    const FRONT_W = HALF - PAD * 2;
    const FRONT_H = FACE_H - PAD * 2;

    const drawBase = () => {
      // Match the GLB's paper-white background so any unused area blends in.
      ctx.fillStyle = "#fafafa";
      ctx.fillRect(0, 0, W, H);
    };

    const drawPortrait = (img: HTMLImageElement) => {
      ctx.save();
      // Rounded clip concentric with the card's outer corners.
      const r = INNER_RADIUS;
      ctx.beginPath();
      ctx.moveTo(FRONT_X + r, FRONT_Y);
      ctx.lineTo(FRONT_X + FRONT_W - r, FRONT_Y);
      ctx.quadraticCurveTo(FRONT_X + FRONT_W, FRONT_Y, FRONT_X + FRONT_W, FRONT_Y + r);
      ctx.lineTo(FRONT_X + FRONT_W, FRONT_Y + FRONT_H - r);
      ctx.quadraticCurveTo(
        FRONT_X + FRONT_W,
        FRONT_Y + FRONT_H,
        FRONT_X + FRONT_W - r,
        FRONT_Y + FRONT_H,
      );
      ctx.lineTo(FRONT_X + r, FRONT_Y + FRONT_H);
      ctx.quadraticCurveTo(FRONT_X, FRONT_Y + FRONT_H, FRONT_X, FRONT_Y + FRONT_H - r);
      ctx.lineTo(FRONT_X, FRONT_Y + r);
      ctx.quadraticCurveTo(FRONT_X, FRONT_Y, FRONT_X + r, FRONT_Y);
      ctx.closePath();
      ctx.clip();

      // Cover so the image fills both width and height (no stretching —
      // aspect is preserved, overflow is cropped on whichever axis is long).
      const aspect = img.width / img.height;
      const target = FRONT_W / FRONT_H;
      let dw: number;
      let dh: number;
      if (aspect > target) {
        dh = FRONT_H;
        dw = FRONT_H * aspect;
      } else {
        dw = FRONT_W;
        dh = FRONT_W / aspect;
      }
      const dx = FRONT_X + (FRONT_W - dw) / 2;
      const dy = FRONT_Y + (FRONT_H - dh) / 2;
      ctx.drawImage(img, dx, dy, dw, dh);
      ctx.restore();
    };

    const drawFrontName = () => {
      // Two-line name, left-aligned to the portrait. The Size slider drives
      // the font size directly; the Y slider shifts the whole block up/down
      // from the default centre of the empty band beneath the portrait.
      const LINE1 = "Elijah";
      const LINE2 = "Kasujja";
      const family =
        'Inter, "Inter Placeholder", ui-sans-serif, system-ui, -apple-system, sans-serif';

      const bandTop = FACE_H + PAD;
      const bandBottom = H - PAD;
      const bandCenter = (bandTop + bandBottom) / 2;

      ctx.font = `400 ${NAME_SIZE}px ${family}`;
      ctx.fillStyle = "#0a0a0a";
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";

      const lineHeight = NAME_SIZE * 1.02;
      const blockHeight = lineHeight + NAME_SIZE * 0.8;
      const line1Baseline =
        bandCenter + NAME_OFFSET_Y - blockHeight / 2 + NAME_SIZE * 0.8;
      const line2Baseline = line1Baseline + lineHeight;

      // Left-aligned to the portrait's left edge (same PAD).
      const x = PAD;
      ctx.fillText(LINE1, x, line1Baseline);
      ctx.fillText(LINE2, x, line2Baseline);
    };

    let cancelled = false;

    const paint = () => {
      if (cancelled) return;
      drawBase();
      if (imgRef.current && imgRef.current.naturalWidth > 0) {
        drawPortrait(imgRef.current);
      }
      drawFrontName();
      texture.needsUpdate = true;
    };

    // Paint once immediately with whatever's currently available (so the
    // card isn't blank), then re-paint after Inter has loaded so the name
    // renders in the real face rather than a system fallback.
    paint();

    if (typeof document !== "undefined" && document.fonts?.load) {
      document.fonts
        .load(`400 ${NAME_SIZE}px Inter`)
        .then(() => paint())
        .catch(() => {
          /* leave the fallback paint in place */
        });
    }

    return () => {
      cancelled = true;
    };
  }, [refs, imgReady]);

  return refs.texture;
}

// ------------------------------------------------------------------
// Band: physics chain + GLB card + meshline strap.
// ------------------------------------------------------------------
type BandProps = {
  maxSpeed?: number;
  minSpeed?: number;
  isMobile?: boolean;
};

type GLTFNodes = {
  card: THREE.Mesh;
  clip: THREE.Mesh;
  clamp: THREE.Mesh;
};

type GLTFMaterials = {
  base: THREE.MeshStandardMaterial & { map: THREE.Texture };
  metal: THREE.MeshStandardMaterial;
};

function Band({ maxSpeed = 50, minSpeed = 0, isMobile = false }: BandProps) {
  const band = useRef<THREE.Mesh & { geometry: MeshLineGeometry }>(null!);
  const fixed = useRef<RapierRigidBody>(null!);
  const j1 = useRef<RapierRigidBody>(null!);
  const j2 = useRef<RapierRigidBody>(null!);
  const j3 = useRef<RapierRigidBody>(null!);
  const card = useRef<RapierRigidBody>(null!);

  const vec = useMemo(() => new THREE.Vector3(), []);
  const ang = useMemo(() => new THREE.Vector3(), []);
  const rot = useMemo(() => new THREE.Vector3(), []);
  const dir = useMemo(() => new THREE.Vector3(), []);

  const segmentProps = {
    type: "dynamic" as const,
    canSleep: true,
    colliders: false as const,
    angularDamping: 4,
    linearDamping: 4,
  };

  const { nodes, materials } = useGLTF(CARD_GLB) as unknown as {
    nodes: GLTFNodes;
    materials: GLTFMaterials;
  };
  const strapTexture = useStrapTexture();
  const cardTexture = useCardTexture();

  const [curve] = useState(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
        new THREE.Vector3(),
      ]),
  );
  const [dragged, drag] = useState<false | THREE.Vector3>(false);
  const [hovered, hover] = useState(false);
  // Sign of the card's horizontal velocity on the previous frame.
  // Used to detect zero-crossings (swing reversals) after release so
  // we can fire a haptic on each bounce.
  const prevVelXSignRef = useRef(0);
  const bounceCooldownRef = useRef(0);

  useRopeJoint(fixed, j1, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j1, j2, [[0, 0, 0], [0, 0, 0], 1]);
  useRopeJoint(j2, j3, [[0, 0, 0], [0, 0, 0], 1]);
  useSphericalJoint(j3, card, [
    [0, 0, 0],
    [0, 1.45, 0],
  ]);

  useEffect(() => {
    if (hovered) {
      document.body.style.cursor = dragged ? "grabbing" : "grab";
      return () => {
        document.body.style.cursor = "auto";
      };
    }
  }, [hovered, dragged]);

  useFrame((state, delta) => {
    if (dragged && card.current) {
      vec.set(state.pointer.x, state.pointer.y, 0.5).unproject(state.camera);
      dir.copy(vec).sub(state.camera.position).normalize();
      vec.add(dir.multiplyScalar(state.camera.position.length()));
      [card, j1, j2, j3, fixed].forEach((ref) => ref.current?.wakeUp());
      card.current.setNextKinematicTranslation({
        x: vec.x - dragged.x,
        y: vec.y - dragged.y,
        z: vec.z - dragged.z,
      });
    }
    if (
      fixed.current &&
      j1.current &&
      j2.current &&
      j3.current &&
      card.current &&
      band.current
    ) {
      [j1, j2].forEach((ref) => {
        const r = ref.current as RapierRigidBody & {
          lerped?: THREE.Vector3;
        };
        if (!r.lerped) {
          r.lerped = new THREE.Vector3().copy(r.translation());
        }
        const clamped = Math.max(
          0.1,
          Math.min(1, r.lerped.distanceTo(r.translation())),
        );
        r.lerped.lerp(
          r.translation(),
          delta * (minSpeed + clamped * (maxSpeed - minSpeed)),
        );
      });

      const j1l = (j1.current as RapierRigidBody & { lerped?: THREE.Vector3 })
        .lerped!;
      const j2l = (j2.current as RapierRigidBody & { lerped?: THREE.Vector3 })
        .lerped!;
      curve.points[0].copy(j3.current.translation());
      curve.points[1].copy(j2l);
      curve.points[2].copy(j1l);
      curve.points[3].copy(fixed.current.translation());
      band.current.geometry.setPoints(curve.getPoints(isMobile ? 16 : 32));

      ang.copy(card.current.angvel() as THREE.Vector3);
      rot.copy(card.current.rotation() as unknown as THREE.Vector3);
      card.current.setAngvel(
        { x: ang.x, y: ang.y - rot.y * 0.25, z: ang.z },
        true,
      );

      // Bounce detection after release. Watch the card's horizontal
      // velocity for zero-crossings — each one means the card has
      // swung through equilibrium. Cooldown prevents stuttering
      // multi-fires at the crossing itself; the threshold + cooldown
      // together let the swings taper naturally to silence.
      if (!dragged) {
        bounceCooldownRef.current = Math.max(
          0,
          bounceCooldownRef.current - delta,
        );
        const lin = card.current.linvel() as { x: number };
        const vx = lin.x;
        const speed = Math.abs(vx);
        const sign = vx > 0.05 ? 1 : vx < -0.05 ? -1 : 0;
        if (
          sign !== 0 &&
          prevVelXSignRef.current !== 0 &&
          sign !== prevVelXSignRef.current &&
          speed > 0.6 &&
          bounceCooldownRef.current <= 0
        ) {
          // Heavier preset for stronger swings, light for the small
          // ones near the end so the cue fades with the motion.
          haptic(speed > 2.5 ? "medium" : "light");
          bounceCooldownRef.current = 0.18;
        }
        if (sign !== 0) prevVelXSignRef.current = sign;
      } else {
        prevVelXSignRef.current = 0;
        bounceCooldownRef.current = 0;
      }
    }
  });

  curve.curveType = "chordal";
  strapTexture.wrapS = THREE.RepeatWrapping;
  strapTexture.wrapT = THREE.RepeatWrapping;

  return (
    <>
      {/* Anchor position dialed in via the temporary X/Y sliders. */}
      <group position={[0.5, 4.4, 0]}>
        <RigidBody ref={fixed} {...segmentProps} type="fixed" />
        <RigidBody position={[0.5, 0, 0]} ref={j1} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1, 0, 0]} ref={j2} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody position={[1.5, 0, 0]} ref={j3} {...segmentProps}>
          <BallCollider args={[0.1]} />
        </RigidBody>
        <RigidBody
          position={[2, 0, 0]}
          ref={card}
          {...segmentProps}
          type={dragged ? "kinematicPosition" : "dynamic"}
        >
          <CuboidCollider args={[0.8, 1.125, 0.01]} />
          <group
            scale={2.25}
            position={[0, -1.2, -0.05]}
            onPointerOver={() => hover(true)}
            onPointerOut={() => hover(false)}
            onPointerUp={(e) => {
              (e.target as Element & {
                releasePointerCapture: (id: number) => void;
              }).releasePointerCapture(e.pointerId);
              haptic("light");
              drag(false);
            }}
            onPointerDown={(e) => {
              (e.target as Element & {
                setPointerCapture: (id: number) => void;
              }).setPointerCapture(e.pointerId);
              haptic("medium");
              if (card.current) {
                drag(
                  new THREE.Vector3()
                    .copy(e.point)
                    .sub(vec.copy(card.current.translation())),
                );
              }
            }}
          >
            <mesh geometry={nodes.card.geometry}>
              <meshPhysicalMaterial
                map={cardTexture}
                map-anisotropy={16}
                clearcoat={isMobile ? 0 : 1}
                clearcoatRoughness={0.15}
                roughness={0.9}
                metalness={0.8}
              />
            </mesh>
            <mesh
              geometry={nodes.clip.geometry}
              material={materials.metal}
              material-roughness={0.3}
            />
            <mesh geometry={nodes.clamp.geometry} material={materials.metal} />
          </group>
        </RigidBody>
      </group>
      <mesh ref={band}>
        <meshLineGeometry />
        <meshLineMaterial
          args={[{ resolution: new THREE.Vector2(1000, 1000) }]}
          color="white"
          depthTest={false}
          resolution={isMobile ? [1000, 2000] : [1000, 1000]}
          useMap={1}
          map={strapTexture}
          repeat={[-4, 1]}
          lineWidth={1}
        />
      </mesh>
    </>
  );
}
