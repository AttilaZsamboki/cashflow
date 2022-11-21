import React from "react";

const FormField = ({
  selected,
  setSelected,
  label,
}: {
  selected: string;
  setSelected: React.Dispatch<string>;
  label: string;
}) => {
  return (
    <div className="-mx-3 flex flex-row flex-wrap pr-1">
      <div className="mb-6 px-3 md:mb-0 md:w-1/2">
        <div className="md:w-1/2">
          <label
            className="block pb-2 text-xs font-bold uppercase tracking-wide text-gray-700"
            htmlFor="grid-last-name"
          >
            {label}
          </label>
          <input
            value={selected}
            className="appearance-none rounded border border-gray-200 bg-gray-200 py-3 px-4 leading-tight text-gray-700 focus:border-gray-500 focus:bg-white focus:outline-none"
            style={{
              width: 400,
            }}
            id="grid-last-name"
            type="text"
            onChange={(e) => setSelected(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};

export default FormField;
