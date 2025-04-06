
export function generateFakeMetrics() {
    return {
      heartRate: Math.floor(Math.random() * (100 - 60 + 1)) + 60, // 60–100 bpm
      spo2: Math.floor(Math.random() * (100 - 95 + 1)) + 95, // 95–100%
      bodyTemp: (Math.random() * (37.5 - 36.5) + 36.5).toFixed(1), // 36.5–37.5 °C
      weight: 70 + Math.floor(Math.random() * 10),
      height: 170 + Math.floor(Math.random() * 10),
      timestamp: new Date()
    };
  }
  