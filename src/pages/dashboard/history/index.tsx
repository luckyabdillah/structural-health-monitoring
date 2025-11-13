import DashboardLayout from "@/components/layouts/DashboardLayout"
import Dashboard from "@/components/views/Admin/Dashboard"
import History from "@/components/views/Admin/History"

const DashboardAdminPage = () => {
    return (
        <DashboardLayout title="History" description="Dashboard Admin" type="admin">
            <History />
        </DashboardLayout>
    )
}

export default DashboardAdminPage