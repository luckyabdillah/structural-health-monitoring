import DashboardLayout from "@/components/layouts/DashboardLayout"
import Dashboard from "@/components/views/Admin/Dashboard"
import LiveChart from "@/components/views/Admin/LiveChart"

const DashboardAdminPage = () => {
    return (
        <DashboardLayout title="Live Chart" description="Dashboard Admin" type="admin">
            <LiveChart />
        </DashboardLayout>
    )
}

export default DashboardAdminPage