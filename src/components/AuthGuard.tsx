import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/libs/firebase/client";
import { useRouter } from "next/router";
import { CircularProgress } from "@nextui-org/react"

export default function AuthGuard({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            if (!user) {
                router.replace("/auth/login");
            } else {
                setLoading(false);
            }
        });

        return () => unsub();
    }, [router]);

    if (loading) {
        return <div className="w-full h-screen flex justify-center items-center">
            <CircularProgress label="Checking Authentication..." />
        </div>;
    }

    return <>{children}</>;
}