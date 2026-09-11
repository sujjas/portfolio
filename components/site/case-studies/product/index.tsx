import { ElaBudgetFigure } from "./ela-budget";
import { SenaFigure } from "./sena";
import { PlatformFigure } from "./rwazi-customer-platform";
import { LogsFigure } from "./ela-conversational-logs";
import { WebFigure } from "./ela-web";

/**
 * Per-slug figure dispatcher for product case studies. The template asks
 * for <ProductFigure slug name /> inside each solution part; this resolves
 * the right component set.
 */
const figures: Record<string, React.ComponentType<{ name?: string }>> = {
  "ela-budget": ElaBudgetFigure,
  sena: SenaFigure,
  "rwazi-customer-platform": PlatformFigure,
  "ela-conversational-logs": LogsFigure,
  "ela-web": WebFigure,
};

export function ProductFigure({ slug, name }: { slug: string; name?: string }) {
  const C = figures[slug];
  if (!C || !name) return null;
  return <C name={name} />;
}
