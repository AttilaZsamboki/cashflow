import type { NextPage } from "next";
import Navbar from "../components/Navbar";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import LineChart from "../components/LineChart";
import StatCard from "../components/StatCard";
import PieChart from "../components/PieChart";
import DatePicker from "../components/DatePicker";
import LinkCards from "../components/LinkCards";
import RadioListButton from "../components/RadioListButton";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { trpc } from "../utils/trpc";
import * as React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: "top" as const,
    },
    title: {
      display: true,
    },
  },
};

const columns: GridColDef[] = [
  {
    field: "Konyveles_datuma",
    headerName: "Dátum",
    width: 200,
  },
  {
    field: "name",
    headerName: "Tétel",
    width: 130,
  },
  { field: "Osszeg", headerName: "Költség", headerClassName: "font-bold" },
  { field: "vallet", headerName: "Pénztárca", headerClassName: "font-bold" },
  {
    field: "type",
    headerName: "Típus",
    width: 150,
  },
];

const Home: NextPage = () => {
  const expenses = trpc.expenses.getAll.useQuery().data;
  const vallets = trpc.expenses.getAllVallets.useQuery();
  const all = trpc.expenses.getAllIncomeExpense.useQuery();
  const [animationParent] = useAutoAnimate<HTMLDivElement>();
  const [selectedVallets, setSelectedVallets] = React.useState([""]);
  const [startingDate, setStartingDate] = React.useState<Date>();
  const [closingDate, setClosingDate] = React.useState<Date>();
  console.log(closingDate, startingDate);
  React.useEffect(() => {
    if (vallets.data) {
      setSelectedVallets(vallets.data?.map((vallet) => vallet.name));
    }
  }, [vallets.data]);
  return (
    <div ref={animationParent}>
      <Navbar currentPage="Főoldal" />
      <StatCard
        data={[
          { ammount: 200, text: "Current users" },
          { ammount: 300, text: "Number of Million $" },
          { ammount: 5000, text: "Bevétel" },
          { ammount: 500, text: "Költségek" },
          { ammount: 10000, text: "Cashflow" },
        ]}
      />
      <div className="ml-10 grid columns-2 auto-cols-max grid-cols-4 grid-rows-2">
        <LineChart options={options} type="Bevételek" />
        <LineChart options={options} type="Költségek" />
        <LineChart options={options} type="Cashflow" />
        <PieChart options={options} type="Költség Kategóriák" />
        <DatePicker
          setStartingDate={setStartingDate}
          setClosingDate={setClosingDate}
        />
        <RadioListButton
          elements={
            !vallets.data || !all.data
              ? "Loading..."
              : vallets.data?.map((vallet) => {
                  const expensesPerVallet = all.data
                    .filter((item) => item.vallet === vallet.name)
                    .map((item) => item.Osszeg)
                    .reduce((a, b) => a + Number(b), 0);
                  return {
                    valletName: vallet.name,
                    balance: vallet.nyito + expensesPerVallet,
                  };
                })
          }
          selectedVallets={selectedVallets ? selectedVallets : [""]}
          setSelectedVallets={setSelectedVallets}
        />
        <div
          style={{
            height: 385,
            marginTop: -160,
            marginLeft: -270,
            width: "150%",
          }}
        >
          <DataGrid
            rows={
              typeof expenses !== "undefined"
                ? expenses.filter((expense) =>
                    // @ts-ignore
                    selectedVallets.includes(expense.vallet)
                  )
                : []
            }
            columns={columns}
            className="rounded-lg bg-white opacity-90 shadow-lg shadow-gray-600"
          />
        </div>
        <LinkCards
          elements={[
            { href: "datas", text: "Adatok" },
            { href: "vallets", text: "Pénztrácák" },
            { href: "transactions", text: "Tranzakciók" },
            { href: "profile", text: "Profil" },
          ]}
        />
      </div>
    </div>
  );
};

export default Home;
