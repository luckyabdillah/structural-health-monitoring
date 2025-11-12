import { BiCog, BiGridAlt, BiHistory, BiInfoCircle, BiInfoSquare } from "react-icons/bi"
import { CiBookmark, CiGrid41, CiSettings, CiShoppingTag, CiViewList, CiWallet } from "react-icons/ci"


const SIDEBAR_ADMIN = [
    {
        key: "dashboard",
        label: "Dashboard",
        href: "/dashboard",
        icon: <BiGridAlt />
    },
    {
        key: "history",
        label: "Histori Data",
        href: "/dashboard/history",
        icon: <BiHistory />
    },
    {
        key: "information",
        label: "Informasi Sensor",
        href: "/dashboard/information",
        icon: <BiInfoCircle />
    },
    {
        key: "settings",
        label: "Pengaturan",
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