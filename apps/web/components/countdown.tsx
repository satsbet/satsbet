"use client";
import prettyMilliseconds from "pretty-ms";
import { useEffect } from "react";
import { useTimer } from "react-timer-hook";

export function Countdown({ expiryTimestamp }: { expiryTimestamp: Date }) {
  const { totalSeconds, start } = useTimer({
    expiryTimestamp,
    autoStart: false,
    onExpire: () => console.warn("onExpire called"),
  });

  useEffect(() => {
    start();
  }, [start]);

  return !totalSeconds ? (
    <div className="text-red-600">Expired</div>
  ) : (
    prettyMilliseconds(totalSeconds * 1000, { verbose: true })
  );
}
