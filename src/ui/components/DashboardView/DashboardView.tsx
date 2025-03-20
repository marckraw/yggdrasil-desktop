import React from "react";
import {
  Droplet,
  Pill,
  Coffee,
  Dumbbell,
  Timer,
  Bike,
  Scale,
} from "lucide-react";
import { WheelOfLife } from "../WheelOfLife/WheelOfLife";

// You can expand this interface based on your needs
interface HabitCard {
  icon: React.ReactNode;
  title: string;
  value: number;
  unit: string;
  progress: number;
  color: string;
  target?: number; // Optional target value
}

export const DashboardView = () => {
  // Mock data - replace with real data later
  const habits: HabitCard[] = [
    {
      icon: <Droplet className="h-5 w-5" />,
      title: "Water Intake",
      value: 1.5,
      unit: "L",
      progress: 50, // 1.5L out of target 3L
      color: "bg-blue-500",
      target: 3,
    },
    {
      icon: <Pill className="h-5 w-5" />,
      title: "Lisinopril",
      value: 1,
      unit: "dose",
      progress: 100, // Taken today
      color: "bg-rose-500",
      target: 1,
    },
    {
      icon: <Coffee className="h-5 w-5" />,
      title: "Huel Green",
      value: 1,
      unit: "shake",
      progress: 50, // 1 out of 2 planned shakes
      color: "bg-green-500",
      target: 2,
    },
    {
      icon: <Dumbbell className="h-5 w-5" />,
      title: "Gym",
      value: 3,
      unit: "sessions",
      progress: 60, // 3 out of 5 planned sessions
      color: "bg-purple-500",
      target: 5,
    },
    {
      icon: <Timer className="h-5 w-5" />,
      title: "Running",
      value: 5.2,
      unit: "km",
      progress: 52, // 5.2km out of 10km goal
      color: "bg-amber-500",
      target: 10,
    },
    {
      icon: <Bike className="h-5 w-5" />,
      title: "Freeletics",
      value: 2,
      unit: "workouts",
      progress: 67, // 2 out of 3 planned workouts
      color: "bg-indigo-500",
      target: 3,
    },
    {
      icon: <Scale className="h-5 w-5" />,
      title: "Weight Tracking",
      value: 1,
      unit: "check",
      progress: 100, // Weighed today
      color: "bg-teal-500",
      target: 1,
    },
  ];

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold">Daily Habits</h1>
          <p className="text-muted-foreground">
            {new Date().toLocaleDateString("en-US", {
              month: "long",
              day: "numeric",
              year: "numeric",
            })}
          </p>
        </div>
        <div className="text-4xl font-bold">
          {/* You could show overall progress here */}
          70%
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {habits.map((habit, index) => (
          <div
            key={index}
            className="bg-card rounded-xl border p-6 transition-shadow hover:shadow-lg"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                {habit.icon}
                <h3 className="font-semibold">{habit.title}</h3>
              </div>
              <span className="text-2xl font-bold">
                {habit.value}
                <span className="text-sm ml-1 text-muted-foreground">
                  {habit.unit}
                </span>
              </span>
            </div>
            <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
              <div
                className={`h-full ${habit.color} transition-all duration-500`}
                style={{ width: `${habit.progress}%` }}
              />
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Target: {habit.target} {habit.unit}
            </div>
          </div>
        ))}
      </div>

      {/* Wheel of Life Section */}
      <div className="mt-12">
        <WheelOfLife />
      </div>

      {/* Recent Activity Section */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold mb-4">Recent Activity</h2>
        <div className="bg-card rounded-lg border p-4">
          <p className="text-muted-foreground">No recent activity</p>
        </div>
      </div>
    </div>
  );
};
