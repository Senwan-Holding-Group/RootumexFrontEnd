import Search from "@/components/Search";
import StatusBadge from "@/components/StatusBadge";
import { itemsMenu } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import CreateItem from "./CreateItem";
import { useTableState } from "@/lib/hooks/useTableState";
import DataTable from "@/components/DataTable";
import { Item } from "@/lib/types";
import { getItemsQueryOptions } from "@/api/query";
const columns = [
  { header: "Code", accessor: "itemCode", isFirstColumn: true },
  {
    header: "Status",
    accessor: "status",
    render: (item: Item) => (
      <StatusBadge status={item.status === true ? "Active" : "Inactive"} />
    ),
  },
  { header: "Name En.", accessor: "itemName" },
  { header: "Department", accessor: "department" },
  { header: "UoM", accessor: "uom" },
  { header: "Barcode", accessor: "barcode", isLastColumn: true },
];
const ItemsTable = () => {
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
    error,
  } = useQuery(getItemsQueryOptions(search, currentPage, setTotalPage));
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
          error={error}
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
