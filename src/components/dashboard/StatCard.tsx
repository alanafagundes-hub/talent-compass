import { cn } from "@/lib/utils";
import { LucideIcon, TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: "default" | "primary" | "success" | "warning" | "info" | "strategic";
}

const variantStyles = {
  default: "card-metric",
  primary: "card-metric gradient-destructive",
  success: "card-metric gradient-success",
  warning: "card-metric gradient-warning",
  info: "card-metric gradient-info",
  strategic: "card-metric gradient-strategic",
};

const iconVariantStyles = {
  default: "bg-muted/50 text-muted-foreground",
  primary: "bg-primary/20 text-primary",
  success: "bg-success/20 text-success",
  warning: "bg-warning/20 text-warning",
  info: "bg-info/20 text-info",
  strategic: "bg-strategic/20 text-strategic",
};

const valueStyles = {
  default: "text-foreground",
  primary: "text-primary",
  success: "text-success",
  warning: "text-warning",
  info: "text-info",
  strategic: "text-strategic",
};

export function StatCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  variant = "default",
}: StatCardProps) {
  return (
    <div className={cn(variantStyles[variant])}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className={cn("text-3xl font-bold tracking-tight", valueStyles[variant])}>
            {value}
          </p>
          {description && (
            <p className="text-xs text-muted-foreground">{description}</p>
          )}
        </div>
        <div
          className={cn(
            "rounded-lg p-3",
            iconVariantStyles[variant]
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
      
      {trend && (
        <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between">
          <div className="h-1 w-16 rounded-full bg-muted overflow-hidden">
            <div 
              className={cn(
                "h-full rounded-full",
                trend.isPositive ? "bg-success" : "bg-destructive"
              )}
              style={{ width: `${Math.min(Math.abs(trend.value) * 5, 100)}%` }}
            />
          </div>
          <div
            className={cn(
              "flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-md",
              trend.isPositive 
                ? "text-success bg-success/10" 
                : "text-destructive bg-destructive/10"
            )}
          >
            {trend.isPositive ? (
              <TrendingUp className="h-3 w-3" />
            ) : (
              <TrendingDown className="h-3 w-3" />
            )}
            {trend.isPositive ? "↑" : "↓"} {Math.abs(trend.value)}%
          </div>
        </div>
      )}
    </div>
  );
}
