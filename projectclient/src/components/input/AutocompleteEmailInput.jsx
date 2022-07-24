import { AutoComplete, Input } from "antd";
import React, { useState } from "react";
import { HiOutlineMail } from "react-icons/hi";

const AutocompleteEmailInput = ({
  prefix = <HiOutlineMail size={24} />,
  value = "",
  onChange = (v) => console.log(v),
  placeholder = "Email...",
  allowClear = true
}) => {
  const [result, setResult] = useState([]);

  const handleSearch = (initvalue) => {
    let res = [];
    let value = initvalue.trim().replace(/\s/g, "");

    if (!value || value.indexOf("@") >= 0) {
      res = [];
    } else {
      res = ["gmail.com", "hust.edu.vn"].map((domain) => `${value}@${domain}`);
    }

    setResult(res.map((r) => ({ value: r.toLowerCase(), label: r })));
  };
  return (
    <AutoComplete onSearch={handleSearch} onSelect={(value) => onChange(value)} options={result}>
      <Input
        size="large"
        prefix={prefix}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        allowClear={allowClear}
      />
    </AutoComplete>
  );
};

export default AutocompleteEmailInput;
