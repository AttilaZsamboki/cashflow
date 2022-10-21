import React from "react";
import { Pie } from "react-chartjs-2";
import { faker } from "@faker-js/faker";

const labels = ["January", "February", "March", "April", "May", "June", "July"];

export default function PieChart({
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
          if (type === "Költség Kategóriák") {
            return faker.datatype.number({ min: -100, max: 100 });
          }
        }),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: "Dataset 2",
        data: labels.map(() => {
          if (type === "Költség Kategóriák") {
            return faker.datatype.number({ min: -100, max: 100 });
          }
        }),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };
  const colors = new Map([["Költség Kategóriák", "#2563eb"]]);
  return (
    <div className="inline-block">
      <div
        className="relative z-10 ml-5 w-32 rounded-md py-3 px-5 text-center font-semibold text-white"
        style={{
          marginBottom: -40,
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
