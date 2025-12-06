import { Button, Card, CardBody, Input, Spinner } from "@nextui-org/react"
import Image from "next/image"
import Link from "next/link"
import useLogin from "./useLogin"
import { FaEye, FaEyeSlash } from "react-icons/fa6"
import { Controller } from "react-hook-form"
import { useRouter } from "next/router"
import { cn } from "@/utils/cn"
import { BiArrowBack } from "react-icons/bi"

const Login = () => {
    const router = useRouter()
    return (
        <div className="flex flex-col w-full items-center justify-center gap-10 lg:flex-row lg:gap-20">
            <div className="flex w-full flex-col items-center justify-center gap-10 lg:w-1/3">
                <Image src="/images/general/logo.png" alt="logo" width={180} height={60} className="mb-4 w-32" onClick={() => router.push('/')} />
                <Image
                    src="/images/illustrations/login.svg"
                    alt="login"
                    className="w-2/3 lg:w-full"
                    width={1024}
                    height={1024}
                />
            </div>
            <Card className="p-8">
                <CardBody>
                    <div className="flex items-center gap-1 mb-4">
                        <BiArrowBack color="gray" size={14} />
                        <button onClick={() => router.push('/')} className="text-sm text-gray-600 hover:underline">Back to Home</button>
                    </div>
                    <h2 className="text-2xl font-bold text-blue-500">Login</h2>
                    <p className="mb-4 mt-2 text-small">
                        Don&apos;t have an account?&nbsp;
                        <Link href="/auth/register" className="font-semibold text-blue-400">Register here</Link>
                    </p>
                    <form className={cn("flex w-80 flex-col")}>
                        <Input
                            className="mb-3"
                            type="text"
                            label="Email / Username"
                            variant="bordered"
                            autoComplete="off"
                        />
                        <Input
                            className="mb-3"
                            type='password'
                            label="Password"
                            variant="bordered"
                            autoComplete="off"
                        />
                        <Button color="primary" size="lg" type="button" onPress={() => router.push('/dashboard')}>
                            { false ? (
                                <Spinner color="white" size="sm" />
                            ) : "Login" }
                        </Button>
                    </form>
                </CardBody>
            </Card>
        </div>
    )
}

export default Login