import {
  PlatformDashboardHiFi,
  PlatformFamiliesHiFi,
  PlatformScorecardHiFi,
  PlatformSignupHiFi,
} from "./hifi/PlatformScreens";

/** Rwazi Customer Platform figures: coded renders of the 2024–2025 platform. */
export function PlatformFigure({ name }: { name?: string }) {
  switch (name) {
    case "dashboard":
      return <PlatformDashboardHiFi />;
    case "families":
      return <PlatformFamiliesHiFi />;
    case "signup":
      return <PlatformSignupHiFi />;
    case "scorecard":
      return <PlatformScorecardHiFi />;
    default:
      return null;
  }
}
