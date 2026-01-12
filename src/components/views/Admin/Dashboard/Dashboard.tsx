'use client'

import { Alert, Card, CardBody, CardHeader } from "@nextui-org/react"
import { BiBarChart, BiCheckShield, BiLineChart, BiLock, BiPlug } from "react-icons/bi"
import { useEffect, useState } from "react"
import { query, orderByChild, equalTo, onValue } from "firebase/database";
import { loadCellRef, strainGaugeRef } from "@/libs/firebase/client";
import Link from 'next/link'

const Dashboard = () => {
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
        <div className="max-w-6xl mx-auto py-3">
            <div className="w-full mb-4">
                <Alert
                    hideIcon
                    color="primary"
                    description="Structural Health Monitoring System — real-time strain & load monitoring"
                    title="Welcome back, Silvani Aritonang!"
                    variant="faded"
                    className="w-full"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
                {/* Metric Card: Strain */}
                <Card className="h-100">
                    <CardHeader className="px-5 pt-4 pb-2">
                        <h3 className="text-md font-semibold">Strain Over Time</h3>
                    </CardHeader>
                    <CardBody className="px-5 py-4 flex flex-col justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-gray-100 rounded-md">
                                <BiLineChart size={28} color="#6b7280" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Real-time Strain Data</p>
                                <p className="text-blue-600 font-semibold text-2xl mt-1">{strainValue ? `${strainValue.strain * 1_000_000} µε` : "Loading..."}</p>
                                <p className="text-xs text-gray-400">Live Reading</p>
                            </div>
                        </div>
                        <div className="mt-5 mb-1 text-sm text-gray-500">Source: Strain Gauge Censor — see full output data <Link href="/dashboard/monitoring" className="text-sm text-blue-600 hover:underline">here</Link></div>
                    </CardBody>
                </Card>

                {/* Metric Card: Load */}
                <Card className="h-100">
                    <CardHeader className="px-5 pt-4 pb-2">
                        <h3 className="text-md font-semibold">Load Over Time</h3>
                    </CardHeader>
                    <CardBody className="px-5 py-4 flex flex-col justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-gray-100 rounded-md">
                                <BiLock size={28} color="#6b7280" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Real-time Load Data</p>
                                <p className="text-green-600 font-semibold text-2xl mt-1">{loadValue ? `${loadValue.load} g` : "Loading..."}</p>
                                <p className="text-xs text-gray-400">Live Reading</p>
                            </div>
                        </div>
                        <div className="mt-5 mb-1 text-sm text-gray-500">Source: Load Cell Censor — see full output data <Link href="/dashboard/monitoring" className="text-sm text-blue-600 hover:underline">here</Link></div>
                    </CardBody>
                </Card>
            </div>
        </div>
    )
}

export default Dashboard