import React from "react";
import Navbar from "../components/Navbar";
import SideBar from "../components/SideBar";
import Radio from "../components/Radio";
import { DataGrid, GridValueFormatterParams } from "@mui/x-data-grid";
import { trpc } from "../utils/trpc";
import { GridColDef } from "@mui/x-data-grid";
import Tabs from "../components/Tabs";

const dataGridFormatter = new Intl.NumberFormat("hu", {
  style: "currency",
  currency: "HUF",
  notation: "standard",
  maximumFractionDigits: 2,
});

const valueFormatter = (params: GridValueFormatterParams<number>) => {
  if (params.value === null) {
    return "-";
  }
  return dataGridFormatter.format(params.value);
};

const booleanFormatter = (params: GridValueFormatterParams<boolean>) => {
  if (params.value === null) {
    return "-";
  }
  if (params.value) {
    return "Igen";
  }
  return "Nem";
};

export default function Datas() {
  const [itemType, setItemType] = React.useState<string | null>("");
  const singularItemType = itemType
    ? itemType.substring(0, itemType.length - 2)
    : "";

  const mainColumns: GridColDef[] = [
    {
      field: "Konyveles_datuma",
      headerName: "Dátum",
      width: 150,
    },
    {
      field: "name",
      headerName: "Tétel",
      width: 130,
    },
    {
      field: "type",
      headerName: "Típus",
      width: 130,
    },
    {
      field: "kategory",
      headerName: "Kategória",
      width: 130,
    },
    {
      field: "Osszeg",
      headerName: itemType ? itemType : "Összeg",
      headerClassName: "font-bold",
      valueFormatter: valueFormatter,
    },
    {
      field: "vallet",
      headerName: "Pénztárca",
      headerClassName: "font-bold",
      width: 90,
    },
    {
      field: "Partner_elnevezese",
      headerName: "Partner",
      width: 150,
    },
  ];
  const categoryColumns: GridColDef[] = [
    {
      field: "name",
      headerName: `${singularItemType}-Kategória`,
      width: 150,
    },
    {
      field: "is_main",
      headerName: "Főkategória?",
      width: 150,
      valueFormatter: booleanFormatter,
    },
    {
      field: "parent_name",
      headerName: "Szülő név (ha alkategória)",
      width: 200,
    },
    {
      field: "is_active",
      headerName: "Aktív?",
      width: 150,
      valueFormatter: booleanFormatter,
    },
  ];
  const itemColumns: GridColDef[] = [
    {
      field: "name",
      headerName: `${singularItemType}-tétel`,
      width: 180,
    },
    {
      field: "type",
      headerName: `${singularItemType}-típus`,
      width: 150,
    },
    {
      field: "partnerName",
      headerName: "Partner",
      width: 170,
    },
    {
      field: "kategoriakName",
      headerName: "Kategória",
      width: 190,
    },
  ];
  const connectionColumns = [
    {
      field: "elemekName",
      headerName: "Elem",
      width: 200,
    },
    {
      field: "minta",
      headerName: "Minta",
      width: 150,
    },
    {
      field: "partnerekName",
      headerName: "Partner",
      width: 150,
    },
  ];
  const expenses = trpc.expenses.getAll.useQuery();
  const tabs = ["tétel", "kategória", "kapcsolat"];
  const mainData = expenses.data?.filter((data) => {
    if (itemType === "Bevételek") {
      return data.Osszeg ? data.Osszeg > 0 : false;
    } else if (itemType === "Költségek") {
      return data.Osszeg ? data.Osszeg < 0 : false;
    }
    return false;
  });
  const categories = trpc.expenses.getCategoriesByType.useQuery({
    type: singularItemType.toLowerCase(),
  });
  const items = trpc.expenses.getItemByType.useQuery({
    type: singularItemType.toLowerCase(),
  });
  const connections = trpc.expenses.getConnectionsByType.useQuery({
    type: singularItemType.toLowerCase(),
  });
  React.useEffect(() => {
    setItemType(window.sessionStorage.getItem("itemType"));
  }, []);

  return (
    <div>
      <Navbar currentPage="Adatok" />
      <SideBar
        current={"Tételek"}
        elements={[
          { text: "Pénztárcák", link: "vallets" },
          { text: "Kategóriák", link: "categories" },
          { text: "Tételek", link: "items" },
        ]}
      />
      <Radio
        setItemState={(e) => {
          setItemType(e);
          window.sessionStorage.setItem("itemType", e);
        }}
        plans={["Bevételek", "Költségek"]}
        itemState={itemType ? itemType : ""}
      />
      <div className="absolute top-64 left-4 bottom-4 mx-auto mt-4 w-full max-w-md rounded-md bg-white py-8 px-3">
        <Tabs
          itemType={singularItemType.toLowerCase()}
          tabNames={tabs.map((t) => `${singularItemType}-${t}`)}
        />
      </div>
      <div
        className="absolute bottom-4 left-96 z-10 m-auto ml-24 flex rounded-md bg-white opacity-90"
        style={{ height: 815 / 2, width: "26.5%" }}
      >
        <DataGrid
          columns={connectionColumns}
          rows={connections.data ? connections.data : []}
          sx={{ fontWeight: 400, border: "2px solid #265470" }}
        />
      </div>
      <div
        className="absolute right-4 bottom-4 z-10 m-auto flex rounded-md bg-white opacity-90"
        style={{ height: 815 / 2, width: "47%" }}
      >
        <DataGrid
          columns={mainColumns}
          rows={mainData ? mainData : []}
          sx={{ fontWeight: 400, border: "2px solid #265470" }}
        />
      </div>
      <div
        className="absolute top-32 right-4 z-10 m-auto mb-2 flex rounded-md bg-white opacity-90"
        style={{ height: 815 / 2, width: "36.5%" }}
      >
        <DataGrid
          columns={itemColumns}
          getRowId={(row) => row.name}
          rows={items.data ? items.data : []}
          sx={{ fontWeight: 400, border: "2px solid #265470" }}
        />
      </div>
      <div
        className="relative z-10 m-auto flex rounded-md bg-white opacity-90"
        style={{ height: 815 / 2, width: "37%", right: 120, bottom: 115 }}
      >
        <DataGrid
          columns={categoryColumns}
          getRowId={(row) => row.name}
          rows={categories.data ? categories.data : []}
          sx={{ fontWeight: 400, border: "2px solid #265470" }}
        />
      </div>
    </div>
  );
}
