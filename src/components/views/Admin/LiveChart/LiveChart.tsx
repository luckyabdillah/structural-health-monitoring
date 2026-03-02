import { Card, CardBody, CardHeader } from "@nextui-org/react"
import { Button } from "@nextui-org/react"
import dynamic from 'next/dynamic'
import type { ApexOptions } from 'apexcharts'
import { useEffect, useState } from "react"
import { onValue, query, ref } from "firebase/database"
import { database } from "@/libs/firebase/client"
import { loadCellRef } from "@/libs/firebase/client"

const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

type MetricKey = 'avgVoltage' | 'deltaL' | 'load' | 'strain' | 'stress' | 'vr'

interface MetricConfig {
    key: MetricKey
    label: string
    color: string
    unit: string
    formatter: (val: number) => string
}

const METRICS: MetricConfig[] = [
    { key: 'strain', label: 'Strain', color: '#3B82F6', unit: 'µε', formatter: (v) => `${(v * 1_000_000).toFixed(2)} µε` },
    { key: 'stress', label: 'Stress', color: '#EF4444', unit: 'Pa', formatter: (v) => `${(v / 1_000_000).toFixed(2)}M Pa` },
    { key: 'load', label: 'Load', color: '#10B981', unit: '%', formatter: (v) => `${v.toFixed(2)}%` },
    { key: 'deltaL', label: 'Delta L', color: '#F59E0B', unit: 'mm', formatter: (v) => `${(v * 1000).toFixed(3)} mm` },
    { key: 'avgVoltage', label: 'Avg Voltage', color: '#8B5CF6', unit: 'V', formatter: (v) => `${v.toFixed(4)} V` },
    { key: 'vr', label: 'Vr', color: '#06B6D4', unit: 'V', formatter: (v) => `${(v * 1_000_000).toFixed(2)} µV` },
]

