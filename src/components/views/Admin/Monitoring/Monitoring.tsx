import { Card, CardBody, CardHeader } from "@nextui-org/react"
import { useEffect, useState } from "react"
import { query, orderByChild, equalTo, onValue } from "firebase/database"
import { loadCellRef, strainGaugeRef } from "@/libs/firebase/client"

interface MetricProps {
    value: string
    label: string
}

function MetricItem({ value, label }: MetricProps) {
    return (
        <div className="flex flex-col items-center justify-center py-4 px-3">
            <span className="text-2xl font-bold text-slate-800">{value}</span>
            <span className="text-sm text-slate-500 mt-1.5">{label}</span>
        </div>
    )
}

function getStatus(loadValue?: number) {
    if (loadValue === undefined || Number.isNaN(loadValue)) {
        return { label: 'Unknown', color: 'text-slate-700' }
    }
    if (loadValue > 90) return { label: 'Fatal', color: 'text-red-600' }
    if (loadValue > 70) return { label: 'Danger', color: 'text-red-500' }
    if (loadValue > 50) return { label: 'Warning', color: 'text-yellow-500' }
    return { label: 'Normal', color: 'text-green-600' }
}

const Monitoring = () => {
    const [strainValue, setStrainValue] = useState<any>(null);
    const [loadValue, setLoadValue] = useState<any>(null);
    const normalizedLoad = (() => {
        const val = strainValue?.load
        const num = typeof val === 'number' ? val : Number(val)
        return Number.isFinite(num) ? num : undefined
    })();
    const statusInfo = getStatus(normalizedLoad)

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
        <div className="max-w-7xl mx-auto py-3">
            {/* Strain Gauge Card */}
            <div className="mb-5">
                <Card className="shadow-md">
                    <CardHeader className="flex flex-col items-start px-6 pt-5 pb-3">
                        <h3 className="text-lg font-semibold text-slate-800">Strain Gauge</h3>
                    </CardHeader>
                    <CardBody className="px-6 py-5">
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 divide-x divide-slate-200 mb-4">
                            <MetricItem value={strainValue ? strainValue.strain : "Loading..."} label="Strain (µε)" />
                            <MetricItem value={strainValue ? `${strainValue.load}%` : "Loading..."} label="Load" />
                            <MetricItem value={strainValue ? strainValue.avgVoltage : "Loading..."} label="Avg Voltage (V)" />
                            <MetricItem value={strainValue ? strainValue.vr : "Loading..."} label="Vr" />
                            <MetricItem value={strainValue ? strainValue.deltaL : "Loading..."} label="ΔL (mm)" />
                            <MetricItem value={strainValue ? strainValue.stress.toLocaleString() : "Loading..."} label="Stress (Pa)" />
                        </div>
                        <p className="text-sm">Status: <span className={`${statusInfo.color} uppercase font-bold`}>{statusInfo.label}</span></p>
                    </CardBody>
                </Card>
            </div>
            {/* Load Cell Card */}
            <div className="mb-5">
                <Card className="shadow-md">
                    <CardHeader className="flex flex-col items-start px-6 pt-5 pb-3">
                        <h3 className="text-lg font-semibold text-slate-800">Load Cell</h3>
                    </CardHeader>
                    <CardBody className="px-6 pt-0 pb-4">
                        <div className="flex justify-center">
                            <MetricItem value={loadValue ? loadValue.load : "Loading..."} label="Weight (g)" />
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    )
}

export default Monitoring