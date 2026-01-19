import { Inter } from "next/font/google"
import PageHead from "@/components/commons/PageHead"
import { Fragment, ReactNode } from "react"

const inter = Inter({ subsets: ["latin"] })

interface PropTypes {
    children: ReactNode
    title?: string
}

const MainLayout = (props: PropTypes) => {
    const { children, title } = props
    return (
        <Fragment>
            <PageHead title={title} />
            <section className={`max-w-screen-3xl 3xl:container ${inter.className}`}>
                { children }
            </section>
        </Fragment>
    )
}

export default MainLayout