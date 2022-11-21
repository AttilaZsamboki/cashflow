import Link from "next/link";
import React from "react";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

function SideBar({
  elements,
  current,
}: {
  elements: Array<{ text: string; link: string }>;
  current: string;
}) {
  const [isOpen, setIsOpen] = React.useState(false);
  React.useEffect(() => {
    setIsOpen(window.sessionStorage.getItem("isOpen") === "true");
  }, []);
  if (isOpen) {
    return (
      <div
        style={{
          height: "100%",
          borderTopRightRadius: 0,
          borderTopLeftRadius: 0,
          paddingTop: 111,
        }}
        className="absolute right-0 bottom-0 z-20 mt-4 mr-6 bg-black text-center font-semibold text-white opacity-80 shadow-2xl shadow-black"
      >
        <div className="grid grid-cols-1 place-items-center">
          <div
            style={{ top: 20, marginTop: 0 }}
            className="absolute rounded-3xl bg-sky-900 p-2 opacity-100"
          >
            <ExpandMoreIcon
              className="cursor-pointer"
              onClick={() => {
                setIsOpen(false);
                window.sessionStorage.setItem("isOpen", "false");
              }}
            />
          </div>
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
  return (
    <div
      style={{
        height: "0%",
        borderTopRightRadius: "0.75rem",
        borderTopLeftRadius: "0.75rem",
        paddingTop: 20,
      }}
      className="absolute right-0 bottom-0 z-20 mt-4 mr-6 bg-black text-center font-semibold text-white opacity-80 shadow-2xl shadow-black"
    >
      <div className="grid grid-cols-1 place-items-center">
        <div
          style={{ top: 0, marginTop: -16 }}
          className="absolute rounded-3xl bg-sky-900 p-2 opacity-100"
        >
          <ExpandLessIcon
            className="cursor-pointer"
            onClick={() => {
              setIsOpen(true);
              window.sessionStorage.setItem("isOpen", "true");
            }}
          />
        </div>
        <div className="w-28"></div>
      </div>
    </div>
  );
}

export default SideBar;
