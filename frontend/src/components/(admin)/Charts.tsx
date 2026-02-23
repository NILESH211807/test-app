import PieChartLegend from './charts/PieChart';
import { ChartPieDonutText } from './charts/ChartPieDonutText';
import { GET_ADMIN_USER_STATUS_CHARTS } from '@/graphql/query/admin';
import { useQuery } from '@apollo/client/react';

export interface AdminUserStatusChartsData {
    activeUsers: number;
    inactiveUsers: number;
    totalUsers: number;
    verifiedUsers: number;
    unverifiedUsers: number;
}

interface GetAdminUserStatusChartsResponse {
    getAdminUserStatusCharts: {
        success: boolean;
        message: string;
        data: AdminUserStatusChartsData;
    }
}

const Charts = () => {

    const { data, loading, error } = useQuery<GetAdminUserStatusChartsResponse>(GET_ADMIN_USER_STATUS_CHARTS);

    const getAdminUserStatusCharts = data?.getAdminUserStatusCharts?.data || {
        activeUsers: 0,
        inactiveUsers: 0,
        totalUsers: 0,
        unverifiedUsers: 0,
        verifiedUsers: 0
    };

    return (
        <>
            {
                loading ? (
                    <div className="text-center h-60 flex items-center justify-center bg-card rounded-2xl">Loading...</div>
                ) : error ? (
                    <div className="text-center h-60 flex items-center justify-center bg-card rounded-2xl text-red-500">Error: {error.message}</div>
                ) : (
                    <div className="w-full grid grid-cols-2 gap-5 max-sm:grid-cols-1">
                        <PieChartLegend data={getAdminUserStatusCharts} />
                        <ChartPieDonutText data={getAdminUserStatusCharts} />
                    </div>
                )
            }
        </>
    )
}



export default Charts
