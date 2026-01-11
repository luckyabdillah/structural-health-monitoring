import { Card, CardBody, CardHeader } from "@nextui-org/react"

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

const Monitoring = () => {
    return (
        <div className="max-w-7xl mx-auto py-3">
            {/* Strain Gauge Card */}
            <div className="mb-5">
                <Card className="shadow-md">
                    <CardHeader className="flex flex-col items-start px-6 pt-5 pb-3">
                        <h3 className="text-lg font-semibold text-slate-800">Strain Gauge</h3>
                    </CardHeader>
                    <CardBody className="px-6 py-5">
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 divide-x divide-slate-200 mb-4">
                            <MetricItem value="266.8" label="Strain (µε)" />
                            <MetricItem value="30%" label="Load" />
                            <MetricItem value="0.12" label="Avg Voltage (V)" />
                            <MetricItem value="1.43" label="Vr" />
                            <MetricItem value="0.26" label="ΔL (mm)" />
                            <MetricItem value="4,507" label="Stress (MPa)" />
                        </div>
                        <p className="text-sm">Status: <span className="text-green-500 uppercase font-bold">Normal</span></p>
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
                            <MetricItem value="1000" label="Weight (g)" />
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    )
}

export default Monitoring