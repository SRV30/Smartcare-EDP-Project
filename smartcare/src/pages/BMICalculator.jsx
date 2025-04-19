import React, { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";
import { getBmiData, saveOrUpdateBmi } from "../api/auth";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  LabelList,
  ResponsiveContainer,
  ReferenceLine,
  Cell,
  CartesianGrid,
  LineChart,
  Line,
  Legend,
} from "recharts";

const BMICalculator = () => {
  const [user, setUser] = useState(null);
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBmi] = useState(null);
  const [bmiCategory, setBmiCategory] = useState("");
  const [bmiHistory, setBmiHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const getBmiCategory = (bmiValue) => {
    const bmi = parseFloat(bmiValue);
    if (bmi < 18.5) return "Underweight";
    else if (bmi >= 18.5 && bmi < 24.9) return "Normal weight";
    else if (bmi >= 25 && bmi < 29.9) return "Overweight";
    else return "Obesity";
  };

  const getCategoryColor = (bmiValue) => {
    const bmi = parseFloat(bmiValue);
    if (bmi < 18.5) return "#38bdf8";
    else if (bmi >= 18.5 && bmi < 24.9) return "#22c55e";
    else if (bmi >= 25 && bmi < 29.9) return "#facc15";
    else return "#ef4444";
  };

  const calculateBmi = useCallback((h, w) => {
    if (!h || !w) return;

    const hMeters = h / 100;
    const result = (w / (hMeters * hMeters)).toFixed(2);
    setBmi(result);
    setBmiCategory(getBmiCategory(result));
    saveBmiHistory(result);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const saveBmiHistory = (newBmi) => {
    const newHistory = [
      ...bmiHistory,
      { date: new Date().toLocaleString(), bmi: newBmi },
    ];
    setBmiHistory(newHistory);
  };

  useEffect(() => {
    const storedUser = localStorage.getItem("smartcare_user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);

      const fetchBmi = async () => {
        setIsLoading(true);
        try {
          const res = await getBmiData(parsedUser.id);
          const { height, weight } = res.data;
          setHeight(height);
          setWeight(weight);
          calculateBmi(height, weight);
        } catch (error) {
          console.log("No BMI data found yet", error);
        } finally {
          setIsLoading(false);
        }
      };

      fetchBmi();
    }
  }, [calculateBmi]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("User not found!");

    setIsLoading(true);
    try {
      await saveOrUpdateBmi({ userId: user.id, height, weight });
      calculateBmi(height, weight);
      toast.success("BMI data saved successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save BMI data");
    } finally {
      setIsLoading(false);
    }
  };

  const bmiRangeData = [
    { name: "Underweight", bmiStart: 10, bmiEnd: 18.5, color: "#38bdf8" },
    { name: "Normal", bmiStart: 18.5, bmiEnd: 24.9, color: "#22c55e" },
    { name: "Overweight", bmiStart: 24.9, bmiEnd: 29.9, color: "#facc15" },
    { name: "Obese", bmiStart: 29.9, bmiEnd: 40, color: "#ef4444" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-zinc-900 text-sky-400 px-4 py-12">
      <div className="w-full max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            <span className="text-sky-400">Smart</span>
            <span className="relative">
              Care
              <span className="absolute -bottom-1 left-0 w-full h-1 bg-gradient-to-r from-sky-500 to-sky-300 rounded-full"></span>
            </span>
          </h1>
          <p className="text-zinc-400 text-lg">
            Track, analyze and improve your BMI metrics
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-zinc-900/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-zinc-800 hover:border-sky-800 transition-all duration-500 group">
              <form onSubmit={handleSubmit}>
                <h2 className="text-2xl font-bold text-center text-white mb-6 flex items-center justify-center">
                  <span className="inline-block mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 text-sky-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                  </span>
                  Calculate Your BMI
                </h2>

                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2 text-sky-300">
                    Height (cm)
                  </label>
                  <div className="relative group">
                    <input
                      type="number"
                      value={height}
                      onChange={(e) => setHeight(e.target.value)}
                      className="w-full p-3 rounded-lg bg-zinc-800/60 text-white outline-none border border-zinc-700 focus:border-sky-500 ring-0 focus:ring-2 focus:ring-sky-500/20 transition-all duration-300"
                      placeholder="Enter height in cm"
                      required
                    />
                    <span className="absolute right-3 top-3 text-zinc-500">
                      cm
                    </span>
                  </div>
                </div>

                <div className="mb-8">
                  <label className="block text-sm font-medium mb-2 text-sky-300">
                    Weight (kg)
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      className="w-full p-3 rounded-lg bg-zinc-800/60 text-white outline-none border border-zinc-700 focus:border-sky-500 ring-0 focus:ring-2 focus:ring-sky-500/20 transition-all duration-300"
                      placeholder="Enter weight in kg"
                      required
                    />
                    <span className="absolute right-3 top-3 text-zinc-500">
                      kg
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 rounded-lg bg-gradient-to-r from-sky-600 to-sky-500 hover:from-sky-500 hover:to-sky-400 text-white font-semibold transition-all duration-300 shadow-lg shadow-sky-500/20 relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center justify-center">
                    {isLoading ? (
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                    ) : null}
                    Calculate & Save BMI
                  </span>
                  <span className="absolute w-0 h-full bg-white/10 top-0 left-0 group-hover:w-full transition-all duration-500"></span>
                </button>

                {bmi && (
                  <div className="mt-8 p-6 rounded-xl bg-zinc-800/30 text-center backdrop-blur-sm border border-zinc-700 transform transition-all duration-500 hover:scale-105">
                    <h3 className="text-white text-lg mb-3">Your Result</h3>
                    <div
                      className="text-5xl font-bold"
                      style={{ color: getCategoryColor(bmi) }}
                    >
                      {bmi}
                    </div>
                    <p
                      className="text-lg font-medium mt-2 uppercase tracking-wide"
                      style={{ color: getCategoryColor(bmi) }}
                    >
                      {bmiCategory}
                    </p>
                  </div>
                )}
              </form>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <div className="bg-zinc-900/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-zinc-800 h-full">
              <h3 className="text-xl font-semibold text-white mb-5 flex items-center">
                <span className="inline-block mr-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-sky-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                </span>
                BMI Categories
              </h3>
              <div className="h-64 md:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    layout="horizontal"
                    data={bmiRangeData}
                    margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
                    barGap={0}
                    barCategoryGap={0}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#333"
                      opacity={0.5}
                    />
                    <XAxis
                      type="number"
                      domain={[10, 40]}
                      tick={{ fill: "#9ca3af" }}
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tick={{ fill: "#9ca3af" }}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#18181b",
                        borderColor: "#27272a",
                        color: "#fff",
                        borderRadius: "8px",
                        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)",
                      }}
                      formatter={(value, name, props) => [
                        `BMI: ${props.payload.bmiStart} - ${props.payload.bmiEnd}`,
                        props.payload.name,
                      ]}
                    />
                    <Bar
                      dataKey="bmiEnd"
                      stackId="a"
                      fill="#transparent"
                      minPointSize={3}
                    >
                      {bmiRangeData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                      <LabelList
                        dataKey="name"
                        position="center"
                        fill="#fff"
                        style={{
                          fontWeight: "bold",
                          textShadow: "0 0 3px rgba(0,0,0,0.7)",
                        }}
                      />
                    </Bar>
                    {bmi && (
                      <ReferenceLine
                        x={parseFloat(bmi)}
                        stroke="#0ea5e9"
                        strokeWidth={3}
                        label={{
                          value: `Your BMI: ${bmi}`,
                          position: "top",
                          fill: "#38bdf8",
                          fontWeight: "bold",
                        }}
                      />
                    )}
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {bmiHistory.length > 0 && (
              <div className="bg-zinc-900/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-zinc-800">
                <h3 className="text-xl font-semibold text-white mb-5 flex items-center">
                  <span className="inline-block mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-sky-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                      />
                    </svg>
                  </span>
                  Your BMI History
                </h3>
                <div className="h-64 md:h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={bmiHistory.map((entry, index) => ({
                        date: entry.date,
                        bmi: parseFloat(entry.bmi),
                        id: index,
                      }))}
                      margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#333"
                        opacity={0.5}
                      />
                      <XAxis
                        dataKey="date"
                        tick={{ fill: "#9ca3af", fontSize: 10 }}
                        angle={-45}
                        textAnchor="end"
                        height={60}
                      />
                      <YAxis domain={[15, 40]} tick={{ fill: "#9ca3af" }} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#18181b",
                          borderColor: "#27272a",
                          color: "#fff",
                          borderRadius: "8px",
                          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.3)",
                        }}
                        formatter={(value) => [`${value}`, "BMI"]}
                        labelFormatter={(label) => `Date: ${label}`}
                      />
                      <Legend />
                      <ReferenceLine
                        y={18.5}
                        stroke="#38bdf8"
                        strokeDasharray="3 3"
                        label={{
                          value: "Underweight",
                          position: "left",
                          fill: "#38bdf8",
                          fontSize: 10,
                        }}
                      />
                      <ReferenceLine
                        y={24.9}
                        stroke="#22c55e"
                        strokeDasharray="3 3"
                        label={{
                          value: "Normal",
                          position: "left",
                          fill: "#22c55e",
                          fontSize: 10,
                        }}
                      />
                      <ReferenceLine
                        y={29.9}
                        stroke="#facc15"
                        strokeDasharray="3 3"
                        label={{
                          value: "Overweight",
                          position: "left",
                          fill: "#facc15",
                          fontSize: 10,
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="bmi"
                        stroke="#38bdf8"
                        strokeWidth={3}
                        dot={{
                          r: 6,
                          fill: "#0ea5e9",
                          strokeWidth: 2,
                          stroke: "#fff",
                        }}
                        activeDot={{
                          r: 8,
                          fill: "#0ea5e9",
                          strokeWidth: 2,
                          stroke: "#fff",
                        }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 bg-zinc-900/80 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-zinc-800">
          <h3 className="text-xl font-semibold text-white mb-6 flex items-center">
            <span className="inline-block mr-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 text-sky-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </span>
            Understanding BMI Categories
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                category: "Underweight",
                range: "<18.5",
                color: "#38bdf8",
                description:
                  "May indicate nutritional deficiency or other health issues.",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                    />
                  </svg>
                ),
              },
              {
                category: "Normal Weight",
                range: "18.5-24.9",
                color: "#22c55e",
                description:
                  "Associated with the lowest health risks for most people.",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ),
              },
              {
                category: "Overweight",
                range: "25-29.9",
                color: "#facc15",
                description:
                  "May increase risk of health conditions like heart disease.",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                    />
                  </svg>
                ),
              },
              {
                category: "Obesity",
                range: "≥30",
                color: "#ef4444",
                description:
                  "Associated with higher risks of several serious health conditions.",
                icon: (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                ),
              },
            ].map((item, index) => (
              <div
                key={index}
                className="p-5 rounded-xl transition-all duration-300 hover:shadow-lg hover:shadow-sky-900/10 transform hover:-translate-y-1"
                style={{
                  backgroundColor: `${item.color}10`,
                  borderLeft: `4px solid ${item.color}`,
                }}
              >
                <div className="flex items-center mb-3">
                  <div
                    className="p-2 rounded-full mr-3"
                    style={{ backgroundColor: `${item.color}20` }}
                  >
                    <div style={{ color: item.color }}>{item.icon}</div>
                  </div>
                  <h4
                    className="font-bold text-lg"
                    style={{ color: item.color }}
                  >
                    {item.category}
                  </h4>
                </div>
                <div className="text-sm opacity-75 mb-2 font-mono">
                  BMI: {item.range}
                </div>
                <p className="text-sm text-gray-300">{item.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 text-sm text-gray-400 p-4 bg-zinc-800/30 rounded-lg border-l-4 border-sky-900">
            <p className="flex items-start">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-2 flex-shrink-0 text-sky-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <span>
                BMI is a screening tool and does not diagnose body fatness or
                health. Consult with healthcare providers for personalized
                advice.
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BMICalculator;
