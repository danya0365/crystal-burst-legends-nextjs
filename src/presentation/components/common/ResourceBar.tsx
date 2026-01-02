"use client";

interface Resource {
  type: "crystal" | "coin" | "energy";
  value: number;
  maxValue?: number;
}

interface ResourceBarProps {
  resources: Resource[];
  compact?: boolean;
}

const resourceIcons: Record<Resource["type"], string> = {
  crystal: "💎",
  coin: "🪙",
  energy: "⚡",
};

const resourceColors: Record<Resource["type"], string> = {
  crystal: "text-cyan-400",
  coin: "text-yellow-400",
  energy: "text-green-400",
};

/**
 * ResourceBar
 * Display player resources with icons and animated counters
 */
export function ResourceBar({ resources, compact = false }: ResourceBarProps) {
  return (
    <div className={`resource-bar ${compact ? "gap-2" : "gap-4"}`}>
      {resources.map((resource) => (
        <div
          key={resource.type}
          className={`resource-item ${compact ? "px-2 py-1" : ""}`}
        >
          <span className="resource-icon">{resourceIcons[resource.type]}</span>
          <span className={`resource-value ${resourceColors[resource.type]}`}>
            {resource.maxValue
              ? `${resource.value}/${resource.maxValue}`
              : resource.value.toLocaleString()}
          </span>
        </div>
      ))}
    </div>
  );
}
