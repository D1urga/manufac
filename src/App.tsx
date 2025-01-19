import "@mantine/core/styles.css";
import React from "react";
import styles from "./App.module.css";
import CropTable from "./components/TableData.tsx";
import BarChart from "./components/BarChart.tsx";

const App: React.FC = () => {
  return (
    <div className={styles.main}>
      <h1 className={styles.heading}>Indian Agriculture Data Analysis</h1>
      <h2 className={styles.heading1}>Crop Yield Bar Chart</h2>
      <BarChart />
      <h2 className={styles.heading1}>Production Table</h2>
      <CropTable />
    </div>
  );
};

export default App;
