import React from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";

interface WheelOfLifeData {
  area: string;
  score: number;
  fullMark: number;
}

const wheelData: WheelOfLifeData[] = [
  { area: "Health", score: 7, fullMark: 10 },
  { area: "Career", score: 8, fullMark: 10 },
  { area: "Family", score: 6, fullMark: 10 },
  { area: "Personal Growth", score: 8, fullMark: 10 },
  { area: "Finance", score: 5, fullMark: 10 },
  { area: "Fun & Recreation", score: 6, fullMark: 10 },
  { area: "Relationships", score: 7, fullMark: 10 },
  { area: "Spirituality", score: 4, fullMark: 10 },
];

export const WheelOfLife = () => {
  return (
    <div className="bg-card rounded-xl border p-6">
      <h2 className="text-2xl font-semibold mb-4">Wheel of Life</h2>
      <div className="h-[400px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={wheelData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="area" />
            <PolarRadiusAxis angle={30} domain={[0, 10]} />
            <Radar
              name="Life Balance"
              dataKey="score"
              stroke="hsl(var(--primary))"
              fill="hsl(var(--primary))"
              fillOpacity={0.5}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        {wheelData.map((item) => (
          <div key={item.area} className="text-sm">
            <div className="font-medium">{item.area}</div>
            <div className="text-muted-foreground">Score: {item.score}/10</div>
          </div>
        ))}
      </div>
    </div>
  );
};
