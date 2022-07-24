import { AutoComplete } from "antd";
import React, { useState } from "react";

const AutoCompleteInput = ({ children }) => {
  const [result, setResult] = useState([]);
  const handleSearch = (value) => {
  console.log("handleSearch ~ value", value);
    let res = [];

    if (!value || value.indexOf("@") >= 0) {
      res = [];
    } else {
      res = ["gmail.com", "163.com", "qq.com"].map((domain) => `${value}@${domain}`);
    }

    setResult(res);
  };

  return (
    <AutoComplete onSearch={handleSearch} options={result}>
      {children}
    </AutoComplete>
  );
};

export default AutoCompleteInput;
