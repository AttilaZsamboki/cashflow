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
import { faker } from "@faker-js/faker";
import LineChart from "../components/LineChart";
import StatCard from "../components/StatCard";
import PieChart from "../components/PieChart";
import DatePicker from "../components/DatePicker";
import LinkCards from "../components/LinkCards";

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

const labels = ["January", "February", "March", "April", "May", "June", "July"];

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

export const data = {
  labels,
  datasets: [
    {
      label: "Dataset 1",
      data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
      borderColor: "rgb(255, 99, 132)",
      backgroundColor: "rgba(255, 99, 132, 0.5)",
    },
    {
      label: "Dataset 2",
      data: labels.map(() => faker.datatype.number({ min: -1000, max: 1000 })),
      borderColor: "rgb(53, 162, 235)",
      backgroundColor: "rgba(53, 162, 235, 0.5)",
    },
  ],
};

const Home: NextPage = () => {
  return (
    <div>
      <Navbar currentPage="Főoldal" />
      <StatCard data={200} text="Current users" />
      <div className="ml-10 grid columns-2 auto-cols-max grid-cols-4 grid-rows-2">
        <LineChart options={options} data={data} type="Bevételek" />
        <LineChart options={options} data={data} type="Költségek" />
        <LineChart options={options} data={data} type="Cashflow" />
        <PieChart options={options} data={data} type="Költség Kategóriák" />
        <DatePicker />
        <DatePicker />
        <div
          className="grid-col-1 grid grid-flow-row-dense"
          style={{ marginTop: -180, height: 350 }}
        >
          <LinkCards href="datas" text="Adatok" />
          <LinkCards href="vallets" text="Pénztrácák" />
          <LinkCards href="transactions" text="Tranzakciók" />
          <LinkCards href="profile" text="Profil" />
        </div>
      </div>
    </div>
  );
};

export default Home;
