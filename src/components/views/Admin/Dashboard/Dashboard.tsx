'use client'

import { Alert, Card, CardBody, CardHeader } from "@nextui-org/react"
import { BiBarChart, BiCheckShield, BiLineChart, BiLock, BiPlug } from "react-icons/bi"
import { useEffect, useState } from "react"
import { query, orderByChild, equalTo, onValue } from "firebase/database";
import { sensorsRef } from "@/libs/firebase/client";
import Link from 'next/link'

const Dashboard = () => {
    const [strainValue, setStrainValue] = useState<number | null>(null);
    const [loadValue, setLoadValue] = useState<number | null>(null);

    useEffect(() => {
        const loadCellQuery = query(sensorsRef, orderByChild("type"), equalTo("loadCell"));
        const strainQuery = query(sensorsRef, orderByChild("type"), equalTo("strain"));

        const unsubLoad = onValue(loadCellQuery, (snapshot) => {
            const data = snapshot.val();
            if (!data) return;
            const lastTimestamp = Math.max(...Object.keys(data).map((k) => Number(k)));
            setLoadValue(data[lastTimestamp]?.value ?? null);
        });

        const unsubStrain = onValue(strainQuery, (snapshot) => {
            const data = snapshot.val();
            if (!data) return;
            const lastTimestamp = Math.max(...Object.keys(data).map((k) => Number(k)));
            setStrainValue(data[lastTimestamp]?.value ?? null);
        });

        return () => {
            unsubLoad();
            unsubStrain();
        };
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

            {/* <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <Card className="h-100">
                    <CardBody className="px-6 py-4 flex flex-col justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-purple-100 rounded-md">
                                <BiCheckShield size={28} color="purple" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Health Status</p>
                                <p className="font-bold">97%</p>
                            </div>
                        </div>
                    </CardBody>
                </Card>
                <Card className="h-100">
                    <CardBody className="px-6 py-4 flex flex-col justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-100 rounded-md">
                                <BiPlug size={28} color="blue" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Strain Gauges</p>
                                <p className="font-bold">8</p>
                            </div>
                        </div>
                    </CardBody>
                </Card>
                <Card className="h-100">
                    <CardBody className="px-6 py-4 flex flex-col justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-100 rounded-md">
                                <BiLock size={28} color="green" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Load Cells</p>
                                <p className="font-bold">4</p>
                            </div>
                        </div>
                    </CardBody>
                </Card>
                <Card className="h-100">
                    <CardBody className="px-6 py-4 flex flex-col justify-between">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-yellow-100 rounded-md">
                                <BiBarChart size={28} color="orange" />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Data Points</p>
                                <p className="font-bold">856K</p>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div> */}

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
                                <p className="text-blue-600 font-semibold text-2xl mt-1">
                                    {strainValue != null ? `${strainValue} µε` : "Loading..."}</p>
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
                                <p className="text-green-600 font-semibold text-2xl mt-1">{loadValue != null ? `${loadValue} gr` : "Loading..."}</p>
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