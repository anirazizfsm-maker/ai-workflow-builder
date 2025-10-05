import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  accent?: "green" | "blue" | "violet";
}

export function StatCard({ icon, label, value, accent }: StatCardProps) {
  const ring =
    accent === "green"
      ? "ring-emerald-500/20"
      : accent === "blue"
      ? "ring-blue-500/20"
      : "ring-violet-500/20";
  
  return (
    <Card className={`bg-background/60 backdrop-blur border ${ring}`}>
      <CardContent className="pt-6">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-md bg-muted">{icon}</div>
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground">{label}</span>
            <span className="text-xl font-semibold">{value}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
