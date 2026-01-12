import { alertRef } from "@/libs/firebase/client"
import { Card, CardBody, CardHeader } from "@nextui-org/react"
import { onValue, query } from "firebase/database"
import { useEffect, useState } from "react"
import { BiSolidCircle } from "react-icons/bi"

interface AlertData {
    timestamp: number
    message: string
    type: 'danger' | 'warning' | 'info'
}

const getRelativeTime = (timestamp: number): string => {
    const now = Date.now()
    const diff = now - (timestamp * 1000)
    const seconds = Math.floor(diff / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    if (seconds < 60) return 'just now'
    if (minutes < 60) return `${minutes} min${minutes > 1 ? 's' : ''} ago`
    if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`
    if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`
    
    return new Date(timestamp * 1000).toLocaleDateString()
}

const getAlertStyles = (type: string) => {
    switch (type) {
        case 'danger':
            return {
                bg: 'bg-red-100',
                text: 'text-red-800',
                border: 'border-red-300',
                dot: 'rgb(220, 38, 38)'
            }
        case 'warning':
            return {
                bg: 'bg-yellow-100',
                text: 'text-yellow-800',
                border: 'border-yellow-300',
                dot: 'rgb(234, 179, 8)'
            }
        case 'info':
            return {
                bg: 'bg-blue-100',
                text: 'text-blue-800',
                border: 'border-blue-300',
                dot: 'rgb(59, 130, 246)'
            }
        default:
            return {
                bg: 'bg-gray-100',
                text: 'text-gray-800',
                border: 'border-gray-300',
                dot: 'rgb(107, 114, 128)'
            }
    }
}

const Information = () => {
    const [alertData, setAlertData] = useState<AlertData[]>([])
    
    useEffect(() => {
        if (!process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL) {
            console.error('Firebase configuration missing. Please create .env.local file.');
            return;
        }

        try {
            const alertQuery = query(alertRef);

            const unsubAlert = onValue(
                alertQuery,
                (snapshot) => {
                    const data = snapshot.val();
                    if (!data) {
                        setAlertData([])
                        return;
                    }

                    const timestamps = Object.keys(data).map(Number).filter(t => !isNaN(t)).sort((a, b) => b - a);
                    const last7 = timestamps.slice(0, 7);
                    const values = last7.map(ts => ({
                        timestamp: ts,
                        message: data[ts].message,
                        type: data[ts].type
                    }));

                    setAlertData(values);
                },
                (error) => {
                    console.error('Error reading alert data:', error);
                }
            );

            return () => {
                unsubAlert();
            };
        } catch (error) {
            console.error('Error initializing Firebase listeners:', error);
        }
    }, []);

    return (
        <div className="max-w-6xl mx-auto py-3">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-5">
                {/* Info Card 1 */}
                <Card className="min-h-[160px]">
                    <CardHeader className="px-5 pt-4 pb-2">
                        <h3 className="text-md font-semibold">Strain Gauge</h3>
                    </CardHeader>
                    <CardBody className="px-5 py-4">
                        <div className="space-y-3 text-sm text-gray-600">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500">Working Principle</span>
                                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded">Resistance Change</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500">Measurement Range</span>
                                <span className="font-medium">±2000 µε</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500">Circuit Type</span>
                                <span className="font-medium">Wheatstone Bridge</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500">Output Signal</span>
                                <span className="font-medium">Voltage (mV/V)</span>
                            </div>
                        </div>
                    </CardBody>
                </Card>

                {/* Info Card 2 (duplicate/content variant) */}
                <Card className="min-h-[160px]">
                    <CardHeader className="px-5 pt-4 pb-2">
                        <h3 className="text-md font-semibold">Load Cell</h3>
                    </CardHeader>
                    <CardBody className="px-5 py-4">
                        <div className="space-y-3 text-sm text-gray-600">
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500">Working Principle</span>
                                <span className="text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">Strain Gauge-Based</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500">Capacity</span>
                                <span className="font-medium">500 kg</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500">Amplifier</span>
                                <span className="font-medium">HX711</span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-gray-500">Output</span>
                                <span className="font-medium">Digital Data</span>
                            </div>
                        </div>
                    </CardBody>
                </Card>
            </div>
            {/* Info Alert */}
            <Card>
                <CardHeader className="px-5 pt-4 pb-2">
                    <h3 className="text-md font-semibold">System Alerts</h3>
                </CardHeader>
                <CardBody className="px-5 pt-3 pb-5">
                    <div className="space-y-3 text-sm text-gray-600">
                        {alertData && alertData.length > 0 ? (
                            alertData.map((alert: AlertData) => {
                                const styles = getAlertStyles(alert.type)
                                return (
                                    <div
                                        key={alert.timestamp}
                                        className={`flex flex-col md:flex-row items-start md:items-center justify-between py-4 ${styles.bg} ${styles.text} px-3 rounded-lg border ${styles.border}`}
                                    >
                                        <div className="flex items-center gap-3 flex-1">
                                            <BiSolidCircle size={12} color={styles.dot} />
                                            <div className="text-sm text-left">{alert.message}</div>
                                        </div>
                                        <div className="mt-3 md:mt-0 text-sm font-medium">{getRelativeTime(alert.timestamp)}</div>
                                    </div>
                                )
                            })
                        ) : (
                            <div className="text-center py-6 text-gray-500">
                                <p>No alerts at this time</p>
                            </div>
                        )}
                    </div>
                </CardBody>
            </Card>
        </div>
    )
}

export default Information