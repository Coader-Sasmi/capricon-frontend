"use client";
import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
const ApexCharts = dynamic(() => import("react-apexcharts"), { ssr: false });

type Props = {
  type: "line" | "bar" | "area";
  text?: string;
  totals?: number[];
  categories?: string[];
};

export default function LineGraph({}: Props) {
  const [value, setValue] = useState<FuelType[]>();

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(
          `https://capricon-backend.onrender.com/get-json/1727359804374-response.json`
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const json = await response.json();
        setValue(json);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    })();
  }, []);

  const options = {
    series: [
      {
        name: "Fuel Level",
        data: value?.map((item) => +item.fuel_level || 0) || [],
      },
      {
        name: "Speed",
        data: value?.map((item) => +item.speed || 0) || [],
      },
    ],
  };

  return (
    <div className=" bg-white p-6 ">
      <ApexCharts
        height={"650"}
        options={{
          title: {
            text: "Fuel Consumption",
            style: {
              fontWeight: "700",
              fontSize: "16px",
              color: "black",
            },
          },
          chart: {
            height: 350,
            type: "line",
            zoom: {
              enabled: false,
            },
          },
          responsive: [
            {
              breakpoint: 480,
              options: {
                legend: {
                  position: "bottom",
                  offsetX: -10,
                  offsetY: 0,
                },
              },
            },
          ],
          dataLabels: {
            enabled: false,
          },
          stroke: {
            curve: "smooth",
          },

          fill: {
            opacity: 1,
          },
          legend: {
            position: "bottom",
          },
          xaxis: {
            categories: value?.map((item) => item.timestamp || 0),
            title: {
              text: "Time Stamp",
            },
          },
          yaxis: {
            title: {
              text: "Fuel Level",
            },
          },

          colors: ["#ff4560", "#16a34a"],
        }}
        series={options.series}
        type={"line"}
      />
    </div>
  );
}
