import React from "react";
import { Bar } from "@ant-design/plots";

const BarChart = ({ data }) => {
  const config = {
    data,
    xField: "amount",
    yField: "type",
    seriesField: "type",
    xAxis: {
      label: {
        formatter: (value) => `$${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, "."),
      },
    },
    legend: {
      position: "top-left",
    },
  };
  return <Bar {...config} />;
};

export default BarChart;
