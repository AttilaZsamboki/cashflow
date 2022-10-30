import React from "react";
import Navbar from "../components/Navbar";
import { DataGrid } from "@mui/x-data-grid";
import { trpc } from "../utils/trpc";
import DatePicker from "../components/DatePicker";

const formatter = new Intl.NumberFormat("hu", {
  style: "currency",
  currency: "HUF",
  notation: "compact",
  maximumFractionDigits: 1,
});

const Planning: React.FC = () => {
  const [startingDate, setStartingDate] = React.useState<Date>();
  const [closingDate, setClosingDate] = React.useState<Date>();
  const plans = trpc.expenses.getCashflowPlanner.useQuery();
  const mutation = trpc.expenses.updateCashflowPlanner.useMutation();
  const planGrid: Array<any> = [];
  plans.data?.forEach((plan) => {
    const category = planGrid.find((p) => p.Tétel === plan.name);
    if (category) {
      category[plan.day] = plan.planned_expense;
    } else {
      planGrid.push({ Tétel: plan.name });
    }
  });
  const [state, setState] = React.useState<any>([]);
  React.useEffect(
    () =>
      setState(
        planGrid.map((plan) =>
          Object.entries(plan)
            .filter((entries) => {
              if (Date.parse(entries[0])) {
                if (closingDate) {
                  return (
                    new Date(entries[0]) >=
                      (startingDate ? startingDate : new Date("2022-01-01")) &&
                    new Date(entries[0]) <=
                      (closingDate ? closingDate : new Date())
                  );
                } else {
                  return (
                    new Date(entries[0]).toDateString() ===
                    (startingDate
                      ? startingDate.toDateString()
                      : new Date().toDateString())
                  );
                }
              } else {
                return true;
              }
            })
            .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
            .reduce((acc: any, x) => {
              acc[x[0].toString()] = x[1];
              return acc;
            }, {})
        )
      ),
    [planGrid, startingDate, closingDate]
  );
  const screenWidth = 1100;
  return (
    <>
      <Navbar currentPage="Tervezés" />
      <div className="grid grid-cols-12 grid-rows-2 gap-4">
        <div className="col-span-4">
          <div
            className="basic-card z-1 !mt-6 ml-3"
            style={{ height: screenWidth * 0.5 - 114 - 28 * 2 }}
          >
            <DataGrid
              rows={state}
              getRowId={(row: any) => row.Tétel}
              onCellEditCommit={(row) => {
                mutation.mutate({
                  value: parseInt(row.value),
                  field: row.field,
                  id: row.id.toString(),
                });
              }}
              columns={
                state[0]
                  ? Object.keys(state[0]).map((key) => {
                      if (key !== "Tétel") {
                        return {
                          field: key,
                          headerName: new Date(key).toDateString(),
                          width: 150,
                          editable: true,
                        };
                      }
                      return {
                        field: "Tétel",
                        headerName: "Bevételek",
                        headerClassName:
                          "bg-green-600 text-white text-xl border-8 border-white",
                        width: 200,
                        headerAlign: "center",
                      };
                    })
                  : []
              }
            />
          </div>
        </div>
        <div className="col-span-3">
          <div
            className="basic-card !mt-6"
            style={{ height: screenWidth * 0.5 - 114 - 28 * 2 }}
          >
            <DataGrid
              rows={state}
              getRowId={(row: any) => row.Tétel}
              onCellEditCommit={(row) => {
                mutation.mutate({
                  value: parseInt(row.value),
                  field: row.field,
                  id: row.id.toString(),
                });
              }}
              columns={
                state[0]
                  ? Object.keys(state[0]).map((key) => {
                      if (key !== "Tétel") {
                        return {
                          field: key,
                          headerName: new Date(key).toDateString(),
                          width: 150,
                          editable: true,
                        };
                      }
                      return {
                        field: "Tétel",
                        headerName: "Beruházások",
                        headerClassName:
                          "bg-orange-500 text-white text-xl border-8 border-white",
                        width: 200,
                        headerAlign: "center",
                      };
                    })
                  : []
              }
            />
          </div>
        </div>
        <div className="col-span-2">
          <div
            className="basic-card !mt-6"
            style={{ height: screenWidth * 0.5 - 114 - 28 * 2 }}
          >
            <DataGrid
              rows={state}
              getRowId={(row: any) => row.Tétel}
              onCellEditCommit={(row) => {
                mutation.mutate({
                  value: parseInt(row.value),
                  field: row.field,
                  id: row.id.toString(),
                });
              }}
              columns={
                state[0]
                  ? Object.keys(state[0]).map((key) => {
                      if (key !== "Tétel") {
                        return {
                          field: key,
                          headerName: new Date(key).toDateString(),
                          width: 150,
                          editable: true,
                        };
                      }
                      return {
                        field: "Tétel",
                        headerName: "Finanszírozás",
                        headerClassName:
                          "bg-blue-500 text-white text-xl border-8 border-white",
                        headerAlign: "center",
                        width: 200,
                      };
                    })
                  : []
              }
            />
          </div>
        </div>
        <div className="basic-card col-span-3 !mt-6 mr-3">
          <DataGrid
            rows={state}
            getRowId={(row: any) => row.Tétel}
            onCellEditCommit={(row) => {
              mutation.mutate({
                value: parseInt(row.value),
                field: row.field,
                id: row.id.toString(),
              });
            }}
            columns={
              state[0]
                ? Object.keys(state[0]).map((key) => {
                    if (key !== "Tétel") {
                      return {
                        field: key,
                        headerName: new Date(key).toDateString(),
                        width: 150,
                        editable: true,
                      };
                    }
                    return {
                      field: "Tétel",
                      headerName: "Cashflow",
                      headerClassName:
                        "bg-yellow-400 text-white text-xl border-8 border-white",
                      width: 200,
                      headerAlign: "center",
                    };
                  })
                : []
            }
          />
        </div>
        <div className="basic-card col-span-7 ml-3">
          <DataGrid
            rows={state}
            getRowId={(row: any) => row.Tétel}
            onCellEditCommit={(row) => {
              mutation.mutate({
                value: parseInt(row.value),
                field: row.field,
                id: row.id.toString(),
              });
            }}
            columns={
              state[0]
                ? Object.keys(state[0]).map((key) => {
                    if (key !== "Tétel") {
                      return {
                        field: key,
                        headerName: new Date(key).toDateString(),
                        width: 150,
                        editable: true,
                      };
                    }
                    return {
                      field: "Tétel",
                      headerName: "Kiadás",
                      headerClassName:
                        "bg-red-700 text-white text-xl border-8 border-white",
                      width: 200,
                      headerAlign: "center",
                    };
                  })
                : []
            }
          />
        </div>
        <div className="basic-card col-span-2 pl-4 pr-4">
          <DatePicker
            setClosingDate={setClosingDate}
            setStartingDate={setStartingDate}
          />
        </div>
        <div className="col-span-3 mr-3 grid grid-cols-2 grid-rows-2">
          <div className="stat-card">
            <div className="text-md mt-10 ml-8 font-medium uppercase leading-6 text-gray-400">
              Bevételek:
            </div>
            <div className="mt-1 ml-8 text-3xl font-semibold text-gray-700">
              {formatter.format(2000000)}
            </div>
          </div>
          <div className="stat-card">
            <div className="text-md mt-10 ml-8 font-medium uppercase leading-6 text-gray-400">
              Költségek:
            </div>
            <div className="mt-1 ml-8 text-3xl font-semibold text-gray-700">
              {formatter.format(
                state
                  .map((e: any) => Object.values(e).slice(1))
                  .map((e: any) => e.reduce((a: any, b: any) => a + b, 0))
                  .reduce((a: any, b: any) => a + b, 0)
              )}
            </div>
          </div>
          <div className="stat-card">
            <div className="text-md mt-10 ml-8 font-medium uppercase leading-6 text-gray-400">
              Cashflow:
            </div>
            <div className="mt-1 ml-8 text-3xl font-semibold text-gray-700">
              {formatter.format(17000000)}
            </div>
          </div>
          <div className="stat-card">
            <div className="text-md mt-10 ml-8 font-medium uppercase leading-6 text-gray-400">
              Egyéb:
            </div>
            <div className="mt-1 ml-8 text-3xl font-semibold text-gray-700">
              {formatter.format(1000000)}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Planning;
