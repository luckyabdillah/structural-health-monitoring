import { cn } from "@/utils/cn"
import { Button, Listbox, ListboxItem } from "@nextui-org/react"
import Image from "next/image"
import { useRouter } from "next/router"
import { CiLogout } from "react-icons/ci"

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
                <Button color="danger" fullWidth variant="light" className="flex justify-start rounded-lg px-2 py-1.5" size="lg" onPress={() => router.push('/auth/login')}>
                    <CiLogout />
                    Logout
                </Button>
            </div>
        </div>
    )
}

export default DashboardLayoutSidebar