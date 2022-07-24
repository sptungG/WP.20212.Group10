import React from "react";
import { TinyArea } from "@ant-design/plots";

const TinyAreaChart = ({ data, fill = "#d6e3fd", autoFit = false }) => {
  const config = {
    height: 60,
    autoFit,
    data,
    smooth: true,
    areaStyle: {
      fill,
    },
  };
  return <TinyArea {...config} />;
};

export default TinyAreaChart;