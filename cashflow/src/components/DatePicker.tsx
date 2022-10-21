import React from "react";
import { RangeCalendar, DateRangePickerValue } from "@mantine/dates";
import "dayjs/locale/hu";

export default function DatePicker() {
  const currentDate = new Date();
  const [value, setValue] = React.useState<DateRangePickerValue>([
    new Date(currentDate.getFullYear(), 0, 1),
    new Date(),
  ]);
  return (
    <RangeCalendar
      value={value}
      onChange={setValue}
      className="h-80 rounded-lg bg-white opacity-90 shadow-lg shadow-gray-700"
      style={{ marginTop: -160 }}
      locale="hu"
    />
  );
}
