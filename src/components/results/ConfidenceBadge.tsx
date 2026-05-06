import Badge from "@/components/ui/Badge";

interface ConfidenceBadgeProps {
  confidence: "High" | "Moderate" | "Low" | "Uncertain";
}

const VARIANT_MAP: Record<string, "success" | "warning" | "danger" | "neutral"> = {
  High: "success",
  Moderate: "warning",
  Low: "danger",
  Uncertain: "neutral",
};

export default function ConfidenceBadge({ confidence }: ConfidenceBadgeProps) {
  return <Badge variant={VARIANT_MAP[confidence] || "neutral"}>{confidence}</Badge>;
}
