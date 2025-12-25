import { getGRPOueryOptions } from "@/api/query";
import DataTable from "@/components/DataTable";
import Search from "@/components/Search";
import StatusBadge from "@/components/StatusBadge";
import { grpoMenu } from "@/lib/constants";
import { useTableState } from "@/lib/hooks/useTableState";
import { PO } from "@/lib/types";
import { numberWithCommas } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
const columns = [
  { header: "Code", accessor: "code", isFirstColumn: true },
  {
    header: "Status",
    accessor: "status",
    render: (grpo: PO) => <StatusBadge status={grpo.status} />,
  },
  { header: "Vendor", accessor: "vendorName" },
  { header: "Document date", accessor: "docDate" },
  {
    header: "Total amount",
    accessor: "total",
    render: (grpo: PO) => numberWithCommas(grpo.total),
    isLastColumn: true,
  },
];
const GRPOTable = () => {
  const navigate = useNavigate();

  const {
    currentPage,
    handlePageChange,
    search,
    setSearch,
    totalPage,
    setTotalPage,
  } = useTableState({
    initialSearchKey: grpoMenu[0].value,
  });
  const {
    data: grpoList,
    isFetching,
    isError,
    error
  } = useQuery(getGRPOueryOptions(search, currentPage, setTotalPage));

  return (
    <div className="max-w-full overflow-hidden h-full space-y-2  bg-white  border border-Primary-15  p-4 rounded-2xl">
      <div className="flex w-full   flex-col sm:flex-row justify-between gap-2 ">
        <Search search={search} setSearch={setSearch} menuList={grpoMenu} />
      </div>
      <div className=" h-[calc(100dvh-17.325rem)]">
        <DataTable
          columns={columns}
          data={grpoList}
          isLoading={isFetching}
          isError={isError}
          error={error}
          currentPage={currentPage}
          totalPages={totalPage}
          onPageChange={handlePageChange}
          onRowClick={(grpo: PO) =>
            navigate(
              `/rootumex/documents/final-docs/grpo/details/${grpo.docEntry}`
            )
          }
        />
      </div>
    </div>
  );
};

export default GRPOTable;
