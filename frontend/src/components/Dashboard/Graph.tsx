import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
  Filler,
  ChartOptions,
  ChartData,
} from "chart.js";
import { motion } from "framer-motion";

// Register Chart.js components
ChartJS.register(
  BarElement,
  Tooltip,
  CategoryScale,
  LinearScale,
  Legend,
  Filler
);

interface GraphItem {
  clickDate: string;
  count: number;
}

interface GraphProps {
  graphData: GraphItem[];
}

const Graph: React.FC<GraphProps> = ({ graphData }) => {
  // Determine if we have real data
  const hasData = graphData && graphData.length > 0;

  // 1. Prepare Data
  const labels = hasData
    ? graphData.map((item) => item.clickDate)
    : ["", "", "", "", "", "", "", "", "", ""]; // Skeleton labels

  const dataPoints = hasData
    ? graphData.map((item) => item.count)
    : [2, 4, 3, 5, 2, 6, 4, 3, 5, 4]; // Skeleton pattern

  // 2. Chart Configuration
  const data: ChartData<'bar'> = {
    labels: labels,
    datasets: [
      {
        label: hasData ? "Clicks" : "No Data",
        data: dataPoints,
        // Gradient-like Blue for data, subtle Gray for skeleton
        backgroundColor: hasData ? "#3b82f6" : "#f1f5f9",
        hoverBackgroundColor: hasData ? "#2563eb" : "#f1f5f9",
        borderRadius: 4, // Modern rounded corners
        barThickness: 24, // Thicker, more substantial bars
        maxBarThickness: 40,
      },
    ],
  };

  // 3. Chart Options (Styling)
  const options: ChartOptions<'bar'> = {
    maintainAspectRatio: false,
    responsive: true,
    animation: {
      duration: 800,
      easing: "easeOutQuart",
    },
    plugins: {
      legend: {
        display: false, // Hide legend for cleaner look
      },
      tooltip: {
        enabled: hasData, // Disable tooltip for skeleton state
        backgroundColor: "#1e293b", // Slate-800
        titleColor: "#ffffff",
        bodyColor: "#e2e8f0",
        padding: 10,
        cornerRadius: 8,
        displayColors: false, // Remove the color box in tooltip
        callbacks: {
            title: (items) => `Date: ${items[0].label}`,
            label: (item) => `Clicks: ${item.raw}`,
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        border: {
          display: false, // Remove ugly axis border
        },
        grid: {
          color: "#f1f5f9", // Very subtle grid lines
          tickLength: 0,
        },
        ticks: {
          color: "#94a3b8", // Slate-400 text
          font: { family: "sans-serif", size: 11 },
          padding: 10,
          stepSize: 1, // Ensure integers only
          callback: function (value) {
            if (Number.isInteger(value)) return value.toString();
            return "";
          },
        },
      },
      x: {
        border: {
          display: false,
        },
        grid: {
          display: false, // Clean look: no vertical grid lines
        },
        ticks: {
          color: "#64748b", // Slate-500
          font: { family: "sans-serif", size: 12 },
          padding: 10,
          maxRotation: 45,
          minRotation: 0,
        },
      },
    },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full bg-white rounded-xl shadow-sm border border-slate-100 p-5"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-slate-800">
            Click Performance
        </h2>
        {hasData && (
             <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full border border-green-100">
               Live Data
             </span>
        )}
      </div>

      {/* Chart Container */}
      <div className="relative h-[300px] w-full">
         <Bar data={data} options={options} />

         {/* Overlay text for Empty State */}
         {!hasData && (
             <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                 <p className="text-slate-400 text-sm font-medium bg-white/80 backdrop-blur-sm px-4 py-2 rounded-lg shadow-sm border border-slate-100">
                    No analytics available for this period
                 </p>
             </div>
         )}
      </div>
    </motion.div>
  );
};

export default Graph;