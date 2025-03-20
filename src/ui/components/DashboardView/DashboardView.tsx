import React from "react";
import { HeaterIcon, Flame, Zap, Wifi, Paintbrush } from "lucide-react";

// You can expand this interface based on your needs
interface UtilityCard {
  icon: React.ReactNode;
  title: string;
  value: number;
  unit: string;
  progress: number;
  color: string;
}

export const DashboardView = () => {
  // Mock data - replace with real data later
  const utilities: UtilityCard[] = [
    {
      icon: <HeaterIcon className="h-5 w-5" />,
      title: "Water",
      value: 6.3,
      unit: "KL",
      progress: 63,
      color: "bg-blue-500",
    },
    {
      icon: <Flame className="h-5 w-5" />,
      title: "Heating",
      value: 5.2,
      unit: "GJ",
      progress: 52,
      color: "bg-rose-500",
    },
    {
      icon: <Zap className="h-5 w-5" />,
      title: "Electricity",
      value: 8.3,
      unit: "MWH",
      progress: 83,
      color: "bg-amber-500",
    },
    {
      icon: <Wifi className="h-5 w-5" />,
      title: "Internet",
      value: 37,
      unit: "GB",
      progress: 37,
      color: "bg-green-500",
    },
    {
      icon: <Paintbrush className="h-5 w-5" />,
      title: "Renovation",
      value: 21,
      unit: "USD",
      progress: 21,
      color: "bg-purple-500",
    },
  ];

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold">October</h1>
          <p className="text-muted-foreground">2023</p>
        </div>
        <div className="text-4xl font-bold">$203</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {utilities.map((utility, index) => (
          <div
            key={index}
            className="bg-card rounded-xl border p-6 transition-shadow hover:shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {utility.icon}
                <h3 className="font-semibold">{utility.title}</h3>
              </div>
              <span className="text-2xl font-bold">
                {utility.value}
                <span className="text-sm ml-1 text-muted-foreground">
                  {utility.unit}
                </span>
              </span>
            </div>
            <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
              <div
                className={`h-full ${utility.color} transition-all duration-500`}
                style={{ width: `${utility.progress}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Keep the Recent Activity Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
        <div className="bg-card rounded-lg border p-4">
          <p className="text-muted-foreground">No recent activity</p>
        </div>
      </div>
    </div>
  );
};
