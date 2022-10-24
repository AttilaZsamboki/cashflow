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

const formatter = new Intl.NumberFormat("hu", {
  style: "currency",
  currency: "HUF",
});

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
  const cashflowSummary = trpc.expenses.getCashflowSummary.useQuery();
  const all = trpc.expenses.getAllIncomeExpense.useQuery();
  const [animationParent] = useAutoAnimate<HTMLDivElement>();
  const [selectedVallets, setSelectedVallets] = React.useState([""]);
  const [startingDate, setStartingDate] = React.useState(
    new Date(new Date().getFullYear(), new Date().getMonth() - 1, 28)
  );
  const [closingDate, setClosingDate] = React.useState(new Date());
  React.useEffect(() => {
    if (vallets.data) {
      setSelectedVallets(vallets.data?.map((vallet) => vallet.name));
    }
  }, [vallets.data]);
  const filteredExpenses = expenses
    ? expenses
        .filter((item) => (item.Osszeg ? item.Osszeg < 0 : false))
        .filter((expense) =>
          selectedVallets.includes(expense.vallet ? expense.vallet : "")
        )
        .filter((expense) => {
          if (expense.Konyveles_datuma) {
            if (closingDate) {
              return (
                expense.Konyveles_datuma >= startingDate &&
                expense.Konyveles_datuma <= closingDate
              );
            } else {
              return (
                new Date(expense.Konyveles_datuma).toDateString() ===
                new Date(startingDate).toDateString()
              );
            }
          }
        })
    : null;
  const filteredIncome = all.data
    ? all.data
        .filter((item) => (item.Osszeg ? item.Osszeg > 0 : false))
        .filter((expense) =>
          selectedVallets.includes(expense.vallet ? expense.vallet : "")
        )
        .filter((expense) => {
          if (expense.Konyveles_datuma) {
            if (closingDate) {
              return (
                expense.Konyveles_datuma >= startingDate &&
                expense.Konyveles_datuma <= closingDate
              );
            } else {
              return (
                new Date(expense.Konyveles_datuma).toDateString() ===
                new Date(startingDate).toDateString()
              );
            }
          }
        })
    : 0;
  const filteredAll = all.data
    ? all.data
        .filter((expense) =>
          selectedVallets.includes(expense.vallet ? expense.vallet : "")
        )
        .filter((expense) => {
          if (expense.Konyveles_datuma) {
            if (closingDate) {
              return (
                expense.Konyveles_datuma >= startingDate &&
                expense.Konyveles_datuma <= closingDate
              );
            } else {
              return (
                new Date(expense.Konyveles_datuma).toDateString() ===
                new Date(startingDate).toDateString()
              );
            }
          }
        })
    : 0;

  const totalIncome = filteredIncome
    ? filteredIncome
        .map((income) => income.Osszeg)
        .reduce((a, b) => Number(a) + Number(b), 0)
    : 0;
  const totalExpenses = filteredExpenses
    ? filteredExpenses
        .map((expense) => expense.Osszeg)
        .reduce((a, b) => Number(a) + Number(b), 0)
    : 0;
  const filteredCashflowSummary = cashflowSummary.data
    ? cashflowSummary.data
        .filter((item) =>
          selectedVallets.includes(item.vallet ? item.vallet : "")
        )
        .filter((item) => {
          if (item.date) {
            if (closingDate) {
              return (
                new Date(item.date) >= startingDate &&
                new Date(item.date) <= closingDate
              );
            } else {
              return (
                new Date(item.date).toDateString() ===
                new Date(startingDate).toDateString()
              );
            }
          }
        })
    : 0;
  return (
    <div ref={animationParent}>
      <Navbar currentPage="Főoldal" />
      <StatCard
        data={[
          {
            ammount: formatter.format(totalExpenses ? totalExpenses : 0),
            text: "Össz. Költség",
          },
          {
            ammount: formatter.format(totalIncome),
            text: "Össz. Bevétel",
          },
          {
            ammount: totalExpenses
              ? formatter.format(totalExpenses + totalIncome)
              : formatter.format(totalIncome),
            text: "Cashflow",
          },
          {
            ammount: totalExpenses
              ? formatter.format((totalExpenses + totalIncome) * 0.9)
              : formatter.format(totalIncome * 0.9),
            text: "Terv",
          },
          {
            ammount:
              totalIncome === 0
                ? "-100%"
                : totalExpenses
                ? Number(
                    (totalIncome + totalExpenses) / totalIncome
                  ).toLocaleString(undefined, {
                    style: "percent",
                    minimumFractionDigits: 2,
                  })
                : "100%",
            text: "CF %",
          },
        ]}
      />
      <div className="ml-10 grid columns-2 auto-cols-max grid-cols-4 grid-rows-2">
        <LineChart
          datas={
            filteredCashflowSummary
              ? filteredCashflowSummary.map((item) =>
                  item.income ? item.income : 0
                )
              : [0]
          }
          options={options}
          type="Bevételek"
          startDate={startingDate}
          endDate={closingDate}
        />
        <LineChart
          datas={
            filteredCashflowSummary
              ? filteredCashflowSummary.map((item) => Number(item.expense))
              : [0]
          }
          options={options}
          type="Költségek"
          startDate={startingDate}
          endDate={closingDate}
        />
        <LineChart
          datas={
            filteredCashflowSummary
              ? filteredCashflowSummary.map((item) => Number(item.cf))
              : [0]
          }
          options={options}
          type="Cashflow"
          startDate={startingDate}
          endDate={closingDate}
        />
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
                    .filter((expense) => {
                      if (expense.Konyveles_datuma) {
                        if (closingDate) {
                          return (
                            expense.Konyveles_datuma >= startingDate &&
                            expense.Konyveles_datuma <= closingDate
                          );
                        } else {
                          return (
                            new Date(
                              expense.Konyveles_datuma
                            ).toDateString() ===
                            new Date(startingDate).toDateString()
                          );
                        }
                      }
                    })
                    .map((item) => item.Osszeg)
                    .reduce((a, b) => a + Number(b), 0);
                  return {
                    valletName: vallet.name,
                    balance: vallet.nyito + expensesPerVallet,
                  };
                })
          }
          startingClosingDate={[startingDate, closingDate]}
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
            rows={filteredAll ? filteredAll : [0]}
            columns={columns}
            getRowId={(row) => row.id}
            className="rounded-3xl bg-white opacity-90 shadow-lg shadow-gray-600"
          />
        </div>
        <LinkCards
          elements={[
            { href: "datas", text: "Adatok" },
            { href: "vallets", text: "Pénztrácák" },
            { href: "transactions", text: "Tranzakciók" },
            {
              href: "https://datastudio.google.com/u/0/",
              text: "Google Looker Studio",
            },
          ]}
        />
      </div>
    </div>
  );
};

export default Home;
