import AdminCharts from '@/components/(admin)/AdminCharts'
import { DashboardCard } from './DashboardCard'
import { AdminBarChart } from '@/components/(admin)/AdminBarChart'
import Chart from '@/components/(admin)/Charts'

const AdminDashboard = () => {
    return (
        <div className='w-full min-h-screen'>
            <DashboardCard />

            <div className='space-y-10'>
                <AdminCharts />
                <AdminBarChart />
                <Chart />
            </div>
        </div>
    )
}

export default AdminDashboard
