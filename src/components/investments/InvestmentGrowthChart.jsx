import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import styles from './Investments.module.css';

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

const InvestmentGrowthChart = ({ investment, project }) => {
    // Calculate growth data points
    const investmentDate = new Date(investment.date);
    const today = new Date();
    const monthsDiff = Math.floor(
        (today.getFullYear() - investmentDate.getFullYear()) * 12 +
        (today.getMonth() - investmentDate.getMonth())
    );

    // Generate labels and data
    const labels = [];
    const investmentData = [];
    const benchmarkData = [];

    // Monthly growth rates
    const investmentMonthlyGrowth = 1.17; // 15% annual ≈ 1.17% monthly
    const benchmarkMonthlyGrowth = 0.64; // 8% annual ≈ 0.64% monthly

    for (let i = 0; i <= monthsDiff; i++) {
        const date = new Date(investmentDate);
        date.setMonth(investmentDate.getMonth() + i);

        labels.push(date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }));

        // Calculate investment growth
        const investmentValue = investment.amount * Math.pow(1 + investmentMonthlyGrowth / 100, i);
        investmentData.push(investmentValue);

        // Calculate benchmark growth
        const benchmarkValue = investment.amount * Math.pow(1 + benchmarkMonthlyGrowth / 100, i);
        benchmarkData.push(benchmarkValue);
    }

    const currentValue = investmentData[investmentData.length - 1];
    const benchmarkValue = benchmarkData[benchmarkData.length - 1];
    const growthPercentage = ((currentValue - investment.amount) / investment.amount * 100).toFixed(1);
    const benchmarkPercentage = ((benchmarkValue - investment.amount) / investment.amount * 100).toFixed(1);

    const chartData = {
        labels,
        datasets: [
            {
                label: 'Your Investment',
                data: investmentData,
                borderColor: '#0ea5e9',
                backgroundColor: 'rgba(14, 165, 233, 0.05)',
                borderWidth: 3,
                pointRadius: 0,
                tension: 0.4,
                fill: true,
            },
            {
                label: 'Market Benchmark',
                data: benchmarkData,
                borderColor: '#94a3b8',
                borderWidth: 2,
                borderDash: [5, 5],
                pointRadius: 0,
                tension: 0.4,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    usePointStyle: true,
                    padding: 20,
                    font: {
                        size: 12,
                    }
                },
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        let label = context.dataset.label || '';
                        if (label) label += ': ';
                        if (context.parsed.y !== null) {
                            label += new Intl.NumberFormat('en-US', {
                                style: 'currency',
                                currency: 'USD',
                                maximumFractionDigits: 0
                            }).format(context.parsed.y);
                        }
                        return label;
                    }
                }
            }
        },
        scales: {
            x: {
                grid: {
                    display: false,
                },
                ticks: {
                    maxRotation: 0,
                    autoSkip: true,
                    maxTicksLimit: 6
                }
            },
            y: {
                grid: {
                    color: 'rgba(0, 0, 0, 0.05)',
                },
                ticks: {
                    callback: function (value) {
                        return '$' + value.toLocaleString('en-US', {
                            maximumFractionDigits: 0
                        });
                    }
                }
            }
        },
        animation: {
            duration: 1000,
            easing: 'easeOutQuart'
        }
    };

    return (
        <div className={styles.chartContainer}>
            <div className={styles.chartWrapper}>
                <Line data={chartData} options={chartOptions} />
            </div>

            <div className={styles.chartMetrics}>
                <div className={styles.metric}>
                    <span className={styles.metricLabel}>Your Growth</span>
                    <span className={styles.metricValuePositive}>+{growthPercentage}%</span>
                </div>
                <div className={styles.metric}>
                    <span className={styles.metricLabel}>Benchmark</span>
                    <span className={styles.metricValueNeutral}>+{benchmarkPercentage}%</span>
                </div>
                <div className={styles.metric}>
                    <span className={styles.metricLabel}>Outperformance</span>
                    <span className={styles.metricValuePositive}>
                        +{(growthPercentage - benchmarkPercentage).toFixed(1)}%
                    </span>
                </div>
            </div>
        </div>
    );
};

export default InvestmentGrowthChart;