/* eslint-disable @typescript-eslint/no-explicit-any */
import { getItemsMasterData } from "@/api/client";
import Search from "@/components/Search";
import StatusBadge from "@/components/StatusBadge";
import { useStateContext } from "@/context/useStateContext";
import { itemsMenu } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import CreateItem from "./CreateItem";
import { useTableState } from "@/lib/hooks/useTableState";
import DataTable from "@/components/DataTable";
import { Item } from "@/lib/types";
const columns = [
  { header: "Code", accessor: "itemCode", isFirstColumn: true },
  {
    header: "Status",
    accessor: "status",
    render: (item: any) => (
      <StatusBadge status={item.status === true ? "Active" : "Inactive"} />
    ),
  },
  { header: "Name En.", accessor: "itemName" },
  { header: "Department", accessor: "department" },
  { header: "UoM", accessor: "uom" },
  { header: "Barcode", accessor: "barcode", isLastColumn: true },
];
const ItemsTable = () => {
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
    initialSearchKey: itemsMenu[0].value,
  });
  const {
    data: itemList,
    isFetching,
    isError,
  } = useQuery({
    queryKey: ["itemList", search, currentPage],
    queryFn: () => {
      const searchParam = search.searchValue
        ? `${search.searchKey}=${search.searchValue}&`
        : "";
      return getItemsMasterData(
        `/item?${searchParam}limit=15&page=${currentPage}`,
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
        <Search search={search} setSearch={setSearch} menuList={itemsMenu} />
        <CreateItem />
      </div>
      <div className="sm:h-[calc(100dvh-12rem)] h-[calc(100dvh-15rem)]">
        <DataTable
          columns={columns}
          data={itemList}
          isLoading={isFetching}
          isError={isError}
          currentPage={currentPage}
          totalPages={totalPage}
          onPageChange={handlePageChange}
          onRowClick={(item: Item) =>
            navigate(`/rootumex/items/details/${item.itemCode}`)
          }
        />
      </div>
    </div>
  );
};

export default ItemsTable;
