import React, { useState, useMemo } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import styles from './PerformanceChart.module.css';


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

const PerformanceChart = ({ investments }) => {
  const [timeRange, setTimeRange] = useState("1Y");

  // Generate mock performance data based on investments
  const { labels, portfolioValue, benchmark } = useMemo(() => {
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    // Determine how many months to show based on time range
    let monthsToShow = 12;
    if (timeRange === "6M") monthsToShow = 6;
    if (timeRange === "3M") monthsToShow = 3;
    if (timeRange === "1M") monthsToShow = 1;

    const currentMonth = new Date().getMonth();
    const startMonth = monthsToShow === 12 ? 0 : currentMonth - monthsToShow + 1;
    const labels = months.slice(startMonth, startMonth + monthsToShow);

    // Calculate cumulative value over time
    const portfolioValue = Array(monthsToShow).fill(0);
    const benchmark = Array(monthsToShow).fill(0);

    // Apply investments
    investments.forEach(investment => {
      const monthIndex = new Date(investment.date).getMonth();
      if (monthIndex >= startMonth && monthIndex < startMonth + monthsToShow) {
        const relativeIndex = monthIndex - startMonth;
        portfolioValue[relativeIndex] += investment.amount;

        // Apply growth to subsequent months
        for (let i = relativeIndex; i < monthsToShow; i++) {
          portfolioValue[i] = (portfolioValue[i] || 0) + investment.amount * (1 + 0.015 * (i - relativeIndex));
        }
      }
    });

    // Fill in gaps and calculate benchmark
    for (let i = 1; i < monthsToShow; i++) {
      portfolioValue[i] = portfolioValue[i] || portfolioValue[i - 1] * 1.015;
      benchmark[i] = benchmark[i - 1] * 1.008 +
        (portfolioValue[i] - portfolioValue[i - 1] || 0);
    }

    // If we're showing less than full year, fill in previous months
    if (monthsToShow < 12) {
      for (let i = 0; i < portfolioValue.length; i++) {
        portfolioValue[i] = portfolioValue[i] || 0;
        benchmark[i] = benchmark[i] || 0;
      }
    }

    return {
      labels,
      portfolioValue,
      benchmark,
    };
  }, [investments, timeRange]);

  const data = {
    labels,
    datasets: [
      {
        label: "Your Portfolio",
        data: portfolioValue,
        borderColor: "#0ea5e9",
        backgroundColor: "rgba(14, 165, 233, 0.1)",
        borderWidth: 3,
        pointRadius: 4,
        pointBackgroundColor: "#0ea5e9",
        pointHoverRadius: 6,
        tension: 0.3,
        fill: true,
      },
      {
        label: "Market Benchmark",
        data: benchmark,
        borderColor: "#94a3b8",
        borderWidth: 2,
        borderDash: [5, 5],
        pointRadius: 0,
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          usePointStyle: true,
          boxWidth: 10,
          padding: 20,
          font: {
            size: 12,
            family: "'Inter', sans-serif"
          }
        },
      },
      tooltip: {
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        titleColor: "#333",
        bodyColor: "#333",
        borderColor: "#e2e8f0",
        borderWidth: 1,
        padding: 12,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: function (context) {
            return `${context.dataset.label
              }: $${context.parsed.y.toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              })}`;
          },
          title: function (context) {
            return `${context[0].label} 2023`;
          },
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
            family: "'Inter', sans-serif"
          }
        }
      },
      y: {
        grid: {
          color: "rgba(0, 0, 0, 0.05)",
          drawBorder: false,
        },
        ticks: {
          callback: function (value) {
            if (value >= 1000000) return "$" + (value / 1000000).toFixed(1) + "M";
            if (value >= 1000) return "$" + (value / 1000).toFixed(0) + "K";
            return "$" + value;
          },
          font: {
            size: 11,
            family: "'Inter', sans-serif"
          }
        },
      },
    },
    interaction: {
      intersect: false,
      mode: "index",
    },
    animations: {
      tension: {
        duration: 1000,
        easing: 'linear'
      }
    }
  };

  // Calculate performance metrics
  const currentValue = portfolioValue[portfolioValue.length - 1] || 0;
  const initialInvestment = investments.reduce(
    (sum, inv) => sum + inv.amount,
    0
  );
  const growth = currentValue - initialInvestment;
  const growthPercentage =
    initialInvestment > 0 ? ((growth / initialInvestment) * 100).toFixed(1) : 0;

  const timeFilters = ["1M", "3M", "6M", "1Y"];

  return (
    <div className={styles.performanceChart}>
      <div className={styles.chartHeader}>
        <div className={styles.headerContent}>
          <div>
            <h3 className={styles.chartTitle}>Portfolio Performance</h3>
            <p className={styles.chartSubtitle}>Track your investment growth over time</p>
          </div>
          <div className={styles.timeFilters}>
            {timeFilters.map(filter => (
              <button
                key={filter}
                className={`${styles.timeFilter} ${timeRange === filter ? styles.timeFilterActive : ""
                  }`}
                onClick={() => setTimeRange(filter)}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className={styles.chartContainer}>
        <div className={styles.metricsGrid}>
          <div className={`${styles.metricCard} ${styles.metricCardPrimary}`}>
            <div className={styles.metricLabel}>Current Value</div>
            <div className={styles.metricValue}>
              ${currentValue.toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              })}
            </div>
            <div className={styles.metricBadgeContainer}>
              <span className={`${styles.metricBadge} ${styles.metricBadgePrimary}`}>Live</span>
              <span className={styles.metricBadgeText}>Updated just now</span>
            </div>
          </div>

          <div className={`${styles.metricCard} ${styles.metricCardNeutral}`}>
            <div className={styles.metricLabel}>Growth</div>
            <div className={`${styles.metricValue} ${growth >= 0 ? styles.metricGrowthPositive : styles.metricGrowthNegative
              }`}>
              {growth >= 0 ? "+" : "-"}${Math.abs(growth).toLocaleString(undefined, {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
              })} <span className={styles.metricPercentage}>({growthPercentage}%)</span>
            </div>
            <div className={styles.metricTrend}>
              <svg
                className={`${styles.trendIcon} ${growth < 0 ? styles.trendIconNegative : ""
                  }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
              </svg>
              <span className={styles.trendText}>
                {growth >= 0 ? "Above" : "Below"} benchmark
              </span>
            </div>
          </div>
        </div>

        <div className={styles.chartWrapper}>
          <Line data={data} options={options} />
        </div>
      </div>

      <div className={styles.chartFooter}>
        <div className={styles.footerContent}>
          <div className={styles.legendContainer}>
            <div className={styles.legendItem}>
              <div className={styles.legendColor} style={{ backgroundColor: "#0ea5e9" }}></div>
              <span className={styles.legendLabel}>Your Portfolio</span>
            </div>
            <div className={styles.legendItem}>
              <div className={styles.legendColor} style={{ backgroundColor: "#94a3b8" }}></div>
              <span className={styles.legendLabel}>Market Benchmark</span>
            </div>
          </div>

          <div className={styles.footerNote}>
            Performance calculated since first investment
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerformanceChart;