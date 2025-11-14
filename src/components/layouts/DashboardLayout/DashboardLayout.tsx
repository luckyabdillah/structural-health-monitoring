import { Inter } from "next/font/google"
import PageHead from "@/components/commons/PageHead"
import { Fragment, ReactNode, useState } from "react"
import DashboardLayoutSidebar from "./DashboardLayoutSidebar"
import { SIDEBAR_ADMIN, SIDEBAR_MEMBER } from "./DashboardLayout.constants"
import { Navbar, NavbarMenuToggle } from "@nextui-org/react"

const inter = Inter({ subsets: ["latin"] })

interface PropTypes {
    children: ReactNode,
    description?: string,
    title?: string,
    type: string,
}

const DashboardLayout = (props: PropTypes) => {
    const { children, description, title, type = 'admin' } = props
    const [ open, setOpen ] = useState(false)
    return (
        <Fragment>
            <PageHead title={`SHM System Dashboard | ${title}`} />
            <div className={`max-w-screen-3xl 3xl:container flex ${inter.className}`}>
                <DashboardLayoutSidebar
                    sidebarItems={type === "admin" ? SIDEBAR_ADMIN : SIDEBAR_MEMBER }
                    isOpen={open}
                />
                <div className="w-full">
                    <div className="pb-0 border-b-1 border-gray-200 bg-white shadow-sm sticky top-0 z-40">
                        <Navbar
                            className="flex justify-between bg-transparent px-8"
                            isBlurred={false}
                            position="sticky"
                            classNames={{ wrapper: "p-0" }}
                        >
                            <h1 className="text-2xl font-bold">{title}</h1>
                            <NavbarMenuToggle aria-label={open ? "Close Menu" : "Open Menu"} onClick={() => setOpen(!open)} className="lg:hidden" />
                        </Navbar>
                    </div>
                    <div className="px-8 py-4">
                        {children}
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default DashboardLayout