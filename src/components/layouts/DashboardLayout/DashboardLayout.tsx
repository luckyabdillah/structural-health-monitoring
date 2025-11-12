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
            <PageHead title={title} />
            <div className={`max-w-screen-3xl 3xl:container flex ${inter.className}`}>
                <DashboardLayoutSidebar
                    sidebarItems={type === "admin" ? SIDEBAR_ADMIN : SIDEBAR_MEMBER }
                    isOpen={open}
                />
                <div className="h-screen w-full overflow-y-auto p-8">
                    <Navbar
                        className="flex justify-between bg-transparent px-0"
                        isBlurred={false}
                        position="static"
                        classNames={{ wrapper: "p-0" }}
                    >
                        <h1 className="text-3xl font-bold">{title}</h1>
                        <NavbarMenuToggle aria-label={open ? "Close Menu" : "Open Menu"} onClick={() => setOpen(!open)} className="lg:hidden" />
                    </Navbar>
                    {children}
                </div>
            </div>
        </Fragment>
    )
}

export default DashboardLayout