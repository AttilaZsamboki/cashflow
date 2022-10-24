import React from "react";
import Navbar from "../components/Navbar";
import SideBar from "../components/SideBar";

export default function Datas() {
  return (
    <div>
      <Navbar currentPage="Adatok" />
      <SideBar
        current={"Költségtételek"}
        elements={[
          { text: "Pénztárcák", link: "vallets" },
          { text: "Kategóriák", link: "categories" },
          { text: "Költségtételek", link: "cost-items" },
        ]}
      />
    </div>
  );
}
