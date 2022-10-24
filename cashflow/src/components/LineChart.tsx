import React from "react";
import { Line } from "react-chartjs-2";

const getDaysArray = function (start: Date, end: Date) {
  for (
    let arr = [], dt = new Date(start);
    dt <= new Date(end);
    dt.setDate(dt.getDate() + 1)
  ) {
    arr.push(
      new Date(dt).getFullYear() +
        "-" +
        new Date(dt).getMonth() +
        "-" +
        new Date(dt).getDate()
    );
    return arr;
  }
};

export default function LineChart({
  options,
  type,
  datas,
  startDate,
  endDate,
}: {
  options: any;
  type: string;
  datas: number[];
  startDate: Date;
  endDate: Date;
}) {
  const labels = getDaysArray(startDate, endDate);
  // console.log(datas);
  const data = {
    labels,
    datasets: [
      {
        label: "Tény",
        data: datas,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Terv",
        data: datas,
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };
  const colors = new Map([
    ["Bevételek", "#16a34a"],
    ["Cashflow", "#ca8a04"],
    ["Költségek", "#dc2626"],
  ]);
  return (
    <div className="inline-block">
      <div
        className="relative z-10 ml-5 w-32 rounded-md py-3 px-5 text-center font-semibold text-white"
        style={{
          marginBottom: -20,
          backgroundColor: colors.get(type),
        }}
      >
        {type}
      </div>
      <div
        className="z-0 grid-flow-row-dense rounded-lg bg-white p-3 opacity-90 shadow-lg shadow-gray-700"
        style={{ width: "92%" }}
      >
        <Line options={options} data={data} />
      </div>
    </div>
  );
}
