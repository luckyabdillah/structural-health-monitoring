import { Card, CardBody, CardHeader, Progress } from "@nextui-org/react"
import dynamic from 'next/dynamic'
import type { ApexOptions } from 'apexcharts'

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

const LiveChart = () => {
    const data1 = [135, 140, 132, 138, 131, 139, 133, 142, 140, 135, 140, 132, 138, 131, 139, 133, 142, 140]
    const data2 = [135, 140, 132, 138, 131, 139, 133, 142, 140, 135, 140, 132, 138, 131, 139, 133, 142, 140]

    const minVal1 = Math.min(...data1)
    const maxVal1 = Math.max(...data1)

    const minVal2 = Math.min(...data2)
    const maxVal2 = Math.max(...data2)

    const options1: ApexOptions = {
        chart: {
            id: 'apexchart-example',
            zoom: { enabled: false },
            toolbar: {
                show: true,
                tools: {
                    download: true,
                    selection: false,
                    zoom: false,
                    zoomin: false,
                    zoomout: false,
                },
                export: {
                    csv: {
                        filename: 'strain-gauge-monitoring', // Sesuaikan jika perlu
                    },
                    svg: {
                        filename: 'strain-gauge-monitoring', // Sesuaikan jika perlu
                    },
                    png: {
                        filename: 'strain-gauge-monitoring', // Sesuaikan jika perlu
                    },
                },
            },
        },
        stroke: {
            curve: 'smooth',
            width: 2
        },
        colors: ['#3B82F6'],
        dataLabels: {
            enabled: false
        },
        markers: {
            size: 0
        },
        xaxis: {
            categories: [...data1].map((_, i) => `T-${data1.length - i}s`),
            labels: { show: false }
        },
        tooltip: {
            enabled: true
        },
        grid: {
            strokeDashArray: 4
        },
        yaxis: {
            min: 100,
            max: 200,
            tickAmount: 4,
            // labels: { show: false },
        },
    }

    const options2: ApexOptions = {
        chart: {
            id: 'apexchart-example',
            zoom: { enabled: false },
            toolbar: {
                show: true,
                tools: {
                    download: true,
                    selection: false,
                    zoom: false,
                    zoomin: false,
                    zoomout: false,
                },
                export: {
                    csv: {
                        filename: 'strain-gauge-monitoring', // Sesuaikan jika perlu
                    },
                    svg: {
                        filename: 'strain-gauge-monitoring', // Sesuaikan jika perlu
                    },
                    png: {
                        filename: 'strain-gauge-monitoring', // Sesuaikan jika perlu
                    },
                },
            },
        },
        stroke: {
            curve: 'smooth',
            width: 2
        },
        colors: ['#10B981'],
        dataLabels: {
            enabled: false
        },
        markers: {
            size: 0
        },
        xaxis: {
            categories: [...data2].map((_, i) => `T-${data2.length - i}s`),
            labels: { show: false }
        },
        tooltip: {
            enabled: true
        },
        grid: {
            strokeDashArray: 4
        },
        yaxis: {
            min: 100,
            max: 200,
            tickAmount: 4,
            // labels: { show: false },
        },
    }

    const series1 = [{
        name: 'Strain Gauge',
        data: data1,
    }]

    const series2 = [{
        name: 'Load Cell',
        data: data2,
    }]

    return (
        <div className="max-w-6xl mx-auto py-3">
            <div className="grid grid-cols-1 gap-4">
                <Card>
                    <CardHeader className="px-5 pt-4 pb-2">
                        <h3 className="text-md font-semibold">Strain Gauge Data</h3>
                    </CardHeader>
                    <CardBody className="px-5 py-4 flex flex-col justify-between">
                        <div className="pe-2">
                            <Chart options={options1} series={series1} type="area" height={320} />
                        </div>
                    </CardBody>
                </Card>
                <Card>
                    <CardHeader className="px-5 pt-4 pb-2">
                        <h3 className="text-md font-semibold">Load Cell Data</h3>
                    </CardHeader>
                    <CardBody className="px-5 py-4 flex flex-col justify-between">
                        <div className="pe-2">
                            <Chart options={options2} series={series2} type="area" height={320} />
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    )
}

export default LiveChart