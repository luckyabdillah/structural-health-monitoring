import MainLayout from "@/components/layouts/MainLayout"
import { useRouter } from "next/router"
import { Button } from "@nextui-org/react"
import Link from 'next/link'
import { useRef, useState, useEffect } from 'react'
import Image from "next/image"
import { query, onValue } from "firebase/database"
import { loadCellRef, strainGaugeRef, auth } from "@/libs/firebase/client"
import { onAuthStateChanged } from "firebase/auth"
import { motion } from "framer-motion"

const HomePage = () => {
    const router = useRouter()

    const heroRef = useRef<HTMLElement | null>(null)
    const featuresRef = useRef<HTMLElement | null>(null)

    const scrollTo = (ref: typeof heroRef) => {
        ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }

    const [strainValue, setStrainValue] = useState<any>(null);
    const [loadValue, setLoadValue] = useState<any>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [authLoading, setAuthLoading] = useState(true);

    useEffect(() => {
        // Check authentication status
        const unsubAuth = onAuthStateChanged(auth, (user) => {
            setIsAuthenticated(!!user);
            setAuthLoading(false);
        });

        return () => unsubAuth();
    }, []);

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
        <MainLayout title="Structural Health Monitoring System">
            {/* Fixed navbar */}
            <header className="fixed inset-x-0 top-0 bg-white/80 backdrop-blur-md z-50 shadow-sm border-b border-gray-100">
                <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
                    <motion.div 
                        className="text-lg font-bold"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <Image src="/images/general/logo.png" alt="SHM logo" width={180} height={60} className="w-24" />
                    </motion.div>
                    <div className="flex items-center lg:gap-8 sm:gap-4">
                        <button onClick={() => scrollTo(heroRef)} className="text-sm font-medium text-gray-600 hover:text-gray-900 transition sm:block hidden">Home</button>
                        <button onClick={() => scrollTo(featuresRef)} className="text-sm font-medium text-gray-600 hover:text-gray-900 transition sm:block hidden">Features</button>
                        {!authLoading && (
                            isAuthenticated ? (
                                <Button 
                                    color="primary" 
                                    onPress={() => router.push('/dashboard')}
                                    className="font-semibold"
                                >
                                    Dashboard
                                </Button>
                            ) : (
                                <Button 
                                    color="primary" 
                                    onPress={() => router.push('/auth/login')}
                                    className="font-semibold"
                                >
                                    Login
                                </Button>
                            )
                        )}
                    </div>
                </nav>
            </header>

            <main className="pt-16 xl:pt-4">
                {/* Hero Section */}
                <section ref={heroRef} id="hero" className="min-h-screen flex items-center bg-gradient-to-br from-blue-50 via-white to-blue-50">
                    <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center w-full">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="space-y-6">
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: 0.1 }}
                                >
                                    <span className="inline-block px-4 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full mb-4">
                                        Real-Time Monitoring
                                    </span>
                                </motion.div>

                                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                                    Structural Health <span className="text-blue-600">Monitoring</span>
                                </h1>
                                <p className="text-lg text-gray-600 leading-relaxed">
                                    Advanced real-time monitoring system for strain and load measurements. Track structural integrity, visualize sensor data, and receive instant alerts.
                                </p>
                                <div className="flex items-center gap-4 pt-4">
                                    <Button 
                                        color="primary" 
                                        className="text-white font-semibold px-8 h-12"
                                        onPress={() => scrollTo(featuresRef)}
                                    >
                                        Explore Features
                                    </Button>
                                    {!authLoading && !isAuthenticated && (
                                        <Link href="/auth/register" className="px-8 py-3 text-sm font-semibold hover:underline underline-offset-2">
                                            Get Started
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </motion.div>

                        {/* Live Metrics Card */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100"
                        >
                            <div className="space-y-2 mb-6">
                                <h4 className="text-2xl font-bold text-gray-900">Live Metrics</h4>
                                <p className="text-sm text-gray-500">Current sensor readings</p>
                            </div>

                            <div className="space-y-6">
                                {/* Strain Gauge */}
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6, delay: 0.3 }}
                                    className="p-4 bg-gradient-to-br from-green-50 to-blue-50 rounded-xl border border-green-100"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex gap-3 items-center">
                                            <div className="relative w-3 h-3">
                                                <span 
                                                    className="absolute inset-0 bg-green-400 rounded-full animate-pulse"
                                                    style={{ opacity: 0.3 }}
                                                />
                                                <span className="absolute inset-0 bg-green-500 rounded-full" />
                                            </div>
                                            <span className="font-medium text-gray-700">Strain Gauge</span>
                                        </div>
                                        <span className="text-2xl font-bold text-green-600">
                                            {strainValue ? `${(strainValue.strain * 1_000_000).toFixed(0)} µε` : "—"}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500">Micro-strain measurement</p>
                                </motion.div>

                                {/* Load Cell */}
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.6, delay: 0.4 }}
                                    className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl border border-blue-100"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex gap-3 items-center">
                                            <div className="relative w-3 h-3">
                                                <span 
                                                    className="absolute inset-0 bg-blue-400 rounded-full animate-pulse"
                                                    style={{ opacity: 0.3 }}
                                                />
                                                <span className="absolute inset-0 bg-blue-500 rounded-full" />
                                            </div>
                                            <span className="font-medium text-gray-700">Load Cell</span>
                                        </div>
                                        <span className="text-2xl font-bold text-blue-600">
                                            {loadValue ? `${loadValue.load.toFixed(1)} g` : "—"}
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-500">Weight measurement</p>
                                </motion.div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Features Section */}
                <section ref={featuresRef} id="features" className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-6">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-center mb-16"
                        >
                            <h2 className="text-4xl font-bold text-gray-900 mb-4">Key Features</h2>
                            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                                Comprehensive tools for structural monitoring and data analysis
                            </p>
                        </motion.div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {[
                                {
                                    title: "Real-Time Monitoring",
                                    description: "Live sensor data with instant updates and zero latency",
                                    icon: "⚡",
                                    delay: 0.1
                                },
                                {
                                    title: "Trend Analysis",
                                    description: "Track historical data patterns and identify anomalies",
                                    icon: "📈",
                                    delay: 0.2
                                },
                                {
                                    title: "Smart Alerts",
                                    description: "Get notified when measurements exceed safe thresholds",
                                    icon: "🔔",
                                    delay: 0.3
                                },
                            ].map((feature, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.6, delay: feature.delay }}
                                    className="p-8 rounded-xl bg-gradient-to-br from-gray-50 to-blue-50 border border-gray-200 hover:shadow-lg hover:border-blue-200 transition"
                                >
                                    <div className="text-4xl mb-4">{feature.icon}</div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                                    <p className="text-gray-600">{feature.description}</p>
                                </motion.div>
                            ))}
                        </div>

                        {/* About Strain Gauge */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="mt-20 p-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl text-white"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div>
                                    <h3 className="text-2xl font-bold mb-4">About Strain Gauges</h3>
                                    <p className="mb-4 text-blue-100">
                                        Strain gauges measure deformation and stress by detecting resistance changes in a conductor. They provide precise structural integrity monitoring through Wheatstone bridge circuits.
                                    </p>
                                    <ul className="space-y-2 text-sm text-blue-100">
                                        <li className="flex gap-2">
                                            <span>✓</span>
                                            <span><strong>Measurement Range:</strong> ±2000 µε (micro-strain)</span>
                                        </li>
                                        <li className="flex gap-2">
                                            <span>✓</span>
                                            <span><strong>Output:</strong> Voltage-based signal</span>
                                        </li>
                                        <li className="flex gap-2">
                                            <span>✓</span>
                                            <span><strong>Circuit:</strong> Wheatstone Bridge configuration</span>
                                        </li>
                                    </ul>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold mb-4">Getting Started</h3>
                                    <ol className="space-y-3 text-sm text-blue-100">
                                        <li className="flex gap-3">
                                            <span className="font-bold flex-shrink-0">1.</span>
                                            <span>Mount the strain gauge on a clean, flat surface</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="font-bold flex-shrink-0">2.</span>
                                            <span>Perform calibration after installation for baseline readings</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="font-bold flex-shrink-0">3.</span>
                                            <span>Ensure stable connections and shield from electromagnetic interference</span>
                                        </li>
                                        <li className="flex gap-3">
                                            <span className="font-bold flex-shrink-0">4.</span>
                                            <span>Monitor real-time data through the dashboard</span>
                                        </li>
                                    </ol>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="py-12 bg-gray-900 text-gray-300">
                    <div className="max-w-7xl mx-auto px-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-8">
                            <div>
                                <h4 className="font-bold text-white mb-4">SHM System</h4>
                                <p className="text-sm text-gray-400">Advanced structural health monitoring with real-time sensor integration.</p>
                            </div>
                            <div>
                                <h4 className="font-bold text-white mb-4">Quick Links</h4>
                                <ul className="space-y-2 text-sm">
                                    <li><button onClick={() => scrollTo(heroRef)} className="text-gray-400 hover:text-white transition">Home</button></li>
                                    <li><button onClick={() => scrollTo(featuresRef)} className="text-gray-400 hover:text-white transition">Features</button></li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-bold text-white mb-4">Access</h4>
                                <ul className="space-y-2 text-sm">
                                    <li><Link href="/auth/login" className="text-gray-400 hover:text-white transition">Login</Link></li>
                                    <li><Link href="/auth/register" className="text-gray-400 hover:text-white transition">Sign Up</Link></li>
                                </ul>
                            </div>
                        </div>
                        <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
                            <p>© {new Date().getFullYear()} Structural Health Monitoring System. All rights reserved.</p>
                        </div>
                    </div>
                </footer>
            </main>
        </MainLayout>
    )
}

export default HomePage