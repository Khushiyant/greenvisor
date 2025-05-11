import { Card, CardContent } from "@/components/ui/card";

type StatCardProps = {
  title: string;
  items: {
    label: string;
    value: string;
  }[];
};

export default function StatCard({ title, items }: StatCardProps) {
  return (
    <Card className="w-full shadow-sm border rounded-xl">
      <CardContent className="p-4 space-y-2">
        <h4 className="text-sm font-medium text-muted-foreground">{title}</h4>
        <div className="flex flex-col gap-1">
          {items.map(({ label, value }, i) => (
            <div key={i} className="flex justify-between text-sm">
              <span className="text-muted-foreground">{label}</span>
              <span className="font-medium text-foreground">{value}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
