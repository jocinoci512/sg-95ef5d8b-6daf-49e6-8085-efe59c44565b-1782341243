import { TrendingUp, Package, Users, Award } from "lucide-react";

const stats = [
  {
    icon: Package,
    value: "50,000+",
    label: "Vehicles Shipped",
  },
  {
    icon: Users,
    value: "15,000+",
    label: "Happy Customers",
  },
  {
    icon: TrendingUp,
    value: "98%",
    label: "On-Time Delivery",
  },
  {
    icon: Award,
    value: "25+",
    label: "Years Experience",
  },
];

export function StatsDisplay() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <div
            key={stat.label}
            className="bg-card border border-border p-6 rounded-sm hover:border-primary/50 transition-colors"
          >
            <Icon className="h-8 w-8 text-primary mb-3" />
            <div className="font-mono text-3xl font-bold text-primary mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-muted-foreground">{stat.label}</div>
          </div>
        );
      })}
    </div>
  );
}