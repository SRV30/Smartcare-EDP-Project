/* eslint-disable no-unused-vars */
import { Line } from "react-chartjs-2";
import React, { useState, useEffect } from "react";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title,
  Filler,
} from "chart.js";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Title,
  Filler
);

const HealthChart = ({ stream, title = "Health Metrics" }) => {
  const [activeDataset, setActiveDataset] = useState(null);

  const labels = stream.map((_, idx) => `${idx + 1}s`);
  const heartData = stream.map((item) => item.heartRate);
  const spo2Data = stream.map((item) => item.spo2);
  const tempData = stream.map((item) => item.temperature);

  const maxHeart = Math.max(...heartData);
  const minHeart = Math.min(...heartData);
  const maxSpo2 = Math.max(...spo2Data);
  const minTemp = Math.min(...tempData);
  const maxTemp = Math.max(...tempData);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Heart Rate (BPM)",
        data: heartData,
        borderColor: "rgb(239, 68, 68)",
        backgroundColor: "rgba(239, 68, 68, 0.05)",
        pointBackgroundColor: "rgb(239, 68, 68)",
        pointBorderColor: "#fff",
        pointRadius: (ctx) => (activeDataset === 0 ? 4 : 3),
        pointHoverRadius: 6,
        borderWidth: (ctx) => (activeDataset === 0 ? 3 : 2),
        tension: 0.3,
        fill: true,
        order: 1,
        yAxisID: "y",
      },
      {
        label: "SpO2 (%)",
        data: spo2Data,
        borderColor: "rgb(59, 130, 246)",
        backgroundColor: "rgba(59, 130, 246, 0.05)",
        pointBackgroundColor: "rgb(59, 130, 246)",
        pointBorderColor: "#fff",
        pointRadius: (ctx) => (activeDataset === 1 ? 4 : 3),
        pointHoverRadius: 6,
        borderWidth: (ctx) => (activeDataset === 1 ? 3 : 2),
        tension: 0.3,
        fill: true,
        order: 2,
        yAxisID: "y1",
      },
      {
        label: "Temperature (°F)",
        data: tempData,
        borderColor: "rgb(245, 158, 11)",
        backgroundColor: "rgba(245, 158, 11, 0.05)",
        pointBackgroundColor: "rgb(245, 158, 11)",
        pointBorderColor: "#fff",
        pointRadius: (ctx) => (activeDataset === 2 ? 4 : 3),
        pointHoverRadius: 6,
        borderWidth: (ctx) => (activeDataset === 2 ? 3 : 2),
        tension: 0.3,
        fill: true,
        order: 3,
        yAxisID: "y2",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        align: "center",
        labels: {
          boxWidth: 15,
          usePointStyle: true,
          pointStyle: "circle",
          padding: 20,
          color: "rgb(209, 213, 219)",
          font: {
            family: "'Inter', sans-serif",
            size: 12,
            weight: "600",
          },
        },
      },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: "rgba(17, 24, 39, 0.9)",
        titleColor: "rgb(243, 244, 246)",
        bodyColor: "rgb(243, 244, 246)",
        borderColor: "rgba(75, 85, 99, 0.3)",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        titleFont: {
          family: "'Inter', sans-serif",
          size: 14,
          weight: "600",
        },
        bodyFont: {
          family: "'Inter', sans-serif",
          size: 12,
        },
        callbacks: {
          title: (tooltipItems) => {
            return `Time: ${tooltipItems[0].label}`;
          },
          label: (context) => {
            let label = context.dataset.label || "";
            if (label) {
              label += ": ";
            }
            if (context.parsed.y !== null) {
              if (context.datasetIndex === 0) {
                label += `${context.parsed.y} BPM`;
              } else if (context.datasetIndex === 1) {
                label += `${context.parsed.y}%`;
              } else {
                label += `${context.parsed.y}°F`;
              }
            }
            return label;
          },
        },
      },
      title: {
        display: true,
        text: title,
        color: "rgb(243, 244, 246)",
        font: {
          family: "'Inter', sans-serif",
          size: 18,
          weight: "700",
        },
        padding: {
          top: 10,
          bottom: 20,
        },
      },
    },
    interaction: {
      mode: "index",
      intersect: false,
    },
    hover: {
      mode: "index",
      intersect: false,
    },
    scales: {
      x: {
        grid: {
          color: "rgba(107, 114, 128, 0.1)",
          tickLength: 8,
          drawBorder: false,
        },
        ticks: {
          color: "rgb(156, 163, 175)",
          font: {
            family: "'Inter', sans-serif",
            size: 11,
          },
          maxRotation: 0,
          callback: (value, index) => {
            return index % 3 === 0 ? labels[index] : "";
          },
        },
        title: {
          display: true,
          text: "Time Elapsed",
          color: "rgb(156, 163, 175)",
          font: {
            family: "'Inter', sans-serif",
            size: 12,
            weight: "600",
          },
          padding: { top: 10 },
        },
      },
      y: {
        type: "linear",
        display: true,
        position: "left",
        min: Math.max(minHeart - 10, 0),
        max: maxHeart + 10,
        grid: {
          color: "rgba(107, 114, 128, 0.1)",
          drawBorder: false,
        },
        ticks: {
          color: "rgb(239, 68, 68)",
          font: {
            family: "'Inter', sans-serif",
            size: 11,
            weight: "500",
          },
        },
        title: {
          display: true,
          text: "Heart Rate",
          color: "rgb(239, 68, 68)",
          font: {
            family: "'Inter', sans-serif",
            size: 12,
            weight: "600",
          },
        },
      },
      y1: {
        type: "linear",
        display: true,
        position: "right",
        min: Math.max(Math.floor(maxSpo2 * 0.95), 80),
        max: 100,
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          color: "rgb(59, 130, 246)",
          font: {
            family: "'Inter', sans-serif",
            size: 11,
            weight: "500",
          },
        },
        title: {
          display: true,
          text: "SpO2",
          color: "rgb(59, 130, 246)",
          font: {
            family: "'Inter', sans-serif",
            size: 12,
            weight: "600",
          },
        },
      },
      y2: {
        type: "linear",
        display: true,
        position: "right",
        grid: {
          drawOnChartArea: false,
        },
        min: minTemp - 1,
        max: maxTemp + 1,
        ticks: {
          color: "rgb(245, 158, 11)",
          font: {
            family: "'Inter', sans-serif",
            size: 11,
            weight: "500",
          },
        },
        title: {
          display: true,
          text: "Temperature",
          color: "rgb(245, 158, 11)",
          font: {
            family: "'Inter', sans-serif",
            size: 12,
            weight: "600",
          },
        },
      },
    },
    animation: {
      duration: 700,
      easing: "easeOutQuart",
    },
  };

  const handleHover = (event, elements) => {
    if (elements && elements.length) {
      setActiveDataset(elements[0].datasetIndex);
    } else {
      setActiveDataset(null);
    }
  };

  useEffect(() => {
    const chart = document.getElementById("health-metrics-chart");
    if (chart) {
      chart.addEventListener("mousemove", handleHover);
      return () => {
        chart.removeEventListener("mousemove", handleHover);
      };
    }
  }, []);

  return (
    <div className="bg-gray-900 p-6 rounded-xl shadow-xl border border-gray-800 w-full ">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex gap-6">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
            <span className="text-gray-300 text-sm font-medium">
              Heart Rate
            </span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
            <span className="text-gray-300 text-sm font-medium">SpO2</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-amber-500 mr-2"></div>
            <span className="text-gray-300 text-sm font-medium">
              Temperature
            </span>
          </div>
        </div>
        <div className="text-gray-400 text-xs font-medium bg-gray-800 px-3 py-1 rounded-full">
          Live Monitoring
        </div>
      </div>

      <div className="relative h-64 md:h-80">
        <Line
          id="health-metrics-chart"
          data={chartData}
          options={chartOptions}
        />
      </div>
    </div>
  );
};

export default HealthChart;
