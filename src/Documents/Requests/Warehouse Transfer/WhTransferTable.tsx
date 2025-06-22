/* eslint-disable @typescript-eslint/no-explicit-any */
import Search from "@/components/Search";
import CreateTransfer from "./CreateTransfer";
import StatusBadge from "@/components/StatusBadge";
import { useStateContext } from "@/context/useStateContext";
import { useNavigate } from "react-router-dom";
import { whsTransferRequestMenu } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";
import { getTransfer } from "@/api/client";
import { format } from "date-fns";
import { useTableState } from "@/lib/hooks/useTableState";
import { WhsTransfer } from "@/lib/types";
import DataTable from "@/components/DataTable";
const columns = [
  { header: "Code", accessor: "transferNumber", isFirstColumn: true },
  {
    header: "Status",
    accessor: "status",
    render: (item: any) => <StatusBadge status={item.status} />,
  },
  {
    header: "From/To",
    accessor: "from",
    render: (item: any) => `${item.from}/${item.to}`,
  },
  {
    header: "Document date",
    accessor: "docDate",
    render: (item: any) => format(item.docDate, "yyyy-MM-dd"),
  },
  {
    header: "Delivery date",
    accessor: "docDueDate",
    render: (item: any) => format(item.docDueDate, "yyyy-MM-dd"),
    isLastColumn: true,
  },
];
const WhTransferTable = () => {
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
    initialSearchKey: whsTransferRequestMenu[0].value,
  });
  const {
    data: transferList,
    isFetching,
    isError,
  } = useQuery({
    queryKey: ["transferList", search.searchValue, currentPage],
    queryFn: () => {
      const searchParam = search.searchValue
        ? `${search.searchKey}=${search.searchValue}&`
        : "";
      return getTransfer(
        `/transfer?${searchParam}limit=5&page=${currentPage}`,
        setError,
        setTotalPage
      );
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
  return (
    <div className="max-w-full overflow-hidden h-full space-y-2  bg-white  border border-Primary-15  p-4 rounded-2xl">
      <div className="flex w-full   flex-col sm:flex-row justify-between gap-2 ">
        <Search
          search={search}
          setSearch={setSearch}
          menuList={whsTransferRequestMenu}
        />
        <CreateTransfer type="WHS" />
      </div>
      <div className=" sm:h-[calc(100dvh-17.325rem)] h-[calc(100dvh-20.313rem)] ">
        <DataTable
          columns={columns}
          data={transferList}
          isLoading={isFetching}
          isError={isError}
          currentPage={currentPage}
          totalPages={totalPage}
          onPageChange={handlePageChange}
          onRowClick={(transfer: WhsTransfer) =>
            navigate(
              `/rootumex/documents/requests/Wh-transfer/details/${transfer.docEntry}`
            )
          }
        />
      </div>
    </div>
  );
};

export default WhTransferTable;
