/* eslint-disable @typescript-eslint/no-explicit-any */
import { getStockCount } from "@/api/client";

import Search from "@/components/Search";
import StatusBadge from "@/components/StatusBadge";
import { useStateContext } from "@/context/useStateContext";
import { stockMenu } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import CreateStockCount from "./CreateStockCount";
import { useTableState } from "@/lib/hooks/useTableState";
import DataTable from "@/components/DataTable";
import { StockCount } from "@/lib/types";
const columns = [
  { header: "Code", accessor: "inventory_count_number", isFirstColumn: true },
  { header: "Warehouse", accessor: "warehouse_code" },
  {
    header: "Status",
    accessor: "status",
    render: (item: any) => <StatusBadge status={item.status} />,
  },
  { header: "Document date", accessor: "doc_date", isLastColumn: true },
];
const StockCountTable = () => {
  const { setError } = useStateContext();
  const navigate = useNavigate();

  const {
    currentPage,
    handlePageChange,
    search,
    setSearch,
    totalPage,
    setTotalPage,
  } = useTableState({
    initialSearchKey: stockMenu[0].value,
  });
  const {
    data: stockCountList,
    isFetching,
    isError,
  } = useQuery({
    queryKey: ["stockCountList", search, currentPage],
    queryFn: () => {
      const searchParam = search.searchValue
        ? `${search.searchKey}=${search.searchValue}&`
        : "";

      return getStockCount(
        `/inventory_count?${searchParam}limit=15&page=${currentPage}`,
        setError,
        setTotalPage
      );
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  return (
    <div className="max-w-full overflow-hidden h-full space-y-2  bg-white border border-Primary-15  p-4 rounded-2xl">
      <div className="flex w-full   flex-col sm:flex-row justify-between gap-2 ">
        <Search search={search} setSearch={setSearch} menuList={stockMenu} />
        <CreateStockCount />
      </div>
      <div className="sm:h-[calc(100dvh-12rem)] h-[calc(100dvh-15rem)] ">
        <DataTable
          columns={columns}
          data={stockCountList}
          isLoading={isFetching}
          isError={isError}
          currentPage={currentPage}
          totalPages={totalPage}
          onPageChange={handlePageChange}
          onRowClick={(stockCount: StockCount) =>
            navigate(`/rootumex/stock-count/details/${stockCount.doc_entry}`)
          }
        />
      </div>
    </div>
  );
};

export default StockCountTable;
