import DashboardLayout from "@/components/layouts/DashboardLayout"
import Dashboard from "@/components/views/Admin/Dashboard"
import Monitoring from "@/components/views/Admin/Monitoring"

const DashboardAdminPage = () => {
    return (
        <DashboardLayout title="Monitoring" description="Dashboard Admin" type="admin">
            <Monitoring />
        </DashboardLayout>
    )
}

export default DashboardAdminPage