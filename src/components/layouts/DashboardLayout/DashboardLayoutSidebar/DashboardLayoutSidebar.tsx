import { cn } from "@/utils/cn"
import { Button, Listbox, ListboxItem } from "@nextui-org/react"
import Image from "next/image"
import { useRouter } from "next/router"
import { CiLogout } from "react-icons/ci"
import { signOut } from "firebase/auth"
import { auth } from "@/libs/firebase/client"
import { useState } from "react"

interface SidebarItem {
    key: string,
    label: string,
    href: string,
    icon: JSX.Element
}

interface PropTypes {
    sidebarItems: SidebarItem[]
    isOpen: boolean
}

const DashboardLayoutSidebar = (props: PropTypes) => {
    const router = useRouter()
    const { sidebarItems, isOpen } = props
    const [isLoggingOut, setIsLoggingOut] = useState(false)
    
    return (
        <div className={cn("fixed lg:sticky lg:top-0 z-50 flex flex-col h-dvh w-full max-w-[275px] -translate-x-full lg:translate-x-0 justify-between border-r-1 border-default-200 bg-white px-4 py-6 transition-all",
            {"translate-x-0": isOpen}
        )}>
            <div>
                <div className="flex justify-center">
                    <Image src="/images/general/logo.png" alt="logo" width={180} height={60} className="mb-4 w-32 me-2" onClick={() => router.push('/')} />
                </div>
                <Listbox items={sidebarItems} variant="solid" aria-label="Dashboard Menu">
                    {(item) => (
                    <ListboxItem
                        key={item.key}
                        className={cn("my-1 h-12 text-2xl", {
                            "bg-blue-500 text-white": router.pathname === item.href,
                        })}
                        color="primary"
                        startContent={item.icon}
                        textValue={item.label}
                        aria-labelledby={item.label}
                        aria-describedby={item.label}
                        onPress={() => router.push(item.href)}
                    >
                        <p className="text-small">{item.label}</p>
                    </ListboxItem>
                    )}
                </Listbox>
            </div>
            <div className="flex items-center p-1">
                <Button
                    color="danger"
                    fullWidth
                    variant="light"
                    className="flex justify-start rounded-lg px-2 py-1.5"
                    size="lg"
                    isLoading={isLoggingOut}
                    disabled={isLoggingOut}
                    spinner={
                        <svg
                        className="animate-spin h-5 w-5 text-current"
                        fill="none"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                        >
                        <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                        />
                        <path
                            className="opacity-75"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            fill="currentColor"
                        />
                        </svg>
                    }
                    onPress={async () => {
                        setIsLoggingOut(true)
                        try {
                            await signOut(auth)
                        } catch (error) {
                            console.error('Failed to sign out', error)
                        } finally {
                            router.push('/auth/login')
                        }
                    }}
                >
                    {!isLoggingOut ? <CiLogout /> : null}
                    Logout
                </Button>
            </div>
        </div>
    )
}

export default DashboardLayoutSidebar