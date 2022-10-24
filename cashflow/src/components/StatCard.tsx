import React from "react";

function Card({ data, text }: { data: number | string; text: string }) {
  return (
    <div className="inline-block w-full transform overflow-hidden rounded-lg bg-white text-left align-bottom opacity-90 shadow-md shadow-gray-700 transition-all sm:my-8 sm:w-1/3">
      <div className="bg-white p-5">
        <div className="sm:flex sm:items-start">
          <div className="text-center sm:mt-0 sm:ml-2 sm:text-left">
            <h3 className="text-sm font-medium leading-6 text-gray-400">
              {text}
            </h3>
            <p className="text-3xl font-semibold text-gray-700">{data}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function StatCard({
  data,
}: {
  data: { ammount: number | null | string; text: string }[];
}) {
  return (
    <div
      className="mx-4 max-w-full py-3 sm:mx-auto sm:px-6 lg:px-8"
      style={{ marginBottom: -10 }}
    >
      <div className="-mb-2 sm:flex sm:space-x-4">
        {data.map((stat) => (
          <Card
            data={stat.ammount ? stat.ammount : 0}
            key={stat.text}
            text={stat.text}
          />
        ))}
      </div>
    </div>
  );
}
