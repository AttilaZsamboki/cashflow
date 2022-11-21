import React from "react";
import { PlusIcon } from "@heroicons/react/24/outline";

export default function SubmitButton({
  title,
  onClick,
}: {
  title?: string;
  onClick?: any;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded bg-green-700 py-2 px-4 align-middle font-bold text-white hover:bg-green-600"
    >
      <PlusIcon
        width={25}
        height={25}
        className="float-left mr-2 inline-block"
      />
      {title ? title : "Hozzáadás"}
    </button>
  );
}
