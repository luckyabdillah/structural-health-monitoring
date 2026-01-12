import MainLayout from "@/components/layouts/MainLayout"
import { useRouter } from "next/router"
import { Button } from "@nextui-org/react"
import Link from 'next/link'
import { useRef, useState, useEffect } from 'react'
import clsx from 'clsx'
import Image from "next/image"
import { query, orderByChild, equalTo, onValue } from "firebase/database"
import { loadCellRef, strainGaugeRef } from "@/libs/firebase/client"

const HomePage = () => {
    const router = useRouter()

    const berandaRef = useRef<HTMLElement | null>(null)
    const tentangRef = useRef<HTMLElement | null>(null)

    const scrollTo = (ref: typeof berandaRef) => {
        ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    const [strainValue, setStrainValue] = useState<any>(null);
    const [loadValue, setLoadValue] = useState<any>(null);

    useEffect(() => {
        // Check if Firebase is properly configured
        if (!process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL) {
            console.error('Firebase configuration missing. Please create .env.local file.');
            return;
        }

        try {
            const loadCellQuery = query(loadCellRef);
            const strainQuery = query(strainGaugeRef);

            const unsubLoad = onValue(loadCellQuery, (snapshot) => {
                const data = snapshot.val();
                if (!data) return;
                const lastTimestamp = Math.max(...Object.keys(data).map(Number));
                setLoadValue(data[lastTimestamp]);
            }, (error) => {
                console.error('Error reading load cell data:', error);
            });

            const unsubStrain = onValue(strainQuery, (snapshot) => {
                const data = snapshot.val();
                if (!data) return;
                const lastTimestamp = Math.max(...Object.keys(data).map(Number));
                setStrainValue(data[lastTimestamp]);
            }, (error) => {
                console.error('Error reading strain gauge data:', error);
            });

            return () => {
                unsubLoad();
                unsubStrain();
            };
        } catch (error) {
            console.error('Error initializing Firebase listeners:', error);
        }
    }, []);

    return (
        <MainLayout title="Structural Health Monitoring">
            {/* Fixed navbar */}
            <header className="fixed inset-x-0 top-0 bg-white/80 backdrop-blur-md z-50 shadow-sm">
                <nav className="max-w-6xl mx-auto flex items-center justify-between px-6 py-5">
                    <div className="text-lg font-bold">
                        <Image src="/images/general/logo.png" alt="logo" width={180} height={60} className="w-24" />
                    </div>
                    <div className="flex items-center lg:gap-7 sm:gap-4">
                        <button onClick={() => scrollTo(berandaRef)} className="text-gray-700 hover:text-gray-900 sm:block hidden">Beranda</button>
                        <button onClick={() => scrollTo(tentangRef)} className="text-gray-700 hover:text-gray-900 sm:block hidden">Tentang</button>
                        <Button color="primary" onPress={() => router.push('/auth/login')}>Login</Button>
                    </div>
                </nav>
            </header>

            <main className="pt-20">
                {/* Hero / Beranda */}
                <section ref={berandaRef} id="beranda" className="min-h-[50vh] flex items-center">
                    <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-extrabold mb-4">Structural Health Monitoring</h1>
                            <p className="text-gray-600 mb-6">Real-time monitoring for strain and load — visualize sensor data, track trends, and get alerts when values exceed thresholds.</p>
                            <div className="flex items-center gap-1">
                                <Button color="primary" className="text-white" onPress={() => scrollTo(tentangRef)}>Tentang</Button>
                                <Link href="/auth/login" className="px-4 py-2 text-sm hover:underline">Masuk</Link>
                            </div>
                        </div>
                        <div className="bg-sky-100 rounded-xl px-6 py-8 shadow-md">
                            <h4 className="text-lg font-semibold mb-2">Live Metrics</h4>
                            <div className="space-y-2 text-sm text-gray-700">
                                <div className="flex items-center justify-between">
                                    <div className="flex gap-2 items-center">
                                        <span className={clsx('live-dot')} aria-hidden>
                                            <span className="ring" style={{ background: 'rgba(34,197,94,0.12)' }} />
                                            <span className="dot" style={{ background: 'rgb(34,197,94)' }} />
                                        </span>
                                        <span className="text-gray-500">Strain Gauge</span>
                                    </div>
                                    <span className="text-blue-600 font-medium">{strainValue ? `${strainValue.strain * 1_000_000} µε` : "Loading..."}</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex gap-2 items-center">
                                        <span className={clsx('live-dot')} aria-hidden>
                                            <span className="ring" style={{ background: 'rgba(34,197,94,0.12)' }} />
                                            <span className="dot" style={{ background: 'rgb(34,197,94)' }} />
                                        </span>
                                        <span className="text-gray-500">Load Cell</span>
                                    </div>
                                    <span className="text-green-600 font-medium">{loadValue ? `${loadValue.load} g` : "Loading..."}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Tentang / About */}
                <section ref={tentangRef} id="tentang" className="py-12 bg-white">
                    <div className="max-w-6xl mx-auto px-6">
                        <h2 className="text-2xl font-semibold mb-4">Tentang Strain Gauge & Sistem</h2>
                        <p className="text-gray-600 mb-6">Sistem ini dirancang untuk mengawasi perubahan strain dan load pada struktur secara real-time menggunakan strain gauge yang dipasang pada titik-titik kritis.</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="p-6 bg-sky-100 shadow-md rounded-xl">
                                <h3 className="font-semibold mb-3">Karakteristik Strain Gauge</h3>
                                <ul className="text-sm text-gray-700 space-y-2">
                                    <li><strong>Working Principle:</strong> Resistance change (perubahan resistansi)</li>
                                    <li><strong>Measurement Range:</strong> ± 2000 µε (contoh)</li>
                                    <li><strong>Circuit Type:</strong> Wheatstone Bridge</li>
                                    <li><strong>Output Signal:</strong> Voltage (mV/V)</li>
                                </ul>
                            </div>

                            <div className="p-6 bg-sky-100 shadow-md rounded-xl">
                                <h3 className="font-semibold mb-3">Panduan Singkat</h3>
                                <ol className="text-sm text-gray-700 list-decimal list-inside space-y-2">
                                    <li>Pasang strain gauge dengan permukaan yang bersih dan rata.</li>
                                    <li>Lakukan kalibrasi setelah pemasangan untuk mendapatkan baseline.</li>
                                    <li>Pastikan koneksi Wheatstone bridge stabil dan terlindungi dari gangguan.</li>
                                </ol>
                            </div>
                        </div>

                        <div className="mt-8">
                            <h4 className="font-semibold mb-2">Integrasi & Akses</h4>
                            <p className="text-sm text-gray-600">Halaman dashboard menyediakan monitoring real-time, grafik, dan informasi. Untuk akses penuh, gunakan tombol <em>Login</em> di pojok kanan atas.</p>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="py-8 text-center text-sm text-gray-500">
                    <div className="max-w-6xl mx-auto px-6">© {new Date().getFullYear()} SHM System — Silvani Aritonang</div>
                </footer>
            </main>
        </MainLayout>
    )
}

export default HomePage