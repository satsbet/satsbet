"use client";
import prettyMilliseconds from "pretty-ms";
import { useTimer } from "react-timer-hook";

export function Countdown({ expiryTimestamp }: { expiryTimestamp: Date }) {
  const { totalSeconds } = useTimer({
    expiryTimestamp,
    onExpire: () => console.warn("onExpire called"),
  });

  return !totalSeconds ? (
    <div className="text-red-600">Expired</div>
  ) : (
    prettyMilliseconds(totalSeconds * 1000, { verbose: true })
  );
}
