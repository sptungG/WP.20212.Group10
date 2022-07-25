import React from "react";
import { DatePicker } from "antd";
import moment from "moment";

export const dateFormat = "DD-MM-YYYY";
const defaultValue = [moment().startOf("week"), moment().endOf("week")];

const RangePicker = ({ value = defaultValue, bordered = false, size = "large", onChange }) => {
  return (
    <DatePicker.RangePicker
      size={size}
      format={dateFormat}
      allowClear={false}
      bordered={bordered}
      disabledDate={(current) => current && current < moment().startOf("year")}
      style={{ backgroundColor: "#fff !important" }}
      ranges={{
        "Hôm nay": [moment(), moment()],
        "Tuần này": [moment().startOf("week"), moment().endOf("week")],
        "Tháng này": [moment().startOf("month"), moment().endOf("month")],
      }}
      value={[moment(value[0], dateFormat), moment(value[1], dateFormat)]}
      defaultValue={defaultValue}
      onChange={onChange}
    />
  );
};

export default RangePicker;
