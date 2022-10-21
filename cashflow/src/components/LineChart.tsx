import React from "react";
import { Line } from "react-chartjs-2";
import { faker } from "@faker-js/faker";

const labels = ["January", "February", "March", "April", "May", "June", "July"];

export default function LineChart({
  options,
  type,
}: {
  options: any;
  type: string;
}) {
  const data = {
    labels,
    datasets: [
      {
        label: "Dataset 1",
        data: labels.map(() => {
          if (type === "Bevételek") {
            return faker.datatype.number({ min: -1000, max: 1000 });
          } else if (type === "Költségek") {
            return faker.datatype.number({ min: -10000, max: 10000 });
          } else if (type === "Cashflow") {
            return faker.datatype.number({ min: -100, max: 100 });
          }
        }),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Dataset 2",
        data: labels.map(() => {
          if (type === "Bevételek") {
            return faker.datatype.number({ min: -1000, max: 1000 });
          } else if (type === "Költségek") {
            return faker.datatype.number({ min: -10000, max: 10000 });
          } else if (type === "Cashflow") {
            return faker.datatype.number({ min: -100, max: 100 });
          }
        }),
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
        style={{ width: "88%" }}
      >
        <Line options={options} data={data} />
      </div>
    </div>
  );
}
