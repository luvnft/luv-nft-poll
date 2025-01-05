"use client";

import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from "recharts";

import { CardContent } from "@/components/atoms/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/atoms/chart";

interface RadialChartProps {
  data: Array<{
    type: string;
    yes: number;
    no: number;
  }>;
}

const chartConfig = {
  yes: {
    label: "yes",
    color: "hsl(var(--chart-2))",
  },
  no: {
    label: "no",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function RadialChart({ data }: RadialChartProps) {
  const totalVisitors = data[0].no + data[0].yes;

  return (
    <div className="flex flex-col w-2/5">
      <CardContent className="flex items-center pb-0 justify-center">
        <ChartContainer config={chartConfig} className="w-24 min-h-12 justify-end">
          <RadialBarChart
            data={data}
            endAngle={180}
            innerRadius={40}
            outerRadius={70}
            cy="90%"
          >
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text x={viewBox.cx} y={viewBox.cy} textAnchor="middle">
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) - 14}
                          className="fill-foreground text-sm md:text-base font-bold"
                        >
                          {totalVisitors.toLocaleString()}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 4}
                          className="fill-muted-foreground"
                        >
                          Stakes
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </PolarRadiusAxis>
            <RadialBar
              dataKey="no"
              fill="var(--color-no)"
              stackId="a"
              cornerRadius={100}
              className="stroke-transparent stroke-2"
            />
            <RadialBar
              dataKey="yes"
              fill="var(--color-yes)"
              stackId="a"
              cornerRadius={100}
              className="stroke-transparent stroke-2"
            />
          </RadialBarChart>
        </ChartContainer>
      </CardContent>
    </div>
  );
}
