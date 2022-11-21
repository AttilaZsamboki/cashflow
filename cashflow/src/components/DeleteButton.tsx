import React from "react";
import { BackspaceIcon } from "@heroicons/react/24/outline";

export default function DeleteButton({
  title,
  onClick,
}: {
  title?: string;
  onClick?: any;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded bg-red-700 py-2 px-4 align-middle font-bold text-white hover:bg-red-600"
    >
      <BackspaceIcon
        width={25}
        height={24}
        className="float-left mr-2 inline-block"
      />
      {title ? title : "Törlés"}
    </button>
  );
}
