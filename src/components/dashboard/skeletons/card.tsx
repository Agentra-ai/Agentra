import { cn } from "@/lib/utils";

import { Section } from "../section";

export function CardSkeleton({ className }: { className?: string }) {
  return (
    <Section className={cn("bg-surface animate-pulse border-0", className)} />
  );
}
