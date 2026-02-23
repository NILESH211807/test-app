/* eslint-disable react-hooks/set-state-in-effect */
import {
    Users,
    FileText,
    PlusCircle,
    Eye,
} from "lucide-react"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useQuery } from "@apollo/client/react"
import { GET_DASH_STATS } from "@/graphql/query/admin"
import { useEffect, useState } from "react"

interface DashStats {
    totalPosts: string,
    totalUsers: string,
    todayPosts: string,
    todayUsers: string,
    [key: string]: string,
}

interface DashStatsResponse {
    getDashboardStats: DashStats;
}

export function DashboardCard() {

    const { loading, data } = useQuery<DashStatsResponse>(GET_DASH_STATS);

    const [dashStats, setDashStats] = useState([
        {
            title: "Total Users",
            value: "10,482",
            key: "totalUsers",
            icon: Users,
            color: "text-blue-600",
        }, {
            title: "Total Posts",
            value: "24,590",
            key: "totalPosts",
            icon: FileText,
            color: "text-purple-600",
        }, {
            title: "Today's Posts",
            value: "+142",
            key: "todayPosts",
            icon: PlusCircle,
            color: "text-emerald-600",
        }, {
            title: "Today's Registered Users",
            value: "12",
            key: "todayUsers",
            icon: Eye,
            color: "text-amber-600",
        }
    ]);

    useEffect(() => {
        if (loading || !data?.getDashboardStats) return;

        const statsData = data?.getDashboardStats;

        setDashStats((prev) =>
            prev.map((stat) => ({
                ...stat,
                value: statsData[stat.key] ?? 0
            }))
        );

    }, [data, loading]);


    return (
        <>
            {
                loading ? (
                    <div className="text-center">
                        <h1>Loading...</h1>
                    </div>

                ) : (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        {dashStats?.map((stat) => (
                            <Card key={stat.title} className="relative dark:bg-black/20">
                                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                                    <CardTitle className="text-sm font-semibold tracking-tight">
                                        {stat.title}
                                    </CardTitle>
                                    <stat.icon className={`h-9 w-9 ${stat.color} absolute right-4 top-5`} />
                                </CardHeader>
                                <CardContent>
                                    <div className="text-2xl font-bold">{stat.value}</div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )
            }
        </>
    )
}