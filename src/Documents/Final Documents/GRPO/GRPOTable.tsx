/* eslint-disable @typescript-eslint/no-explicit-any */
import { getGRPO } from "@/api/client";
import DataTable from "@/components/DataTable";
import Search from "@/components/Search";
import StatusBadge from "@/components/StatusBadge";
import { useStateContext } from "@/context/useStateContext";
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
      render: (grpo:PO) => <StatusBadge status={grpo.status} />,
    },
    { header: "Vendor", accessor: "vendorName" },
    { header: "Document date", accessor: "docDate" },
    {
      header: "Total amount",
      accessor: "total",
      render: (grpo:PO) => numberWithCommas(grpo.total),
      isLastColumn: true,
    },
  ];
const GRPOTable = () => {
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
    initialSearchKey: grpoMenu[0].value,
  });
  const {
    data: grpoList,
    isFetching,
    isError,
  } = useQuery({
    queryKey: ["grpoList", search.searchValue, currentPage],
    queryFn: () => {
      const searchParam = search.searchValue
        ? `${search.searchKey}=${search.searchValue}&`
        : "";
      return getGRPO(
        `/GRPO?${searchParam}limit=15&page=${currentPage}`,
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
          menuList={grpoMenu}
        />
      </div>
      <div className=" h-[calc(100dvh-17.325rem)]">
        <DataTable
          columns={columns}
          data={grpoList}
          isLoading={isFetching}
          isError={isError}
          currentPage={currentPage}
          totalPages={totalPage}
          onPageChange={handlePageChange}
          onRowClick={(grpo:PO) =>
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
