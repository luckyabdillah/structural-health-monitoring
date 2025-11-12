import { Button } from "@nextui-org/react"
import Image from "next/image"
import { useRouter } from "next/router"

interface PropTypes {
    status: 'success' | 'failed'
}

const Activation = (props: PropTypes) => {
    const router = useRouter()
    const { status } = props 
    return (
        <div className="flex w-full flex-col items-center justify-center gap-10 p-4">
            <div className="flex flex-col items-center justify-center gap-10">
                <Image
                    src="/images/general/logo.svg"
                    alt="logo"
                    className="w-1/5"
                    width={180}
                    height={180}
                />
                <Image
                    src={status === 'success' ? "/images/illustrations/success.svg" : "/images/illustrations/pending.svg"}
                    alt="success"
                    className="w-2/3 lg:w-1/3"
                    width={300}
                    height={300}
                />
            </div>
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold text-danger-500">Activation {status === 'success' ? "Success" : "Failed"}</h1>
                <p className="text-l font-bold-text-default-500">
                    {status === 'success' ? "Thank you for register account in Acara" : "Confirmation code is invalid"}
                </p>
                <Button className="mt-4 w-fit" variant="bordered" color="danger" onClick={() => router.push('/')}>Back to Home</Button>
            </div>
        </div>
    )
}

export default Activation