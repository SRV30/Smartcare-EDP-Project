import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const HealthChart = ({ stream }) => {
  const labels = stream.map((_, idx) => `${idx + 1}s`);
  const heartData = stream.map((item) => item.heartRate);
  const spo2Data = stream.map((item) => item.spo2);
  const tempData = stream.map((item) => item.temperature);

  const chartData = {
    labels,
    datasets: [
      {
        label: "❤️ Heart Rate",
        data: heartData,
        borderColor: "rgb(248, 113, 113)", // red-400
        backgroundColor: "rgba(248, 113, 113, 0.1)",
        tension: 0.4,
      },
      {
        label: "🫁 SpO2",
        data: spo2Data,
        borderColor: "rgb(96, 165, 250)", // sky-400
        backgroundColor: "rgba(96, 165, 250, 0.1)",
        tension: 0.4,
      },
      {
        label: "🌡️ Temperature",
        data: tempData,
        borderColor: "rgb(251, 191, 36)", // amber-400
        backgroundColor: "rgba(251, 191, 36, 0.1)",
        tension: 0.4,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: "white",
        },
      },
    },
    scales: {
      x: {
        ticks: { color: "white" },
        grid: { color: "rgba(255, 255, 255, 0.1)" },
      },
      y: {
        ticks: { color: "white" },
        grid: { color: "rgba(255, 255, 255, 0.1)" },
      },
    },
  };

  return (
    <div className="bg-gray-800 p-4 rounded-xl shadow-md w-full max-w-4xl">
      <Line data={chartData} options={chartOptions} />
    </div>
  );
};

export default HealthChart;
