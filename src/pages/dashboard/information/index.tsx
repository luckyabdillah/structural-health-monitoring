import DashboardLayout from "@/components/layouts/DashboardLayout"
import Dashboard from "@/components/views/Admin/Dashboard"
import Information from "@/components/views/Admin/Information"

const DashboardAdminPage = () => {
    return (
        <DashboardLayout title="Dashboard" description="Dashboard Admin" type="admin">
            <Information />
        </DashboardLayout>
    )
}

export default DashboardAdminPage