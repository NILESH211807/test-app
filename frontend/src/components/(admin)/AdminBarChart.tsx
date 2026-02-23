"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, ResponsiveContainer } from "recharts"

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
import { useQuery } from "@apollo/client/react"
import type { GetAdminChartsResponse } from "./AdminCharts"
import { GET_ADMIN_CHARTS } from "@/graphql/query/admin"
import { useState } from "react"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

export const description = "A bar chart"

const chartConfig = {
    users: {
        label: "Total Users",
        color: "var(--chart-1)",
    },
} satisfies ChartConfig;

export function AdminBarChart() {

    const [timeRange, setTimeRange] = useState("7d");

    const { data, loading, error } = useQuery<GetAdminChartsResponse>(GET_ADMIN_CHARTS, {
        variables: { timeRange }
    });

    const getAdminCharts = data?.getAdminCharts || [];

    return (
        <div className="flex-1 min-w-0">
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
                                    className="hidden w-40 rounded-lg sm:ml-auto sm:flex"
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
                        <CardContent>
                            <ChartContainer className="aspect-auto h-62.5 w-full" config={chartConfig}>
                                <ResponsiveContainer width="100%" height="100%" debounce={50}>
                                    <BarChart data={getAdminCharts} margin={{ left: 8, right: 8 }}>
                                        <CartesianGrid vertical={false} />
                                        <XAxis
                                            dataKey="date"
                                            tickLine={false}
                                            tickMargin={8}
                                            axisLine={false}
                                            minTickGap={20}
                                            tickFormatter={(value) => {
                                                const d = new Date(value)
                                                return d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
                                            }}
                                        />
                                        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="line" hideLabel />} />
                                        <Bar dataKey="users" fill="var(--chart-1)" radius={8} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </ChartContainer>
                        </CardContent>
                        <CardFooter className="flex-col mb-5 items-start gap-2 text-sm">
                            <div className="flex gap-2 leading-none font-medium">
                                Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
                            </div>
                            <div className="text-muted-foreground leading-none">
                                Showing total users registered in the last {timeRange === "90d" ? "3 months" : timeRange === "30d" ? "30 days" : "7 days"}<strong></strong>
                            </div>
                        </CardFooter>
                    </Card>
                )
            }

        </div>
    )
}
