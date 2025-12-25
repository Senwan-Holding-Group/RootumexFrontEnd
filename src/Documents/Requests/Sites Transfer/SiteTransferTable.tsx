import Search from "@/components/Search";
import { siteTransferRequestMenu } from "@/lib/constants";
import CreateTransfer from "../Warehouse Transfer/CreateTransfer";
import { useNavigate } from "react-router-dom";
import StatusBadge from "@/components/StatusBadge";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useTableState } from "@/lib/hooks/useTableState";
import DataTable from "@/components/DataTable";
import { WhsTransfer } from "@/lib/types";
import { getTransferQueryOptions } from "@/api/query";
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
const SiteTransferTable = () => {
  const navigate = useNavigate();
  const {
    currentPage,
    handlePageChange,
    search,
    setSearch,
    totalPage,
    setTotalPage,
  } = useTableState({
    initialSearchKey: siteTransferRequestMenu[0].value,
  });
  const {
    data: siteTransferList,
    isFetching,
    isError,
    error,
  } = useQuery(
    getTransferQueryOptions(search, currentPage, setTotalPage, "SITE")
  );
  return (
    <div className="max-w-full overflow-hidden h-full space-y-2  bg-white  border border-Primary-15  p-4 rounded-2xl">
      <div className="flex w-full   flex-col sm:flex-row justify-between gap-2 ">
        <Search
          search={search}
          setSearch={setSearch}
          menuList={siteTransferRequestMenu}
        />
        <CreateTransfer type="SITE" />
      </div>
      <div className=" sm:h-[calc(100dvh-17.325rem)] h-[calc(100dvh-20.313rem)]">
        <DataTable
          columns={columns}
          data={siteTransferList}
          isLoading={isFetching}
          isError={isError}
          error={error}
          currentPage={currentPage}
          totalPages={totalPage}
          onPageChange={handlePageChange}
          onRowClick={(siteTransfer: WhsTransfer) =>
            navigate(
              `/rootumex/documents/requests/sites-transfer/details/${siteTransfer.docEntry}`
            )
          }
        />
      </div>
    </div>
  );
};

export default SiteTransferTable;
