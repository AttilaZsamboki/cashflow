import React from "react";
import Navbar from "../components/Navbar";
import { DataGrid } from "@mui/x-data-grid";
import { trpc } from "../utils/trpc";

const Planning: React.FC = () => {
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
  const sortable = planGrid.map((plan) =>
    Object.entries(plan)
      .sort(([a], [b]) => new Date(a).getTime() - new Date(b).getTime())
      .reduce((acc, x) => {
        // @ts-ignore
        acc[x[0].toString()] = x[1];
        return acc;
      }, {})
  );
  React.useEffect(() => setState(sortable), [sortable]);
  console.log(state);
  return (
    <>
      <Navbar currentPage="Tervezés" />
      <div
        className="m-10 w-4/5 rounded-md bg-white opacity-90 shadow-md shadow-gray-600"
        style={{ height: 750 }}
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
            sortable[0]
              ? Object.keys(sortable[0]).map((key) => {
                  if (key !== "Tétel") {
                    return {
                      field: key,
                      headerName: new Date(key).toDateString(),
                      width: 150,
                      editable: true,
                    };
                  }
                  return { field: "Tétel", width: 200 };
                })
              : []
          }
        />
      </div>
    </>
  );
};

export default Planning;
