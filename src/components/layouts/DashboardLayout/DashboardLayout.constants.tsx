import { BiBarChart, BiCog, BiGridAlt, BiHistory, BiInfoCircle, BiInfoSquare, BiStation } from "react-icons/bi"
import { CiBookmark, CiGrid41, CiSettings, CiShoppingTag, CiViewList, CiWallet } from "react-icons/ci"


const SIDEBAR_ADMIN = [
    {
        key: "dashboard",
        label: "Dashboard",
        href: "/dashboard",
        icon: <BiGridAlt />
    },
    {
        key: "monitoring",
        label: "Monitoring",
        href: "/dashboard/monitoring",
        icon: <BiStation />
    },
    {
        key: "live-chart",
        label: "Live Chart",
        href: "/dashboard/live-chart",
        icon: <BiBarChart />
    },
    {
        key: "information",
        label: "Information",
        href: "/dashboard/information",
        icon: <BiInfoCircle />
    },
    {
        key: "settings",
        label: "Settings",
        href: "/dashboard/settings",
        icon: <BiCog />
    },
]

const SIDEBAR_MEMBER = [
    {
        key: "dashboard",
        label: "Dashboard",
        href: "/member",
        icon: <CiGrid41 />
    },
    {
        key: "transaction",
        label: "Transaction",
        href: "/member/transaction",
        icon: <CiWallet />
    },
    {
        key: "settings",
        label: "Settings",
        href: "/member/settings",
        icon: <CiSettings />
    },
]

export { SIDEBAR_ADMIN, SIDEBAR_MEMBER }