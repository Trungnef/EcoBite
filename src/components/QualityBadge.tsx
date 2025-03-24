
import { Shield, CheckCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type QualityBadgeProps = {
  type: "verified" | "safety" | "organic";
  className?: string;
};

export function QualityBadge({ type, className }: QualityBadgeProps) {
  const getBadgeContent = () => {
    switch (type) {
      case "verified":
        return {
          icon: CheckCircle,
          text: "Quality Verified",
          bgColor: "bg-Eco-50",
          borderColor: "border-Eco-200",
          textColor: "text-Eco-700",
          iconColor: "text-Eco-500"
        };
      case "safety":
        return {
          icon: Shield,
          text: "Safety Inspected",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
          textColor: "text-blue-700",
          iconColor: "text-blue-500"
        };
      case "organic":
        return {
          icon: CheckCircle,
          text: "Organic",
          bgColor: "bg-emerald-50",
          borderColor: "border-emerald-200",
          textColor: "text-emerald-700",
          iconColor: "text-emerald-500"
        };
    }
  };
  
  const content = getBadgeContent();
  const Icon = content.icon;
  
  return (
    <div className={cn(
      "px-2 py-1 text-xs font-medium rounded-full border inline-flex items-center",
      content.bgColor,
      content.borderColor,
      content.textColor,
      className
    )}>
      <Icon className={cn("h-3 w-3 mr-1", content.iconColor)} />
      {content.text}
    </div>
  );
}
