import { Button, Card, CardBody, Input, Spinner } from "@nextui-org/react"
import Image from "next/image"
import Link from "next/link"
import { FaEye, FaEyeSlash } from "react-icons/fa6"
import { useRouter } from "next/router"
import { cn } from "@/utils/cn"
import { BiArrowBack } from "react-icons/bi"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "@/libs/firebase/client"
import { useState } from "react"

const Login = () => {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isVisible, setIsVisible] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const toggleVisibility = () => setIsVisible(!isVisible)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            if (!email || !password) {
                throw new Error("Please fill in all fields")
            }

            await signInWithEmailAndPassword(auth, email, password)
            // AuthGuard will handle the redirect on successful auth
            router.push("/dashboard")
        } catch (err: any) {
            // Handle Firebase specific errors
            if (err.code === 'auth/user-not-found') {
                setError('Email not found. Please register first.')
            } else if (err.code === 'auth/wrong-password') {
                setError('Invalid password. Please try again.')
            } else if (err.code === 'auth/invalid-email') {
                setError('Invalid email format.')
            } else if (err.code === 'auth/user-disabled') {
                setError('This account has been disabled.')
            } else {
                setError(err.message || 'Login failed. Please try again.')
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex flex-col w-full items-center justify-center gap-10 lg:flex-row lg:gap-20">
            <div className="flex w-full flex-col items-center justify-center gap-10 lg:w-1/3">
                <Image src="/images/general/logo.png" alt="logo" width={180} height={60} className="mb-4 w-32 cursor-pointer" onClick={() => router.push('/')} />
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
                    <form className={cn("flex w-80 flex-col")} onSubmit={handleLogin}>
                        <Input
                            className="mb-3"
                            type="email"
                            label="Email"
                            variant="bordered"
                            autoComplete="off"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                        />
                        <Input
                            className="mb-3"
                            type={isVisible ? 'text' : 'password'}
                            label="Password"
                            variant="bordered"
                            autoComplete="off"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                            endContent={
                                <button
                                    className="focus:outline-none"
                                    type="button"
                                    onClick={toggleVisibility}
                                >
                                    {isVisible ? (
                                        <FaEyeSlash className="text-2xl text-default-400 pointer-events-none" />
                                    ) : (
                                        <FaEye className="text-2xl text-default-400 pointer-events-none" />
                                    )}
                                </button>
                            }
                        />
                        {error && (
                            <p className="text-red-500 text-sm mb-3">{error}</p>
                        )}
                        <Button color="primary" size="lg" type="submit" disabled={loading}>
                            {loading ? (
                                <Spinner color="white" size="sm" />
                            ) : "Login"}
                        </Button>
                    </form>
                </CardBody>
            </Card>
        </div>
    )
}

export default Login