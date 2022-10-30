import React from "react";
import { RangeCalendar, DateRangePickerValue } from "@mantine/dates";
import "dayjs/locale/hu";

export default function DatePicker({
  setStartingDate,
  setClosingDate,
  className,
}: {
  setStartingDate: React.Dispatch<Date>;
  setClosingDate: React.Dispatch<Date>;
  className?: string;
}) {
  const currentDate = new Date();
  const [value, setValue] = React.useState<DateRangePickerValue>([
    new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 28),
    currentDate,
  ]);
  return (
    <RangeCalendar
      className={className}
      value={value}
      onChange={(e) => {
        setStartingDate(e[0]);
        setClosingDate(e[1]);
        setValue(e);
      }}
      locale="hu"
    />
  );
}
