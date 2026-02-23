"use client"

import * as React from "react"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
    type ChartConfig,
} from "@/components/ui/chart";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@apollo/client/react";
import { GET_ADMIN_CHARTS } from "@/graphql/query/admin";

export const description = "An interactive line chart"

const chartConfig = {
    users: {
        label: "Total Users",
        color: "var(--chart-1)",
    },
} satisfies ChartConfig;

interface AdminChartsData {
    date: string;
    users: number;
}

export interface GetAdminChartsResponse {
    getAdminCharts: AdminChartsData[];
}

export default function AdminCharts() {

    const [timeRange, setTimeRange] = React.useState("7d");
    const [activeChart] =
        React.useState<keyof typeof chartConfig>("users");

    const { data, loading, error } = useQuery<GetAdminChartsResponse>(GET_ADMIN_CHARTS, {
        variables: {
            timeRange: timeRange
        }
    });

    const getAdminCharts = data?.getAdminCharts || [];

    return (
        <>
            {
                loading ? (
                    <div className="w-full h-75 mt-10 flex items-center justify-center border rounded-md">
                        <h1>Loading...</h1>
                    </div>
                ) : error ? (
                    <div className="w-full h-75 mt-10 flex items-center justify-center border rounded-md">
                        <h1>{error?.message || "Error loading charts data"}</h1>
                    </div>
                ) : (
                    <Card className="py-4 sm:py-0 mt-10">
                        <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
                            <div className="grid flex-1 gap-1">
                                <CardTitle>Admin Dashboard Charts</CardTitle>
                                <CardDescription>
                                    Showing total users registered in the last {timeRange === "90d" ? "3 months" : timeRange === "30d" ? "30 days" : "7 days"}: <strong>{getAdminCharts.reduce((acc, curr) => acc + curr.users, 0)}</strong>
                                </CardDescription>
                            </div>
                            <Select value={timeRange} onValueChange={setTimeRange}>
                                <SelectTrigger
                                    className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
                                    aria-label="Select a value"
                                >
                                    <SelectValue placeholder="Last 3 months" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    <SelectItem value="90d" className="rounded-lg">
                                        Last 3 months
                                    </SelectItem>
                                    <SelectItem value="30d" className="rounded-lg">
                                        Last 30 days
                                    </SelectItem>
                                    <SelectItem value="7d" className="rounded-lg">
                                        Last 7 days
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </CardHeader>
                        <CardContent className="px-2 sm:p-6">
                            <ChartContainer
                                config={chartConfig}
                                className="aspect-auto h-[250px] w-full"
                            >
                                <LineChart
                                    accessibilityLayer
                                    data={getAdminCharts}
                                    margin={{
                                        left: 12,
                                        right: 12,
                                    }}
                                >
                                    <CartesianGrid vertical={false} />
                                    <XAxis
                                        dataKey="date"
                                        tickLine={false}
                                        axisLine={false}
                                        tickMargin={8}
                                        minTickGap={32}
                                        tickFormatter={(value) => {
                                            const date = new Date(value)
                                            return date.toLocaleDateString("en-US", {
                                                month: "short",
                                                day: "numeric",
                                            })
                                        }}
                                    />
                                    <ChartTooltip
                                        content={
                                            <ChartTooltipContent
                                                className="w-37.5"
                                                nameKey="date"
                                                indicator="line"
                                                labelFormatter={(value) => {
                                                    return new Date(value).toLocaleDateString("en-US", {
                                                        month: "short",
                                                        day: "numeric",
                                                        year: "numeric",
                                                    })
                                                }}
                                            />
                                        }
                                    />
                                    <Line
                                        dataKey={activeChart}
                                        type="monotone"
                                        stroke={`var(--color-${activeChart})`}
                                        strokeWidth={2}
                                        dot={false}
                                    />
                                </LineChart>
                            </ChartContainer>
                        </CardContent>
                    </Card>
                )
            }

        </>
    )
}
