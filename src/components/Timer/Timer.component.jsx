import React from "react";
import Countdown from "react-countdown";

const Timer = ({ start, end }) => {
  const timerCount = end - Date.now();
  return (
    <>
      {timerCount <= 0 ? (
        "Reached"
      ) : (
        <Countdown date={Date.now() + timerCount} />
      )}
    </>
  );
};

export default Timer;
