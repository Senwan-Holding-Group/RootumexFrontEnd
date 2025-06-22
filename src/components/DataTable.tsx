/* eslint-disable @typescript-eslint/no-explicit-any */
import { ReactNode } from "react";
import DataRenderer from "@/components/DataRenderer";
import Pagination from "@/components/Pagination";

type Column = {
  header: string;
  accessor: string;
  render?: (item: any) => ReactNode;
  isFirstColumn?: boolean;
  isLastColumn?: boolean;
}

type DataTableProps = {
  columns: Column[];
  data: any[] | undefined;
  isLoading: boolean;
  isError: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onRowClick?: (item: any) => void;
  emptyMessage?: string;
}

const DataTable = ({
  columns,
  data,
  isLoading,
  isError,
  currentPage,
  totalPages,
  onPageChange,
  onRowClick,
  emptyMessage = "No data found"
}: DataTableProps) => {
  return (
    <div className="border-2 h-full border-Primary-5 rounded-2xl block overflow-scroll">
      <DataRenderer isLoading={isLoading} isError={isError}>
        <table className="w-full caption-bottom">
          <thead className="sticky top-0 w-full bg-Primary-5">
            <tr className="text-nowrap font-semibold text-base/CS text-left text-Primary-400">
              {columns.map((column, index) => (
                <th 
                  key={column.accessor} 
                  className={`pr-6 pl-4 py-3 ${index === 0 ? 'rounded-tl-xl' : ''} ${index === columns.length - 1 ? 'rounded-tr-xl' : ''}`}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="[&_tr:last-child]:border-0">
            {!data?.length ? (
              <tr className="p-6">
                <td colSpan={columns.length} className="text-center">
                  {emptyMessage}
                </td>
              </tr>
            ) : (
              data.map((item, rowIndex) => (
                <tr
                  key={rowIndex}
                  onClick={() => onRowClick && onRowClick(item)}
                  className="text-RT-Black text-nowrap font-medium text-base/CS border-b-1 border-Primary-15 transition duration-300 ease-in-out hover:bg-gray-100 cursor-pointer"
                >
                  {columns.map((column) => (
                    <td key={`${rowIndex}-${column.accessor}`} className="pr-6 pl-4 py-3">
                      {column.render 
                        ? column.render(item) 
                        : item[column.accessor]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
          <tfoot className="sticky -bottom-0 w-full">
            <tr>
              <td colSpan={columns.length}>
                <Pagination
                  totalPages={totalPages}
                  currentPage={currentPage}
                  onPageChange={onPageChange}
                />
              </td>
            </tr>
          </tfoot>
        </table>
      </DataRenderer>
    </div>
  );
};

export default DataTable