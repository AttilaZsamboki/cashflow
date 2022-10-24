import React from "react";
import Navbar from "../components/Navbar";
import SideBar from "../components/SideBar";

export default function Transactions() {
  return (
    <div>
      <Navbar currentPage="Tranzakciók" />
      <SideBar
        current={"Költségek"}
        elements={[
          { text: "Bevételek", link: "income" },
          { text: "Költségek", link: "expenses" },
          { text: "Átvezetések", link: "transfers" },
        ]}
      />
    </div>
  );
}
