import React from "react";

function RadioButton({ text, value }: { text: string; value: number }) {
  const [isChecked, setIsChecked] = React.useState(true);
  return (
    <li className="w-full rounded-t-lg border-b border-gray-200 dark:border-gray-400">
      <div className="float-right mt-3 mr-2">{value} Ft</div>
      <div className="flex items-center pl-3">
        <input
          id="checkbox"
          type="checkbox"
          value=""
          className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-blue-600"
          checked={isChecked}
          onClick={() => (isChecked ? setIsChecked(false) : setIsChecked(true))}
        />
        <label
          htmlFor="checkbox"
          className="ml-2 w-full py-3 text-sm font-medium text-gray-600"
        >
          {text}
        </label>
      </div>
    </li>
  );
}

export default function RadioListButton({
  elements,
}: {
  elements: { valletName: string; balance: number }[];
}) {
  return (
    <div className="w-100 m-4 -mt-40 -ml-40 mr-8 h-96 rounded-t-lg border-2 border-gray-200 bg-white text-sm font-medium text-gray-900 opacity-95 shadow-lg shadow-gray-700">
      <h3 className="m-3 text-gray-700">Pénztárcák</h3>
      <div className="float-right -mt-8 mr-2 border-b-2 border-gray-800 pb-1">
        {elements.map((element) => element.balance).reduce((a, b) => a + b, 0)}{" "}
        Ft
      </div>
      <ul>
        {elements.map((element) => (
          <RadioButton text={element.valletName} value={element.balance} />
        ))}
      </ul>
    </div>
  );
}
