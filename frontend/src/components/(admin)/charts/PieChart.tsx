"use client"

import { Pie, PieChart } from "recharts"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartLegend,
    ChartLegendContent,
    type ChartConfig,
} from "@/components/ui/chart"
import type { AdminUserStatusChartsData } from "../Charts"
import { useMemo } from "react"

export const description = "A pie chart with a legend"

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
    },
    other: {
        label: "Other",
        color: "var(--chart-5)",
    },
} satisfies ChartConfig

export default function PieChartLegend({ data }: { data: AdminUserStatusChartsData }) {
    const chartData = useMemo(() => {
        return [
            { type: "total", users: data.totalUsers, fill: "var(--color-total)" },
            { type: "verified", users: data.verifiedUsers, fill: "var(--color-verified)" },
            { type: "inactive", users: data.inactiveUsers, fill: "var(--color-inactive)" },
            { type: "unverified", users: data.unverifiedUsers, fill: "var(--color-unverified)" },
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
                    className="mx-auto aspect-square max-h-75"
                >
                    <PieChart>
                        <Pie data={chartData} dataKey="users" />
                        <ChartLegend
                            content={<ChartLegendContent nameKey="type" />}
                            className="-translate-y-2 flex-wrap gap-2 *:basis-1/4 *:justify-center"
                        />
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}

