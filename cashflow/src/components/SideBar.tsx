import Link from "next/link";
import React from "react";

function SideBar({
  elements,
  current,
}: {
  elements: Array<{ text: string; link: string }>;
  current: string;
}) {
  return (
    <div
      style={{ height: "84%" }}
      className="absolute right-0 my-4 mr-6 rounded-xl bg-black pt-7 text-center font-semibold text-white opacity-80 shadow-2xl shadow-black"
    >
      <div className="grid grid-cols-1 place-items-center">
        {elements.map((element) => {
          return (
            <div
              key={element.text}
              className={
                element.text === current
                  ? "m-2 w-full bg-gray-700 p-3 opacity-90"
                  : "m-2 w-full p-3"
              }
            >
              <Link href={element.link}>
                <a>{element.text}</a>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default SideBar;
