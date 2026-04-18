import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "live" | "brand";
}

/**
 * Badge component — Shadcn UI
 * Mendukung variant khusus: live (untuk indikator siaran) dan brand
 */
function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variantClasses: Record<string, string> = {
    default:
      "border-transparent bg-primary text-primary-foreground",
    secondary:
      "border-transparent bg-secondary text-secondary-foreground",
    destructive:
      "border-transparent bg-destructive text-destructive-foreground",
    outline: "text-foreground",
    live: "border-live/30 bg-live/10 text-live pulse-live",
    brand:
      "border-brand-primary/30 bg-brand-primary/10 text-brand-primary",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
