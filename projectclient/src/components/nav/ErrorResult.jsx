import { Result } from "antd";
import Button from "src/components/button/Button";
import LogoOnlyLayout from "src/layout/LogoOnlyLayout";
import React from "react";
import { Link } from "react-router-dom";

const errorStatus = [
  {
    status: "403",
    title: "403",
    subTitle: "Sorry, you are not authorized to access this page.",
  },
  {
    status: "404",
    title: "404",
    subTitle: "Sorry, the page you visited does not exist.",
  },
  {
    status: "500",
    title: "500",
    subTitle: "Sorry, something went wrong.",
  },
];

const getStatusInfo = (s) => errorStatus.find((es) => es.status === s);

const ErrorResult = ({ status = "500", title, subTitle, extra, children }) => {
  return (
    <LogoOnlyLayout>
      <Result
        status={status}
        title={title || getStatusInfo(status).title}
        subTitle={subTitle || getStatusInfo(status).subTitle}
        extra={
          extra || (
            <Link to="/" style={{ margin: "0 auto", display: "inline-block" }}>
              <Button size="large" type="primary">
                Back Home
              </Button>
            </Link>
          )
        }
      >
        {children}
      </Result>
    </LogoOnlyLayout>
  );
};

export default ErrorResult;
