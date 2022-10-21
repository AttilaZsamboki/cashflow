import React from "react";
import { Pie } from "react-chartjs-2";

export default function PieChart({
  options,
  data,
  type,
}: {
  options: any;
  data: any;
  type: string;
}) {
  const colors = new Map([["Költség Kategóriák", "#2563eb"]]);
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
        style={{ width: "88%" }}
      >
        <Pie options={options} data={data} />
      </div>
    </div>
  );
}
