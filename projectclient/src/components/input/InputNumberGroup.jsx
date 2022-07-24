import { Button, InputNumber } from "antd";
import React from "react";
import { BsDashLg, BsPlusLg } from "react-icons/bs";
import styled from "styled-components";

const InputNumberGroup = ({
  handleDecrQuantity = () => console.log(),
  handleIncQuantity = () => console.log(),
  value,
  maxValue,
  onChange = () => console.log(),
  decrDisabled = false,
  incDisabled = false,
  inputDisabled = false,
}) => {
  return (
    <InputWrapper>
      <InputNumber
        addonBefore={
          <Button
            disabled={decrDisabled}
            type="text"
            className="btn-count"
            htmlType="button"
            onClick={handleDecrQuantity}
          >
            <BsDashLg />
          </Button>
        }
        addonAfter={
          <Button
            type="text"
            disabled={incDisabled}
            className="btn-count"
            htmlType="button"
            onClick={handleIncQuantity}
          >
            <BsPlusLg />
          </Button>
        }
        disabled={inputDisabled}
        onFocus={() => console.log()}
        readOnly
        value={value}
        onChange={onChange}
        min={0}
        max={maxValue}
        controls={false}
        step={1}
      />
    </InputWrapper>
  );
};

const InputWrapper = styled.div`
  & .ant-input-number-group-wrapper {
    max-width: 112px;
    height: 32px;
    overflow: hidden;
    background-color: #fff;
    & .ant-input-number-group-addon {
      padding: 0;
      cursor: pointer;
      &:hover {
        color: ${(props) => props.theme.primaryColor};
        background-color: ${(props) => props.theme.generatedColors[0]};
      }
    }
    & .ant-input-number-group-addon button {
      background-color: transparent;
      cursor: pointer;
      border: none;
      outline: none;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 8px 10px;
      height: 100%;
      max-height: 100%;
    }
    & .ant-input-number-input {
      text-align: center;
    }
  }
`;

export default InputNumberGroup;
