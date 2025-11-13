import { Alert, Card, CardBody, CardHeader } from "@nextui-org/react"
import { BiLineChart, BiLock, BiSolidCircle } from "react-icons/bi"

const Information = () => {
    return (
        <div className="max-w-6xl mx-auto py-4">
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
            <Card className="min-h-[160px]">
                <CardHeader className="px-5 pt-4 pb-2">
                    <h3 className="text-md font-semibold">System Alerts</h3>
                </CardHeader>
                <CardBody className="px-5 pt-3 pb-5">
                    <div className="space-y-3 text-sm text-gray-600">
                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between py-4 bg-yellow-100 text-yellow-800 px-3 rounded-lg border border-yellow-300">
                            <div className="flex items-center gap-3 flex-1">
                                <BiSolidCircle size={12} color="rgb(234, 179, 8)" />
                                <div className="text-sm text-left">High strain detected on Beam #3 - SG_04</div>
                            </div>
                            <div className="mt-3 md:mt-0 text-sm font-medium">15 mins ago</div>
                        </div>

                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between py-4 bg-red-100 text-red-800 px-3 rounded-lg border border-red-300">
                            <div className="flex items-center gap-3 flex-1">
                                <BiSolidCircle size={12} color="rgb(220, 38, 38)" />
                                <div className="text-sm text-left">Load capacity 85% exceeded - LC_02</div>
                            </div>
                            <div className="mt-3 md:mt-0 text-sm font-medium">2 hours ago</div>
                        </div>

                        <div className="flex flex-col md:flex-row items-start md:items-center justify-between py-4 bg-yellow-100 text-yellow-800 px-3 rounded-lg border border-yellow-300">
                            <div className="flex items-center gap-3 flex-1">
                                <BiSolidCircle size={12} color="rgb(234, 179, 8)" />
                                <div className="text-sm text-left">Irregular strain pattern</div>
                            </div>
                            <div className="mt-3 md:mt-0 text-sm font-medium">1 day ago</div>
                        </div>
                    </div>
                </CardBody>
            </Card>
        </div>
    )
}

export default Information