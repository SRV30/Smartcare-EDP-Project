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
        try {
          const res = await getBmiData(parsedUser.id);
          const { height, weight } = res.data;
          setHeight(height);
          setWeight(weight);
          calculateBmi(height, weight);
        } catch (error) {
          console.log("No BMI data found yet", error);
        }
      };

      fetchBmi();
    }
  }, [calculateBmi]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) return toast.error("User not found!");

    try {
      await saveOrUpdateBmi({ userId: user.id, height, weight });
      calculateBmi(height, weight);
      toast.success("BMI data saved successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to save BMI data");
    }
  };

  const bmiRangeData = [
    { name: "Underweight", bmiStart: 10, bmiEnd: 18.5, color: "#38bdf8" },
    { name: "Normal", bmiStart: 18.5, bmiEnd: 24.9, color: "#22c55e" },
    { name: "Overweight", bmiStart: 24.9, bmiEnd: 29.9, color: "#facc15" },
    { name: "Obese", bmiStart: 29.9, bmiEnd: 40, color: "#ef4444" },
  ];

  return (
    <div className="min-h-screen flex flex-col items-center bg-black text-sky-400 px-4 py-12">
      <div className="w-full max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-white mb-8">
          <span className="text-sky-400">Smart</span>Care BMI Tracker
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <form
              onSubmit={handleSubmit}
              className="bg-zinc-900 p-8 rounded-2xl shadow-lg border border-zinc-800 hover:border-sky-900 transition-all duration-300"
            >
              <h2 className="text-2xl font-bold text-center text-white mb-6">
                Calculate Your BMI
              </h2>

              <div className="mb-5">
                <label className="block text-sm font-medium mb-2">
                  Height (cm)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={height}
                    onChange={(e) => setHeight(e.target.value)}
                    className="w-full p-3 rounded-lg bg-zinc-800 text-white outline-none border border-zinc-700 focus:border-sky-500 transition-all duration-300"
                    placeholder="Enter height in cm"
                    required
                  />
                  <span className="absolute right-3 top-3 text-zinc-500">
                    cm
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-medium mb-2">
                  Weight (kg)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full p-3 rounded-lg bg-zinc-800 text-white outline-none border border-zinc-700 focus:border-sky-500 transition-all duration-300"
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
                className="w-full py-3 rounded-lg bg-sky-500 hover:bg-sky-600 text-white font-semibold transition-all duration-300 shadow-lg shadow-sky-500/20"
              >
                Calculate & Save BMI
              </button>

              {bmi && (
                <div className="mt-8 p-5 rounded-xl bg-zinc-800/50 text-center">
                  <h3 className="text-white text-lg mb-3">Your Result</h3>
                  <div
                    className="text-4xl font-bold"
                    style={{ color: getCategoryColor(bmi) }}
                  >
                    {bmi}
                  </div>
                  <p
                    className="text-lg font-medium mt-2"
                    style={{ color: getCategoryColor(bmi) }}
                  >
                    {bmiCategory}
                  </p>
                </div>
              )}
            </form>
          </div>

          <div className="lg:col-span-2 space-y-8">
            <div className="bg-zinc-900 p-6 rounded-2xl shadow-lg border border-zinc-800">
              <h3 className="text-xl font-semibold text-white mb-5">
                BMI Categories
              </h3>
              <div className="h-64">
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
              <div className="bg-zinc-900 p-6 rounded-2xl shadow-lg border border-zinc-800">
                <h3 className="text-xl font-semibold text-white mb-5">
                  Your BMI History
                </h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={bmiHistory.map((entry) => ({
                        date: entry.date,
                        bmi: parseFloat(entry.bmi),
                      }))}
                      margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#333" />
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
                        }}
                        formatter={(value) => [`${value}`, "BMI"]}
                      />
                      <Legend />
                      <ReferenceLine
                        y={18.5}
                        stroke="#38bdf8"
                        strokeDasharray="3 3"
                      />
                      <ReferenceLine
                        y={24.9}
                        stroke="#22c55e"
                        strokeDasharray="3 3"
                      />
                      <ReferenceLine
                        y={29.9}
                        stroke="#facc15"
                        strokeDasharray="3 3"
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

        <div className="mt-8 bg-zinc-900 p-6 rounded-2xl shadow-lg border border-zinc-800">
          <h3 className="text-xl font-semibold text-white mb-4">
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
              },
              {
                category: "Normal Weight",
                range: "18.5-24.9",
                color: "#22c55e",
                description:
                  "Associated with the lowest health risks for most people.",
              },
              {
                category: "Overweight",
                range: "25-29.9",
                color: "#facc15",
                description:
                  "May increase risk of health conditions like heart disease.",
              },
              {
                category: "Obesity",
                range: "≥30",
                color: "#ef4444",
                description:
                  "Associated with higher risks of several serious health conditions.",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="p-4 rounded-xl"
                style={{
                  backgroundColor: `${item.color}20`,
                  borderLeft: `4px solid ${item.color}`,
                }}
              >
                <h4 className="font-bold text-lg" style={{ color: item.color }}>
                  {item.category}
                </h4>
                <div className="text-sm opacity-75 mb-2">BMI: {item.range}</div>
                <p className="text-sm text-gray-300">{item.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 text-sm text-gray-400">
            <p>
              Note: BMI is a screening tool and does not diagnose body fatness
              or health. Consult with healthcare providers for personalized
              advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BMICalculator;
