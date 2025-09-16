import React, { useImperativeHandle } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  flexRender,
} from "@tanstack/react-table";
import { ImSortAmountAsc, ImSortAmountDesc } from "react-icons/im";
import { TbArrowsSort } from "react-icons/tb";
import {
  FaAnglesLeft,
  FaAngleLeft,
  FaAngleRight,
  FaAnglesRight,
} from "react-icons/fa6";

const Table = ({
  data,
  ref,
  searchString,
  setSearchString,
  setContactModalConfig,
}) => {
  const columns = React.useMemo(
    () => [
      {
        id: "select",
        header: ({ table }) => (
          <input
            type="checkbox"
            className="w-4 h-4"
            checked={table.getIsAllRowsSelected()}
            onChange={(e) => table.toggleAllRowsSelected(e.target.checked)}
          />
        ),
        cell: ({ row }) => (
          <input
            type="checkbox"
            className="w-4 h-4"
            checked={row.getIsSelected()}
            onChange={row.getToggleSelectedHandler()}
          />
        ),
      },
      { accessorKey: "firstName", header: "First Name", enableSorting: true },
      { accessorKey: "lastName", header: "Last Name", enableSorting: false },
      {
        accessorKey: "email",
        header: "Email",
        cell: ({ cell }) => (
          <span className="italic text-primary">{cell.getValue()}</span>
        ),
        enableSorting: false,
      },
      {
        accessorFn: (row) => `${row.contactCode}${row.contactNumber}`, // value used for sorting
        id: "phoneNumber",
        header: "Phone Number",
        cell: ({ row }) => {
          const { contactCode, contactNumber } = row.original;
          return (
            <span>
              {contactCode} {contactNumber}
            </span>
          );
        },
        enableSorting: true,
      },
      { accessorKey: "_id", header: "Contact ID", enableHiding: true },
      { accessorKey: "uid", header: "User ID", enableHiding: true },
      {
        id: "actions",
        header: "Actions",
        cell: ({ row }) => (
          <div className="flex">
            <button
              className="px-2 py-1 bg-blue-700 text-white rounded hover:bg-blue-500"
              onClick={() =>
                setContactModalConfig({
                  open: true,
                  mode: "update",
                  userData: {
                    _id: row.original._id,
                    firstName: row.original.firstName,
                    lastName: row.original.lastName,
                    email: row.original.email,
                    contactCode: row.original.contactCode,
                    contactNumber: row.original.contactNumber,
                  },
                })
              }
            >
              Edit
            </button>
          </div>
        ),
      },
    ],
    [setContactModalConfig]
  );
  const memoData = React.useMemo(() => data, [data]);
  const [sorting, setSorting] = React.useState([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: memoData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getRowId: (row) => row._id,
    state: {
      sorting,
      rowSelection,
      pagination,
      globalFilter: searchString,
      columnVisibility: { _id: false, uid: false },
    },
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onGlobalFilterChange: setSearchString,
  });

  useImperativeHandle(ref, () => {
    return {
      getSelectedRowsIds: () => {
        return table.getSelectedRowModel().rows.map((row) => row.original._id);
      },
    };
  });

  return (
    <>
      <div className="w-full overflow-x-auto mt-2 rounded-t-lg max-h-[70vh]">
        <table className="min-w-full border border-gray-200 ">
          <thead className="bg-primary">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    onClick={
                      header.column.getCanSort()
                        ? header.column.getToggleSortingHandler()
                        : undefined
                    }
                    className="px-4 py-1 text-left cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-1 text-white">
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {header.column.getCanSort() &&
                        ({
                          asc: <ImSortAmountAsc />,
                          desc: <ImSortAmountDesc />,
                        }[header.column.getIsSorted()] ?? <TbArrowsSort />)}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>

          <tbody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-1">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={table.getAllColumns().length}
                  className="text-center py-10 text-gray-500 text-lg"
                >
                  No contacts found
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination Controls */}
      </div>
      <div className="flex items-center justify-between mt-2 py-2">
        <div className="flex gap-2">
          <button
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <FaAnglesLeft className="text-primary" />
          </button>
          <button
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <FaAngleLeft className="text-primary" />
          </button>
          <button
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <FaAngleRight className="text-primary"/>
          </button>
          <button
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <FaAnglesRight className="text-primary"/>
          </button>
        </div>
        <span className="text-sm text-gray-600">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </span>
        <select
          className="border border-gray-300 rounded p-1"
          value={table.getState().pagination.pageSize}
          onChange={(e) => table.setPageSize(Number(e.target.value))}
        >
          {[5, 10, 15, 20, 25, 30].map((size) => (
            <option key={size} value={size}>
              Show {size}
            </option>
          ))}
        </select>
      </div>
    </>
  );
};

export default Table;
