import React from "react";
import Link from "next/link";

function Cards({ href, text }: { href: string; text: string }) {
  return (
    <div className="align-center text-md m-2 mr-10 flex flex-col justify-center rounded-lg bg-white text-center font-semibold text-gray-600 opacity-90 shadow-lg shadow-gray-600">
      <Link href={href}>
        <a>{text}</a>
      </Link>
    </div>
  );
}

export default function LinkCards({
  elements,
}: {
  elements: Array<{ href: string; text: string }>;
}) {
  return (
    <div
      className="grid-col-1 grid grid-flow-row-dense"
      style={{ marginTop: -170, height: 390 }}
    >
      {elements.map((element) => (
        <Cards href={element.href} key={element.text} text={element.text} />
      ))}
    </div>
  );
}
