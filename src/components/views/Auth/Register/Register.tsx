import { Button, Card, CardBody, Input, Spinner } from "@nextui-org/react"
import Image from "next/image"
import Link from "next/link"
import useRegister from "./useRegister"
import { FaEye, FaEyeSlash } from "react-icons/fa6"
import { Controller } from "react-hook-form"
import { cn } from "@/utils/cn"
import { useRouter } from "next/router"
import { BiArrowBack } from "react-icons/bi"

const Register = () => {
    const router = useRouter()
    return (
        <div className="flex flex-col w-full items-center justify-center gap-10 lg:flex-row lg:gap-20">
            <div className="flex w-full flex-col items-center justify-center gap-10 lg:w-1/3">
                <h2 className="text-2xl text-danger font-semibold uppercase">SHM System</h2>
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
                    <h2 className="text-2xl font-bold text-danger-500">Create Account</h2>
                    <p className="mb-4 mt-2 text-small">
                        Have an account?&nbsp;
                        <Link href="/auth/login" className="font-semibold text-danger-400">Login here</Link>
                    </p>
                    <form className={cn("flex w-80 flex-col")}>
                        <Input
                            className="mb-3"
                            type="text"
                            label="Fullname"
                            variant="bordered"
                            autoComplete="off"
                        />
                        <Input
                            className="mb-3"
                            type="text"
                            label="Username"
                            variant="bordered"
                            autoComplete="off"
                        />
                        <Input
                            className="mb-3"
                            type="email"
                            label="Email"
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
                        <Input
                            className="mb-3"
                            type='password'
                            label="Password Confirmation"
                            variant="bordered"
                            autoComplete="off"
                        />
                        <Button color="danger" size="lg" type="button" onPress={() => router.push('/dashboard')}>
                            { false ? (
                                <Spinner color="white" size="sm" />
                            ) : "Register" }
                        </Button>
                    </form>
                </CardBody>
            </Card>
        </div>
    )
}

export default Register