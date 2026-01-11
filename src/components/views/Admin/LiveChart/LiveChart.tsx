import { Card, CardBody, CardHeader } from "@nextui-org/react"
import dynamic from 'next/dynamic'
import type { ApexOptions } from 'apexcharts'
import { useEffect, useState } from "react"
import { onValue, query } from "firebase/database"
import { loadCellRef, strainGaugeRef } from "@/libs/firebase/client"

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

const LiveChart = () => {
    const [strainData, setStrainData] = useState<number[]>([])
    const [loadData, setLoadData] = useState<number[]>([])

    useEffect(() => {
        if (!process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL) {
            console.error('Firebase configuration missing. Please create .env.local file.');
            return;
        }

        try {
            const loadCellQuery = query(loadCellRef);
            const strainQuery = query(strainGaugeRef);

            const unsubLoad = onValue(
                loadCellQuery,
                (snapshot) => {
                    const data = snapshot.val();
                    if (!data) return;

                    const timestamps = Object.keys(data).map(Number).filter(t => !isNaN(t)).sort((a, b) => a - b);
                    const last15 = timestamps.slice(-15);
                    const values = last15.map(ts => data[ts]?.load ?? 0);

                    const padded = values.length < 15 ? [...Array(15 - values.length).fill(0), ...values] : values;

                    setLoadData(padded);
                },
                (error) => {
                    console.error('Error reading load cell data:', error);
                }
            );

            const unsubStrain = onValue(
                strainQuery,
                (snapshot) => {
                    const data = snapshot.val();
                    if (!data) return;

                    const timestamps = Object.keys(data).map(Number).filter(t => !isNaN(t)).sort((a, b) => a - b);
                    const last15 = timestamps.slice(-15);
                    const values = last15.map(ts => {
                        const raw = data[ts]?.strain ?? 0
                        return raw * 1_000_000   // convert µε
                    });

                    const padded = values.length < 15 ? [...Array(15 - values.length).fill(0), ...values] : values;

                    setStrainData(padded);
                },
                (error) => {
                    console.error('Error reading strain gauge data:', error);
                }
            );

            return () => {
                unsubLoad();
                unsubStrain();
            };
        } catch (error) {
            console.error('Error initializing Firebase listeners:', error);
        }
    }, []);

    const minVal1 = Math.min(...strainData)
    const maxVal1 = Math.max(...strainData)
    const absMax1 = Math.max(Math.abs(minVal1), Math.abs(maxVal1), 10)

    const minVal2 = Math.min(...loadData)
    const maxVal2 = Math.max(...loadData)
    const absMax2 = Math.max(Math.abs(minVal2), Math.abs(maxVal2), 10)

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
                        filename: 'strain-gauge-chart',
                    },
                    svg: {
                        filename: 'strain-gauge-chart',
                    },
                    png: {
                        filename: 'strain-gauge-chart',
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
            categories: [...strainData].map((_, i) => `Strain Gauge ${strainData.length - i}`),
            labels: { show: false }
        },
        tooltip: {
            y: {
                formatter: (val: number) => `${val.toFixed(1)} µε`
            }
        },
        grid: {
            strokeDashArray: 4
        },
        yaxis: {
            min: -absMax1,
            max: absMax1,
            tickAmount: 4,
            forceNiceScale: true,
            labels: {
                formatter: (val: number) => {
                    return `${val.toFixed(1)} µε`
                }
            }
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
                        filename: 'load-cell-chart',
                    },
                    svg: {
                        filename: 'load-cell-chart',
                    },
                    png: {
                        filename: 'load-cell-chart',
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
            categories: [...loadData].map((_, i) => `Load Cell ${loadData.length - i}`),
            labels: { show: false }
        },
        tooltip: {
            enabled: true
        },
        grid: {
            strokeDashArray: 4
        },
        yaxis: {
            min: -absMax2,
            max: absMax2,
            tickAmount: 4,
            forceNiceScale: true,
        },
        // annotations: {
        //     yaxis: [{
        //         y: 0,
        //         borderColor: '#999',
        //         strokeDashArray: 4,
        //         label: {
        //             text: '0',
        //             style: { fontSize: '10px' }
        //         }
        //     }]
        // }
    }

    const series1 = [{
        name: 'Strain Gauge',
        data: strainData,
    }]

    const series2 = [{
        name: 'Load Cell',
        data: loadData,
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