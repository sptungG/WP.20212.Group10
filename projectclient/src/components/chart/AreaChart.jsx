import React from "react";
import { Area } from "@ant-design/plots";

const AreaChart = ({ data, xField = "_id", yField = "total" }) => {
  const config = {
    data,
    xField,
    yField,
    xAxis: {
      range: [0, 1],
      tickCount: 5,
    },
    areaStyle: () => {
      return {
        fill: "l(270) 0:#ffffff 0.5:#7ec2f3 1:#1890ff",
      };
    },
  };

  return <Area {...config} />;
};

export default AreaChart;
