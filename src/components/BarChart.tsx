import React, { useEffect } from "react";
import * as echarts from "echarts";
import { data } from "../assets/dataset";
import styles from "./styles/barchart.module.css";

interface CropData {
  Country: string;
  Year: string;
  "Crop Name": string;
  "Crop Production (UOM:t(Tonnes))": string | number;
  "Yield Of Crops (UOM:Kg/Ha(KilogramperHectare))": string | number;
  "Area Under Cultivation (UOM:Ha(Hectares))": string | number;
}

// getting data from assetts/dataset
const cropData: CropData[] = data;

// function for calculating average or missing values
const calculateAverageYield = (data: CropData[]) => {
  const cropYieldMap: { [key: string]: { totalYield: number; count: number } } =
    {};

  data.forEach((entry) => {
    const cropName = entry["Crop Name"];
    const yieldValue =
      parseFloat(
        entry["Yield Of Crops (UOM:Kg/Ha(KilogramperHectare))"] as string
      ) || 0;

    if (!cropYieldMap[cropName]) {
      cropYieldMap[cropName] = { totalYield: 0, count: 0 };
    }

    cropYieldMap[cropName].totalYield += yieldValue;
    cropYieldMap[cropName].count += 1;
  });

  return Object.keys(cropYieldMap).map((cropName) => ({
    crop: cropName,
    averageYield:
      cropYieldMap[cropName].totalYield / cropYieldMap[cropName].count,
  }));
};

const BarChart = () => {
  useEffect(() => {
    const chart = echarts.init(
      document.getElementById("barChart") as HTMLElement
    );

    const aggregatedData = calculateAverageYield(cropData);

    const option = {
      title: {
        text: "Average Yield of Crops (1950-2020)",
        left: "center",
      },
      tooltip: {
        trigger: "axis",
      },
      xAxis: {
        type: "category",
        data: aggregatedData.map((data) => data.crop),
        name: "Crop Name",
        axisLabel: { rotate: 45, interval: 0 },
      },
      yAxis: {
        type: "value",
        name: "Average Yield (Kg/Ha)",
      },
      series: [
        {
          data: aggregatedData.map((data) => data.averageYield),
          type: "bar",
          color: "#5470c6",
        },
      ],
    };

    chart.setOption(option);

    return () => {
      chart.dispose();
    };
  }, []);

  return <div id="barChart" className={styles.main} />;
};

export default BarChart;
