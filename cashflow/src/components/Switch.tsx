import { useState } from "react";
import { Switch } from "@headlessui/react";
import React from "react";

export default function SwitchButton({
  enabled,
  setEnabled,
  activeSign = true,
}: {
  enabled: boolean;
  setEnabled: React.Dispatch<boolean>;
  activeSign?: boolean;
}) {
  return (
    <div className="-mb-2">
      <Switch
        checked={enabled}
        onChange={setEnabled}
        className={`${enabled ? "bg-sky-900" : "bg-gray-700"}
          relative inline-flex h-[34px] w-[74px] shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
      >
        <span className="sr-only">Use setting</span>
        <span
          aria-hidden="true"
          className={`${enabled ? "translate-x-9" : "translate-x-0"}
            pointer-events-none inline-block h-[30px] w-[34px] transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out`}
        />
        {activeSign && (
          <div
            className={`${
              enabled ? "text-sky-900" : "text-gray-700"
            } relative top-10 right-3 text-sm opacity-60`}
          >
            {enabled ? "aktív" : "inaktív"}
          </div>
        )}
      </Switch>
    </div>
  );
}
