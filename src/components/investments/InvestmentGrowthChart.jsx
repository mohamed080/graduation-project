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

const InvestmentGrowthChart = ({ investment }) => {
    // Calculate growth data points
    const investmentDate = new Date(investment.date);
    const today = new Date();

    const isSameMonth = investmentDate.getMonth() === today.getMonth() &&
        investmentDate.getFullYear() === today.getFullYear();

    // Generate labels and data
    const labels = [];
    const investmentData = [];
    const benchmarkData = [];

    // CORRECTED: Use decimal multipliers (not percentages)
    const investmentMonthlyRate = 1.15 ** (1 / 12); // 15% annual
    const benchmarkMonthlyRate = 1.08 ** (1 / 12); // 8% annual

    if (isSameMonth) {
        // Handle same-month investment (use days)
        const daysDiff = Math.ceil((today - investmentDate) / (1000 * 60 * 60 * 24));

        for (let i = 0; i <= daysDiff; i++) {
            const date = new Date(investmentDate);
            date.setDate(investmentDate.getDate() + i);
            labels.push(date.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }));

            // Daily growth (approximate)
            const dailyMultiplier = 1 + (1.15 - 1) / 365;
            investmentData.push(investment.amount * dailyMultiplier ** i);
            benchmarkData.push(investment.amount * (1 + (1.08 - 1) / 365) ** i);
        }
    } else {
        // Handle multi-month investment
        const monthsDiff = (today.getFullYear() - investmentDate.getFullYear()) * 12 +
            (today.getMonth() - investmentDate.getMonth());

        for (let i = 0; i <= monthsDiff; i++) {
            const date = new Date(investmentDate);
            date.setMonth(investmentDate.getMonth() + i);
            labels.push(date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }));

            investmentData.push(investment.amount * investmentMonthlyRate ** i);
            benchmarkData.push(investment.amount * benchmarkMonthlyRate ** i);
        }
    }

    const currentValue = investmentData[investmentData.length - 1];
    const benchmarkValue = benchmarkData[benchmarkData.length - 1];
    const growthPercentage = ((currentValue - investment.amount) / investment.amount * 100).toFixed(2);
    const benchmarkPercentage = ((benchmarkValue - investment.amount) / investment.amount * 100).toFixed(2);
  const isSmallDataset = investmentData.length <= 2;

    const chartData = {
        labels,
        datasets: [
            {
                label: 'Your Investment',
                data: investmentData,
                borderColor: '#0ea5e9',
                backgroundColor: 'rgba(14, 165, 233, 0.05)',
                borderWidth: 3,
                pointRadius: isSmallDataset ? 4 : 0,
                pointHoverRadius: 6,
                tension: 0.4,
                fill: true,
            },
            {
                label: 'Market Benchmark',
                data: benchmarkData,
                borderColor: '#94a3b8',
                borderWidth: 2,
                borderDash: [5, 5],
                pointRadius: isSmallDataset ? 4 : 0,
                pointHoverRadius: 6,
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