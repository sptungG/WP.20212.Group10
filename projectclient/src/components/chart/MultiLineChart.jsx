import React from "react";
import { Line } from "@ant-design/plots";
import { vietnameseSlug } from "../../common/utils";
const MultiLineChart = ({ data, xField, yField, seriesField }) => {
  const config = {
    data,
    xField,
    yField,
    seriesField,
    yAxis: {
      label: {
        formatter: (value) => `$${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ","),
      },
    },
    legend: {
      position: "top",
    },
    smooth: true,
    animation: {
      appear: {
        animation: "path-in",
        duration: 5000,
      },
    },
  };

  return <Line {...config} />;
};

export default MultiLineChart;
