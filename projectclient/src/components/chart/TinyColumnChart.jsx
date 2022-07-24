import React from "react";
import { TinyColumn } from "@ant-design/plots";

const TinyColumnChart = ({ data, autoFit = false  }) => {
  const config = {
    height: 64,
    autoFit,
    data,
    tooltip: {
      customContent: function (x, data) {
        return `${data[0]?.data?.y}`;
      },
    },
  };
  return <TinyColumn {...config} />;
};

export default TinyColumnChart;
