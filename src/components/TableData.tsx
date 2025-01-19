import "@mantine/core/styles.css";
import React from "react";

import { Table } from "@mantine/core";
import { data } from "../assets/dataset.ts";
import styles from "./styles/tabledata.module.css";

interface CropData {
  Country: string;
  Year: string;
  "Crop Name": string;
  "Crop Production (UOM:t(Tonnes))": number | string;
  "Yield Of Crops (UOM:Kg/Ha(KilogramperHectare))": number | string;
  "Area Under Cultivation (UOM:Ha(Hectares))": number | string;
}

interface AggregatedData {
  Year: string;
  MaxCrop: string;
  MinCrop: string;
}

// getting data from assetts/dataset
const cropData: CropData[] = data;

// Function to handle missing values and aggregate data by year
const aggregateCropsData = (data: CropData[]): AggregatedData[] => {
  const yearDataMap: { [key: string]: CropData[] } = {};

  // Process each crop data, replace missing values with 0
  data.forEach((entry) => {
    const production =
      entry["Crop Production (UOM:t(Tonnes))"] === ""
        ? 0
        : Number(entry["Crop Production (UOM:t(Tonnes))"]);
    const yieldCrop =
      entry["Yield Of Crops (UOM:Kg/Ha(KilogramperHectare))"] === ""
        ? 0
        : Number(entry["Yield Of Crops (UOM:Kg/Ha(KilogramperHectare))"]);

    if (!yearDataMap[entry.Year]) {
      yearDataMap[entry.Year] = [];
    }

    yearDataMap[entry.Year].push({
      ...entry,
      "Crop Production (UOM:t(Tonnes))": production,
      "Yield Of Crops (UOM:Kg/Ha(KilogramperHectare))": yieldCrop,
    });
  });

  // Aggregate by year to find the crop with max and min production
  return Object.keys(yearDataMap).map((year) => {
    const crops = yearDataMap[year];

    const maxCrop = crops.reduce(
      (max, crop) =>
        crop["Crop Production (UOM:t(Tonnes))"] >
        max["Crop Production (UOM:t(Tonnes))"]
          ? crop
          : max,
      crops[0]
    );
    const minCrop = crops.reduce(
      (min, crop) =>
        crop["Crop Production (UOM:t(Tonnes))"] <
        min["Crop Production (UOM:t(Tonnes))"]
          ? crop
          : min,
      crops[0]
    );

    return {
      Year: year,
      MaxCrop: maxCrop["Crop Name"],
      MinCrop: minCrop["Crop Name"],
    };
  });
};

const CropTable = () => {
  const aggregatedData = aggregateCropsData(cropData);

  return (
    <div className={styles.main}>
      <Table>
        <thead>
          <tr>
            <th className={styles.thread}>Year</th>
            <th className={styles.thread}>Crop with Maximum Production</th>
            <th className={styles.thread}>Crop with Minimum Production</th>
          </tr>
        </thead>
        <tbody>
          {aggregatedData.map((data, index) => (
            <tr
              key={index}
              className={index % 2 === 0 ? styles.tr1 : styles.tr2}
            >
              <td className={styles.td1}>{data.Year}</td>
              <td className={styles.td1}>{data.MaxCrop}</td>
              <td className={styles.td1}>{data.MinCrop}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default CropTable;
