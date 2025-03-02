import { ColumnDef } from "@tanstack/react-table"

export type Payment = {
  id: string
  amount: number
  status: "pending" | "processing" | "success" | "failed"
  email: string
}

export const columns: ColumnDef<Payment>[] = [
  {
    id: 'status',
    accessorKey: "status",
    header: "Status",
  },
  {
    id: 'email',
    accessorKey: "email",
    header: "Email",
  },
  {
    id: 'amount',
    accessorKey: "amount",
    header: "Amount",
  },
  {
    id: 'phone',
    accessorKey: "phone",
    header: "Phone",
  },
  {
    id: 'adress',
    accessorKey: "adress",
    header: "Adress",
  },
]
