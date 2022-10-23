import React from "react";
import { RangeCalendar, DateRangePickerValue } from "@mantine/dates";
import "dayjs/locale/hu";

export default function DatePicker({
  setStartingDate,
  setClosingDate,
}: {
  setStartingDate: React.Dispatch<Date>;
  setClosingDate: React.Dispatch<Date>;
}) {
  const currentDate = new Date();
  const [value, setValue] = React.useState<DateRangePickerValue>([
    new Date(currentDate.getFullYear(), 0, 1),
    currentDate,
  ]);
  return (
    <RangeCalendar
      value={value}
      onChange={(e) => {
        setStartingDate(e[0]);
        setClosingDate(e[1]);
        setValue(e);
      }}
      className="h-96 rounded-lg bg-white opacity-90 shadow-lg shadow-gray-700"
      style={{ marginTop: -160 }}
      locale="hu"
    />
  );
}
