import { PrototypeFrame } from "./hifi/PrototypeFrame";

/** Ela Web figures: the live quiz pages, served from /design behind the gate. */

const Q = "/design/ela/quiz";

export function WebFigure({ name }: { name?: string }) {
  switch (name) {
    case "quiz":
      return (
        <PrototypeFrame
          src={`${Q}/ela-money-quiz.html`}
          width={1180}
          height={800}
          title="Ela money quiz, interactive"
          label="Money quiz · answer the questions and get your result"
        />
      );
    case "hub":
      return (
        <PrototypeFrame
          src={`${Q}/index.html`}
          width={1180}
          height={800}
          title="Ela quiz hub, interactive"
          label="Hub · finish a quiz and come back"
        />
      );
    case "getapp":
      return (
        <PrototypeFrame
          src={`${Q}/get-the-app.html`}
          width={1180}
          height={760}
          title="Ela get the app page"
          label="Get the app · one QR code, the right store"
        />
      );
    default:
      return null;
  }
}
