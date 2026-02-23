"use client"

import { useMemo } from "react"
import { TrendingUp } from "lucide-react"
import { Label, Pie, PieChart } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart"
import type { AdminUserStatusChartsData } from "../Charts"

export const description = "A donut chart with text"

const chartConfig = {
    users: {
        label: "Users",
    },
    total: {
        label: "Total",
        color: "var(--chart-1)",
    },
    verified: {
        label: "Verified",
        color: "var(--chart-2)",
    },
    inactive: {
        label: "Inactive",
        color: "var(--chart-3)",
    },
    unverified: {
        label: "Unverified",
        color: "var(--chart-4)",
    }
} satisfies ChartConfig

export function ChartPieDonutText({ data }: { data: AdminUserStatusChartsData }) {

    const chartData = useMemo(() => {
        return [
            { user: "total", users: data.totalUsers, fill: "var(--color-total)" },
            { user: "verified", users: data.verifiedUsers, fill: "var(--color-verified)" },
            { user: "inactive", users: data.inactiveUsers, fill: "var(--color-inactive)" },
            { user: "unverified", users: data.unverifiedUsers, fill: "var(--color-unverified)" },
        ]
    }, [data]);

    const totalUsers = data.totalUsers;

    return (
        <Card className="flex flex-col">
            <CardHeader className="items-center pb-0">
                <CardTitle>Pie Chart - User Status</CardTitle>
                <CardDescription>Total Users: {totalUsers.toLocaleString()}</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-0">
                <ChartContainer
                    config={chartConfig}
                    className="mx-auto aspect-square max-h-62.5"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={chartData}
                            dataKey="users"
                            nameKey="user"
                            innerRadius={60}
                            strokeWidth={5}
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-3xl font-bold"
                                                >
                                                    {totalUsers.toLocaleString()}
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground"
                                                >
                                                    Users
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col gap-2 text-sm">
                <div className="flex items-center gap-2 leading-none font-medium">
                    Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                </div>
                <div className="text-muted-foreground leading-none">
                    Showing total users registered
                </div>
            </CardFooter>
        </Card>
    )
}
