import { getTransferFLQueryOptions } from "@/api/query";
import DataTable from "@/components/DataTable";
import Search from "@/components/Search";
import StatusBadge from "@/components/StatusBadge";
import { useStateContext } from "@/context/useStateContext";
import { whsTransferFinalMenu } from "@/lib/constants";
import { useTableState } from "@/lib/hooks/useTableState";
import { WhsTransfer } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
const columns = [
  { header: "Code", accessor: "transferNumber", isFirstColumn: true },
  {
    header: "Status",
    accessor: "status",
    render: (item: WhsTransfer) => <StatusBadge status={item.status} />,
  },
  {
    header: "From/To",
    accessor: "from",
    render: (item: WhsTransfer) => `${item.from}/${item.to}`,
  },
  {
    header: "Document date",
    accessor: "docDate",
    render: (item: WhsTransfer) => format(item.docDate, "yyyy-MM-dd"),
  },
  {
    header: "Delivery date",
    accessor: "docDueDate",
    render: (item: WhsTransfer) => format(item.docDueDate, "yyyy-MM-dd"),
    isLastColumn: true,
  },
];
const WhsTransferFLTable = () => {
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
    initialSearchKey: whsTransferFinalMenu[0].value,
  });
  const {
    data: transferListFL,
    isFetching,
    isError,
  } = useQuery(
    getTransferFLQueryOptions(
      search,
      currentPage,
      setTotalPage,
      setError,
      "WHS"
    )
  );
  return (
    <div className="max-w-full overflow-hidden h-full space-y-2  bg-white  border border-Primary-15  p-4 rounded-2xl">
      <div className="flex w-full   flex-col sm:flex-row justify-between gap-2 ">
        <Search
          search={search}
          setSearch={setSearch}
          menuList={whsTransferFinalMenu}
        />
      </div>
      <div className=" h-[calc(100dvh-17.325rem)]">
        <DataTable
          columns={columns}
          data={transferListFL}
          isLoading={isFetching}
          isError={isError}
          currentPage={currentPage}
          totalPages={totalPage}
          onPageChange={handlePageChange}
          onRowClick={(transfer: WhsTransfer) =>
            navigate(
              `/rootumex/documents/final-docs/Wh-transfer-FL/details/${transfer.docEntry}`
            )
          }
        />
      </div>
    </div>
  );
};

export default WhsTransferFLTable;
