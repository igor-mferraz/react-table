import {
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  Table as TableHtml,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Row, Table, flexRender } from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";
import { useRef } from "react";

interface DataTableProps<TData> {
  table: Table<TData>;
  columnOrder: string[];
  setColumnOrder: (columnOrder: string[]) => void;
}

export function DataTable<TData>({ table, columnOrder, setColumnOrder }: DataTableProps<TData>) {
  const tableContainerRef = useRef<HTMLDivElement>(null)
  const { rows } = table.getRowModel()
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => 48,
    getScrollElement: () => tableContainerRef.current,
    measureElement:
      typeof window !== 'undefined' && navigator.userAgent.indexOf('Firefox') === -1
        ? element => element?.getBoundingClientRect().height : undefined,
  })

  const reorderColumns = ({ selected, alvo }: { selected: string, alvo: string }) => {
    const newColumnOrder = [...columnOrder];
    const selectedIdx = newColumnOrder.indexOf(selected);
    const alvoIdx = newColumnOrder.indexOf(alvo);
    const [dragged] = newColumnOrder.splice(selectedIdx, 1);
    newColumnOrder.splice(alvoIdx, 0, dragged);
    setColumnOrder(newColumnOrder);
  }


  return (
    <div className="h-full w-full overflow-auto border  p-2 rounded-md" ref={tableContainerRef}>
      <TableHtml className="h-full w-full overflow-auto">
        <TableHeader className=" items-center justify-center">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} className="hover:bg-transparent flex w-full items-center">
              {headerGroup.headers.map((header) => (
                <TableHead
                  onDragStart={(e) => {
                    e.dataTransfer.setData("headerId", header.id);
                  }}
                  onDragLeave={(e) => {
                    e.currentTarget.classList.remove("bg-slate-300");
                  }}
                  onDragOver={(e) => {
                    e.currentTarget.classList.add("bg-slate-300");
                    e.preventDefault();
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    e.currentTarget.classList.remove("bg-slate-300");
                    const draggedHeaderId = e.dataTransfer.getData("headerId");
                    reorderColumns({ selected: draggedHeaderId, alvo: header.id });
                  }}
                  draggable
                  key={header.id}
                  style={{ width: header.getSize() }}>

                  {header.isPlaceholder ? null : (
                    <div
                      {...{
                        className: header.column.getCanSort()
                          ? "cursor-pointer select-none flex justify-between items-center"
                          : "items-center",
                      }}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                    </div>
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody style={{ height: `${rowVirtualizer.getTotalSize()}px` }} className="relative h-full w-full overflow-auto">
          {table.getRowModel().rows?.length ? (
            rowVirtualizer.getVirtualItems().map((virtualRow) => {
              const row = rows[virtualRow.index] as Row<TData>
              return (
                <TableRow
                  data-index={virtualRow.index}
                  ref={node => rowVirtualizer.measureElement(node)}
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className={cn("flex absolute w-full")}
                  style={{ transform: `translateY(${virtualRow.start}px)`, }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}
                      className="flex items-center whitespace-nowrap"
                      style={{
                        width: cell.column.getSize()
                      }}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              )
            })
          ) : (
            <TableRow>
              <TableCell
                colSpan={table.getAllColumns().length}
                className="h-24 text-center"
              >
                Sem resultados.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </TableHtml>
    </div>
  );
}
