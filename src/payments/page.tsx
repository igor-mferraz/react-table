import { getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { columns } from "./columns"
import { payments } from "./data"
import { DataTable } from "./data-table"
import { useState } from "react";

export default function PaymentsPage() {

    const [columnOrder, setColumnOrder] = useState<string[]>(
        columns.map(col => col.id!)
      );

    const table = useReactTable({
        data: payments,
        columns,
        state:{
            columnOrder: columnOrder
        },
        getCoreRowModel: getCoreRowModel(),
        onColumnOrderChange: setColumnOrder
        
    })

    return (
        <div className="flex flex-col gap-2">
            <DataTable columnOrder={columnOrder} setColumnOrder={setColumnOrder} table={table} />
        </div>
    )
}
