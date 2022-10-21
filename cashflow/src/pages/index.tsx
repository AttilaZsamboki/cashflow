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

const Home: NextPage = () => {
  return (
    <div>
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
        <DatePicker />
        <RadioListButton
          elements={[
            { valletName: "AppaCash", balance: 300 },
            { valletName: "AnyaCash", balance: 200 },
            { valletName: "K&H", balance: 500 },
            { valletName: "AttiCash", balance: 100 },
          ]}
        />
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
