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

  const typeColumns: GridColDef[] = [
    {
      field: "name",
      headerName: "Típus",
      width: 420,
    },
  ];
  const partnerColumns: GridColDef[] = [
    {
      field: "name",
      headerName: "Partner",
      width: 420,
    },
  ];
  const categoryColumns: GridColDef[] = [
    {
      field: "name",
      headerName: `Kategória`,
      width: 208,
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
      headerName: `Tétel`,
      width: 180,
    },
    {
      field: "type",
      headerName: `Típus`,
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
  const tabs = ["Tétel", "Kategória", "Kapcsolat", "Partnerek", "Típusok"];
  const categories = trpc.expenses.getCategoriesByType.useQuery({
    type: singularItemType.toLowerCase(),
  });
  const items = trpc.expenses.getItemByType.useQuery(
    {
      type: singularItemType.toLowerCase(),
    },
    { staleTime: 3000 }
  );
  const types = trpc.expenses.getTypeByType.useQuery({
    type: singularItemType.toLowerCase(),
  });
  const connections = trpc.expenses.getConnectionsByType.useQuery({
    type: singularItemType.toLowerCase(),
  });
  const partners = trpc.expenses.getPartnersByType.useQuery({
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
      <div className="absolute top-64 left-4 bottom-2 mx-auto mt-4 w-full max-w-md rounded-md bg-white py-8 px-3">
        <Tabs
          itemType={singularItemType.toLowerCase()}
          items={items}
          tabNames={tabs.map((t) => t)}
        />
      </div>
      <div
        className="absolute bottom-2 left-96 z-10 m-auto ml-24 flex rounded-md bg-white opacity-90"
        style={{ height: 815 / 2, width: "26.5%" }}
      >
        <DataGrid
          columns={connectionColumns}
          rows={connections.data ? connections.data : []}
          sx={{ fontWeight: 400 }}
        />
      </div>
      <div
        className="absolute right-4 bottom-2 z-10 m-auto flex rounded-md bg-white opacity-90"
        style={{ height: 815 / 2, width: "23.25%" }}
      >
        <DataGrid
          columns={typeColumns}
          rows={types.data ? types.data : []}
          sx={{ fontWeight: 400 }}
          getRowId={(row) => row.name}
        />
      </div>
      <div
        className="absolute right-96 bottom-2 z-10 m-auto flex rounded-md bg-white opacity-90"
        style={{ height: 815 / 2, width: "23.25%", marginRight: 90 }}
      >
        <DataGrid
          columns={partnerColumns}
          rows={partners.data ? partners.data : []}
          getRowId={(row) => row.name}
          sx={{ fontWeight: 400 }}
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
          sx={{ fontWeight: 400 }}
        />
      </div>
      <div
        className="relative z-10 m-auto flex rounded-md bg-white opacity-90"
        style={{ height: 815 / 2, width: "37%", right: 125, bottom: 115 }}
      >
        <DataGrid
          columns={categoryColumns}
          getRowId={(row) => row.name}
          rows={categories.data ? categories.data : []}
          sx={{ fontWeight: 400 }}
        />
      </div>
    </div>
  );
}
