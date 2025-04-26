"use client";

import { compactFormat } from "@/lib/format-number";
import type { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";

type PropsType = {
  data: { name: string; amount: number }[];
};

const Chart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const EMOTION_COLORS: Record<string, string> = {
  Happiness: "#FFEB3B",
  Sadness: "#81D4FA",
  Anger: "#FF8A80",
  Surprise: "#FFB74D",
  Fear: "#9E9E9E",
  Disgust: "#BCAAA4",
  Neutral: "#E0E0E0",
};

export function DonutChart({ data }: PropsType) {
  const colors = data.map(item => EMOTION_COLORS[item.name] || "#B39DDB");

  const chartOptions: ApexOptions = {
    chart: {
      type: "donut",
      fontFamily: "inherit",
      foreColor: "#616161",
    },
    colors: colors,
    labels: data.map((item) => item.name),
    legend: {
      show: true,
      position: "bottom",
      labels: {
        colors: '#616161',
      },
      itemMargin: {
        horizontal: 10,
        vertical: 5,
      },
      formatter: (legendName, opts) => {
        const { seriesPercent } = opts.w.globals;
        return `${legendName}: ${seriesPercent[opts.seriesIndex]}%`;
      },
    },
    plotOptions: {
      pie: {
        donut: {
          size: "80%",
          background: "transparent",
          labels: {
            show: true,
            total: {
              show: true,
              showAlways: true,
              label: "Emotion Score", // Changed from "Emotions" to "Emotion Score"
              fontSize: "20px",
              fontWeight: "600",
              color: '#616161',
              formatter: () => "Emotion Score" // This ensures only text appears
            },
            value: {
              show: false // Hides the numeric value
            }
          },
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      width: 0,
    },
    responsive: [
      {
        breakpoint: 2600,
        options: {
          chart: {
            width: 415,
          },
        },
      },
      {
        breakpoint: 640,
        options: {
          chart: {
            width: "100%",
          },
        },
      },
      {
        breakpoint: 370,
        options: {
          chart: {
            width: 260,
          },
        },
      },
    ],
  };

  return (
    <Chart
      options={chartOptions}
      series={data.map((item) => item.amount)}
      type="donut"
    />
  );
}
