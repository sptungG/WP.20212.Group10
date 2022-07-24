import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Loader from "./Loader";

function LoadingToRedirect() {
  const [count, setCount] = useState(5);
  let navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCount((currentCount) => --currentCount);
    }, 1000);
    // redirect once count is equal to 0
    count === 0 && navigate("/");
    // cleanup
    return () => clearInterval(interval);
  }, [count, navigate]);

  return (
    <div className="modal">
      <div className="modal-container">
        <Loader>
          <h1 className="text-redirect">
            Loading... <b className="text-counter">{count}</b>s
          </h1>
        </Loader>
      </div>
    </div>
  );
}

export default LoadingToRedirect;