const LiveChart = () => {
    const [metricsData, setMetricsData] = useState<Record<MetricKey, number[]>>({
        strain: [],
        stress: [],
        load: [],
        deltaL: [],
        avgVoltage: [],
        vr: [],
    })
    const [selectedMetrics, setSelectedMetrics] = useState<MetricKey[]>(['strain'])
    const [loadCellData, setLoadCellData] = useState<number[]>([])

    useEffect(() => {
        if (!process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL) {
            console.error('Firebase configuration missing. Please create .env.local file.');
            return;
        }

        try {
            const strainGaugesRef = ref(database, 'strainGauges');
            const loadCellQuery = query(loadCellRef);

            const unsubscribeStrain = onValue(
                strainGaugesRef,
                (snapshot) => {
                    const data = snapshot.val();
                    if (!data) return;

                    const timestamps = Object.keys(data)
                        .map(Number)
                        .filter(t => !isNaN(t))
                        .sort((a, b) => a - b);
                    
                    const last15 = timestamps.slice(-15);

                    // Extract data untuk setiap metric
                    const newMetricsData: Record<MetricKey, number[]> = {
                        strain: [],
                        stress: [],
                        load: [],
                        deltaL: [],
                        avgVoltage: [],
                        vr: [],
                    };

                    last15.forEach(ts => {
                        const record = data[ts];
                        newMetricsData.strain.push(record?.strain ?? 0);
                        newMetricsData.stress.push(record?.stress ?? 0);
                        newMetricsData.load.push(record?.load ?? 0);
                        newMetricsData.deltaL.push(record?.deltaL ?? 0);
                        newMetricsData.avgVoltage.push(record?.avgVoltage ?? 0);
                        newMetricsData.vr.push(record?.vr ?? 0);
                    });

                    setMetricsData(newMetricsData);
                },
                (error) => {
                    console.error('Error reading strain gauge data:', error);
                }
            );

            const unsubscribeLoadCell = onValue(
                loadCellQuery,
                (snapshot) => {
                    const data = snapshot.val();
                    if (!data) return;

                    const timestamps = Object.keys(data).map(Number).filter(t => !isNaN(t)).sort((a, b) => a - b);
                    const last15 = timestamps.slice(-15);
                    const values = last15.map(ts => data[ts]?.load ?? 0);

                    const padded = values.length < 15 ? [...Array(15 - values.length).fill(0), ...values] : values;

                    setLoadCellData(padded);
                },
                (error) => {
                    console.error('Error reading load cell data:', error);
                }
            );

            return () => {
                unsubscribeStrain();
                unsubscribeLoadCell();
            };
        } catch (error) {
            console.error('Error initializing Firebase listeners:', error);
        }
    }, []);

    const toggleMetric = (metricKey: MetricKey) => {
        setSelectedMetrics(prev => 
            prev.includes(metricKey)
                ? prev.filter(m => m !== metricKey)
                : [...prev, metricKey]
        )
    }

    // Build dynamic series berdasarkan selected metrics
    const series = selectedMetrics.map(metricKey => {
        const config = METRICS.find(m => m.key === metricKey)!
        return {
            name: config.label,
            data: metricsData[metricKey],
        }
    })

    // Calculate min/max untuk y-axis berdasarkan selected metrics
    const selectedData = selectedMetrics.flatMap(key => metricsData[key])
    const minVal = selectedData.length > 0 ? Math.min(...selectedData) : 0
    const maxVal = selectedData.length > 0 ? Math.max(...selectedData) : 10
    const absMax = Math.max(Math.abs(minVal), Math.abs(maxVal))
    
    // Set symmetric y-axis
    const yaxisConfig = selectedMetrics.length > 0
        ? { min: -absMax, max: absMax, tickAmount: 4, forceNiceScale: true }
        : { forceNiceScale: true }

    // Color palette untuk series
    const colors = selectedMetrics.map(key => {
        const config = METRICS.find(m => m.key === key)!
        return config.color
    })

    // Format untuk tooltip
    const getFormatterForMetric = (metricKey: MetricKey) => {
        const config = METRICS.find(m => m.key === metricKey)!
        return config.formatter
    }

    const chartOptions: ApexOptions = {
        chart: {
            id: 'live-metrics-chart',
            zoom: { enabled: false },
            toolbar: {
                show: false,
            },
        },
        stroke: {
            curve: 'smooth',
            width: 2
        },
        colors: colors,
        dataLabels: {
            enabled: false
        },
        markers: {
            size: 0
        },
        xaxis: {
            categories: metricsData.strain.map((_, i) => `${metricsData.strain.length - i}`),
            labels: { show: false }
        },
        tooltip: {
            y: {
                formatter: (val: number, { series, seriesIndex, dataPointIndex }) => {
                    const metricKey = selectedMetrics[seriesIndex]
                    const formatter = getFormatterForMetric(metricKey)
                    return formatter(val)
                }
            }
        },
        grid: {
            strokeDashArray: 4
        },
        yaxis: {
            ...yaxisConfig,
            labels: {
                formatter: (val: number) => {
                    return val.toFixed(2)
                }
            }
        },
        legend: {
            position: 'top',
            horizontalAlign: 'right',
        }
    }

    return (
        <div className="max-w-6xl mx-auto py-3">
            <div className="grid grid-cols-1 gap-4">
                <Card>
                    <CardHeader className="flex flex-col gap-3 px-5 pt-4 pb-2">
                        <h3 className="text-md font-semibold">Strain Gauge Data</h3>
                        <div className="flex flex-wrap gap-2">
                            {METRICS.map(metric => (
                                <Button
                                    key={metric.key}
                                    size="sm"
                                    variant={selectedMetrics.includes(metric.key) ? 'solid' : 'bordered'}
                                    style={selectedMetrics.includes(metric.key) ? { backgroundColor: metric.color } : {}}
                                    onPress={() => toggleMetric(metric.key)}
                                    className={selectedMetrics.includes(metric.key) ? 'text-white' : ''}
                                >
                                    {metric.label}
                                </Button>
                            ))}
                        </div>
                    </CardHeader>
                    <CardBody className="px-5 py-4 flex flex-col justify-between">
                        {series.length > 0 ? (
                            <div className="pe-2">
                                <Chart options={chartOptions} series={series} type="area" height={400} />
                            </div>
                        ) : (
                            <div className="flex items-center justify-center h-96 text-gray-500">
                                Pilih minimal satu metric untuk menampilkan chart
                            </div>
                        )}
                    </CardBody>
                </Card>

                <Card>
                    <CardHeader className="flex flex-col gap-3 px-5 pt-4 pb-2">
                        <h3 className="text-md font-semibold">Load Cell Data</h3>
                    </CardHeader>
                    <CardBody className="px-5 py-4 flex flex-col justify-between">
                        <div className="pe-2">
                            <Chart 
                                options={{
                                    chart: {
                                        id: 'load-cell-chart',
                                        zoom: { enabled: false },
                                        toolbar: {
                                            show: false,
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
                                        categories: loadCellData.map((_, i) => `${loadCellData.length - i}`),
                                        labels: { show: false }
                                    },
                                    tooltip: {
                                        y: {
                                            formatter: (val: number) => `${val.toFixed(1)} g`
                                        }
                                    },
                                    grid: {
                                        strokeDashArray: 4
                                    },
                                    yaxis: {
                                        labels: {
                                            formatter: (val: number) => {
                                                return `${val.toFixed(1)} g`
                                            }
                                        }
                                    }
                                } as ApexOptions}
                                series={[{
                                    name: 'Load Cell',
                                    data: loadCellData,
                                }]}
                                type="area"
                                height={320}
                            />
                        </div>
                    </CardBody>
                </Card>
            </div>
        </div>
    )
}

export default LiveChart