import { Countdown } from "@/components/countdown";

export default function CountdownHome() {
  // get tomorrows midnight
  const tomorrow = new Date(new Date().toUTCString());
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
  tomorrow.setUTCHours(0, 0, 0, 0);

  return <Countdown expiryTimestamp={tomorrow} />;
}
