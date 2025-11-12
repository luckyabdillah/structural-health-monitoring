import AuthLayout from "@/components/layouts/AuthLayout"
import Register from "@/components/views/Auth/Register"

const RegisterPage = () => {
    return (
        <AuthLayout title="SHM System | Register">
            <Register />
        </AuthLayout>
    )
}

export default RegisterPage