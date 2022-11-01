import React from "react";
import Navbar from "../components/Navbar";
import { DataGrid, GridValueFormatterParams, huHU } from "@mui/x-data-grid";
import { trpc } from "../utils/trpc";
import DatePicker from "../components/DatePicker";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

const formatter = new Intl.NumberFormat("hu", {
  style: "currency",
  currency: "HUF",
  notation: "compact",
  maximumFractionDigits: 1,
});

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

const Planning: React.FC = () => {
  const [startingDate, setStartingDate] = React.useState<Date>();
  const [closingDate, setClosingDate] = React.useState<Date>();
  const plans = trpc.expenses.getCashflowPlanner.useQuery();
  const mutation = trpc.expenses.updateCashflowPlanner.useMutation();
  const expensePlanGrid: Array<any> = [];
  const incomePlanGrid: Array<any> = [];
  const investmentPlanGrid: Array<any> = [];
  const financingPlanGrid: Array<any> = [];
  const [expenseState, setExpenseState] = React.useState<any>([]);
  const [incomeState, setIncomeState] = React.useState<any>([]);
  const [investmentState, setInvestmentState] = React.useState<any>([]);
  const [financingState, setFinancingState] = React.useState<any>([]);
  const [rows, setRows] = React.useState<{ sum: number; name: string }[]>([]);
  React.useEffect(() => {
    setRows([
      {
        name: "Bevételek",
        sum: incomeState
          .map((e: any) => Object.values(e).slice(1))
          .map((e: any) => e.reduce((a: any, b: any) => a + b, 0))
          .reduce((a: any, b: any) => a + b, 0),
      },
      {
        name: "Finanszírozás",
        sum:
          Math.abs(
            financingState
              .map((e: any) => Object.values(e).slice(1))
              .map((e: any) => e.reduce((a: any, b: any) => a + b, 0))
              .reduce((a: any, b: any) => a + b, 0)
          ) * -1,
      },
      {
        name: "Kiadások",
        sum:
          Math.abs(
            expenseState
              .map((e: any) => Object.values(e).slice(1))
              .map((e: any) => e.reduce((a: any, b: any) => a + b, 0))
              .reduce((a: any, b: any) => a + b, 0)
          ) * -1,
      },
      {
        name: "Beruházások",
        sum:
          Math.abs(
            investmentState
              .map((e: any) => Object.values(e).slice(1))
              .map((e: any) => e.reduce((a: any, b: any) => a + b, 0))
              .reduce((a: any, b: any) => a + b, 0)
          ) * -1,
      },
      {
        name: "Cashflow",
        sum: cashflowSum,
      },
    ]);
  }, [investmentState, incomeState, financingState, expenseState]);
  const sorter = (type: string) => {
    plans.data
      ?.filter((items) => items.tipus === type)
      .forEach((plan) => {
        let category;
        if (type === "kiadás") {
          category = expensePlanGrid.find((p) => p.Tétel === plan.name);
        } else if (type === "bevétel") {
          category = incomePlanGrid.find((p) => p.Tétel === plan.name);
        } else if (type === "beruházás") {
          category = investmentPlanGrid.find((p) => p.Tétel === plan.name);
        } else if (type === "finanszírozás") {
          category = financingPlanGrid.find((p) => p.Tétel === plan.name);
        }
        if (category) {
          category[plan.day] = plan.planned_expense;
        } else {
          if (type === "kiadás") {
            expensePlanGrid.push({ Tétel: plan.name });
          } else if (type === "bevétel") {
            incomePlanGrid.push({ Tétel: plan.name });
          } else if (type === "beruházás") {
            investmentPlanGrid.push({ Tétel: plan.name });
          } else if (type === "finanszírozás") {
            financingPlanGrid.push({ Tétel: plan.name });
          }
        }
        if (category) {
          category[plan.day] = plan.planned_expense;
        }
      });
  };
  sorter("kiadás");
  sorter("bevétel");
  sorter("beruházás");
  sorter("finanszírozás");
  React.useEffect(() => {
    setFinancingState(
      financingPlanGrid.map((plan) =>
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
    );
  }, [financingPlanGrid, startingDate, closingDate]);
  React.useEffect(
    () =>
      setExpenseState(
        expensePlanGrid.map((plan) =>
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
    [expensePlanGrid, startingDate, closingDate]
  );
  React.useEffect(
    () =>
      setIncomeState(
        incomePlanGrid.map((plan) =>
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
    [incomePlanGrid, startingDate, closingDate]
  );
  React.useEffect(
    () =>
      setInvestmentState(
        investmentPlanGrid.map((plan) =>
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
    [investmentPlanGrid, startingDate, closingDate]
  );

  const cashflowSum =
    incomeState
      .map((e: any) => Object.values(e).slice(1))
      .map((e: any) => e.reduce((a: any, b: any) => a + b, 0))
      .reduce((a: any, b: any) => a + b, 0) -
    expenseState
      .map((e: any) => Object.values(e).slice(1))
      .map((e: any) => e.reduce((a: any, b: any) => a + b, 0))
      .reduce((a: any, b: any) => a + b, 0) -
    financingState
      .map((e: any) => Object.values(e).slice(1))
      .map((e: any) => e.reduce((a: any, b: any) => a + b, 0))
      .reduce((a: any, b: any) => a + b, 0) -
    investmentState
      .map((e: any) => Object.values(e).slice(1))
      .map((e: any) => e.reduce((a: any, b: any) => a + b, 0))
      .reduce((a: any, b: any) => a + b, 0);
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
              rows={incomeState}
              getRowId={(row: any) => row.Tétel}
              localeText={huHU.components.MuiDataGrid.defaultProps.localeText}
              onCellEditCommit={(row) => {
                mutation.mutate({
                  value: parseInt(row.value),
                  field: row.field,
                  id: row.id.toString(),
                });
              }}
              columnBuffer={100}
              columns={
                incomeState[0]
                  ? Object.keys(incomeState[0]).map((key) => {
                      if (key !== "Tétel") {
                        return {
                          field: key,
                          headerName: new Date(key).toDateString(),
                          width: 150,
                          editable: true,
                          valueFormatter: valueFormatter,
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
              rows={investmentState}
              getRowId={(row: any) => row.Tétel}
              localeText={huHU.components.MuiDataGrid.defaultProps.localeText}
              onCellEditCommit={(row) => {
                mutation.mutate({
                  value: parseInt(row.value),
                  field: row.field,
                  id: row.id.toString(),
                });
              }}
              columns={
                investmentState[0]
                  ? Object.keys(investmentState[0]).map((key) => {
                      if (key !== "Tétel") {
                        return {
                          field: key,
                          headerName: new Date(key).toDateString(),
                          width: 150,
                          editable: true,
                          valueFormatter: valueFormatter,
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
              rows={financingState}
              getRowId={(row: any) => row.Tétel}
              localeText={huHU.components.MuiDataGrid.defaultProps.localeText}
              onCellEditCommit={(row) => {
                mutation.mutate({
                  value: parseInt(row.value),
                  field: row.field,
                  id: row.id.toString(),
                });
              }}
              columns={
                financingState[0]
                  ? Object.keys(financingState[0]).map((key) => {
                      if (key !== "Tétel") {
                        return {
                          field: key,
                          headerName: new Date(key).toDateString(),
                          width: 150,
                          editable: true,
                          valueFormatter: valueFormatter,
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
        <div className="basic-card col-span-3 mt-6 mr-6">
          <TableContainer style={{ height: "100%" }} component={Paper}>
            <Table sx={{ minWidth: 150 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Típus</TableCell>
                  <TableCell align="right">Összeg</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={row.name}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell component="th" scope="row">
                      {row.name}
                    </TableCell>
                    <TableCell align="right">
                      {formatter.format(row.sum)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <div className="basic-card col-span-7 ml-3">
          <DataGrid
            rows={expenseState}
            getRowId={(row: any) => row.Tétel}
            localeText={huHU.components.MuiDataGrid.defaultProps.localeText}
            onCellEditCommit={(row) => {
              mutation.mutate({
                value: parseInt(row.value),
                field: row.field,
                id: row.id.toString(),
              });
            }}
            columns={
              expenseState[0]
                ? Object.keys(expenseState[0]).map((key) => {
                    if (key !== "Tétel") {
                      return {
                        field: key,
                        headerName: new Date(key).toDateString(),
                        width: 150,
                        editable: true,
                        valueFormatter: valueFormatter,
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
              {formatter.format(
                incomeState
                  .map((e: any) => Object.values(e).slice(1))
                  .map((e: any) => e.reduce((a: any, b: any) => a + b, 0))
                  .reduce((a: any, b: any) => a + b, 0)
              )}
            </div>
          </div>
          <div className="stat-card">
            <div className="text-md mt-10 ml-8 font-medium uppercase leading-6 text-gray-400">
              Költségek:
            </div>
            <div className="mt-1 ml-8 text-3xl font-semibold text-gray-700">
              {formatter.format(
                expenseState
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
              {formatter.format(cashflowSum)}
            </div>
          </div>
          <div>
            <div className="stat-card">
              <div className="text-md ml-8 py-3 font-medium uppercase leading-6 text-gray-400">
                Finanszírozások:
              </div>
              <div className="-mt-2 ml-8 pb-3 text-3xl font-semibold text-gray-700">
                {formatter.format(
                  financingState
                    .map((e: any) => Object.values(e).slice(1))
                    .map((e: any) => e.reduce((a: any, b: any) => a + b, 0))
                    .reduce((a: any, b: any) => a + b, 0)
                )}
              </div>
            </div>
            <div className="stat-card">
              <div className="text-md ml-8 py-3 font-medium uppercase leading-6 text-gray-400">
                Beruházások:
              </div>
              <div className="-mt-2 ml-8 pb-2 text-3xl font-semibold text-gray-700">
                {formatter.format(
                  investmentState
                    .map((e: any) => Object.values(e).slice(1))
                    .map((e: any) => e.reduce((a: any, b: any) => a + b, 0))
                    .reduce((a: any, b: any) => a + b, 0)
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Planning;
