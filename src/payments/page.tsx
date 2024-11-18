import { getCoreRowModel, useReactTable } from "@tanstack/react-table"
import { columns } from "./columns"
import { payments } from "./data"
import { DataTable } from "./data-table"


export default function PaymentsPage() {

    const table = useReactTable({
        data: payments,
        columns,
        getCoreRowModel: getCoreRowModel(),
    })

    return (
        <DataTable table={table} />
    )
}
