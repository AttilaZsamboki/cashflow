import React from "react";

const formatter = new Intl.NumberFormat("hu", {
  style: "currency",
  currency: "HUF",
});

const RadioButton: React.FC<{
  text: string;
  value: number;
  setTotalBalance: React.Dispatch<number>;
  totalBalance: number;
  setSelectedVallets: React.Dispatch<string[]>;
  selectedVallets: string[];
}> = ({
  text,
  value,
  setTotalBalance,
  totalBalance,
  selectedVallets,
  setSelectedVallets,
}) => {
  const [isChecked, setIsChecked] = React.useState(true);
  return (
    <li className="w-full rounded-t-lg border-b border-gray-200 dark:border-gray-400">
      <div className="float-right mr-2 mt-3">{formatter.format(value)}</div>
      <div className="flex items-center pl-3">
        <input
          id="checkbox"
          type="checkbox"
          value=""
          className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-blue-600 focus:ring-2 focus:ring-blue-500 dark:border-gray-500 dark:bg-gray-600 dark:ring-offset-gray-700 dark:focus:ring-blue-600"
          checked={isChecked}
          onClick={() => {
            if (isChecked) {
              setIsChecked(false);
              setTotalBalance(totalBalance - value);
              setSelectedVallets([
                ...selectedVallets.filter((val) => val !== text),
              ]);
            } else {
              setIsChecked(true);
              setTotalBalance(totalBalance + value);

              setSelectedVallets([...selectedVallets, text]);
            }
          }}
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
};

export default function RadioListButton({
  elements,
  selectedVallets,
  setSelectedVallets,
}: {
  elements: { valletName: string; balance: number }[] | "Loading...";
  selectedVallets: string[];
  setSelectedVallets: React.Dispatch<string[]>;
}) {
  const [totalBalance, setTotalBalance] = React.useState<number>();
  if (elements === "Loading...") {
    return (
      <div className="m-4 -mt-40 -ml-40 mr-8 h-96 w-80 rounded-lg border-2 border-gray-200 bg-white text-center text-sm font-medium text-gray-900 opacity-95 shadow-lg shadow-gray-700">
        Loading...
      </div>
    );
  }
  React.useEffect(() => {
    setTotalBalance(
      elements.map((element) => element.balance).reduce((a, b) => a + b, 0)
    );
  }, [elements]);
  return (
    <div className="m-4 -mt-40 -ml-40 mr-8 h-96 w-80 rounded-lg border-2 border-gray-200 bg-white text-sm font-medium text-gray-900 opacity-95 shadow-lg shadow-gray-700">
      <h3 className="m-3 font-bold text-gray-700">Pénztárcák</h3>
      <div className="float-right -mt-8 mr-2 border-b-2 border-gray-800 pb-1 font-bold">
        {formatter.format(totalBalance)}
      </div>
      <ul>
        {elements.map((element) => (
          <RadioButton
            key={element.valletName}
            text={element.valletName}
            value={element.balance}
            setTotalBalance={setTotalBalance}
            totalBalance={totalBalance}
            selectedVallets={selectedVallets}
            setSelectedVallets={setSelectedVallets}
          />
        ))}
      </ul>
    </div>
  );
}
