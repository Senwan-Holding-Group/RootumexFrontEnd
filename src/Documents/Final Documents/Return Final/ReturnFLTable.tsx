import { getReturnFL } from "@/api/client";
import DataTable from "@/components/DataTable";
import Search from "@/components/Search";
import StatusBadge from "@/components/StatusBadge";
import { useStateContext } from "@/context/useStateContext";
import { returnMenu } from "@/lib/constants";
import { useTableState } from "@/lib/hooks/useTableState";
import { Return } from "@/lib/types";
import { numberWithCommas } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
 const columns = [
    { header: "Code", accessor: "code", isFirstColumn: true },
    {
      header: "Status",
      accessor: "status",
      render: (item: Return) => <StatusBadge status={item.status} />,
    },
    { header: "Vendor", accessor: "vendorName" },
    {
      header: "Document date",
      accessor: "docDate",
      render: (item: Return) => format(item.docDate, "yyyy-MM-dd"),
    },
    {
      header: "Delivery date",
      accessor: "docDueDate",
      render: (item: Return) => format(item.docDueDate, "yyyy-MM-dd"),
    },
    {
      header: "Total amount",
      accessor: "total",
      render: (item: Return) => numberWithCommas(item.total),
      isLastColumn: true,
    },
  ];
const ReturnFLTable = () => {
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
    initialSearchKey: returnMenu[0].value,
  });
  const {
    data: returnListFL,
    isFetching,
    isError,
  } = useQuery({
    queryKey: ["returnListFL", search.searchValue, currentPage],
    queryFn: () =>{
      const searchParam = search.searchValue
        ? `${search.searchKey}=${search.searchValue}&`
        : "";
      return getReturnFL(
        `/return?${searchParam}limit=15&page=${currentPage}`,
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
          menuList={returnMenu}
        />
      </div>
      <div className=" h-[calc(100dvh-17.325rem)] ">
        <DataTable
          columns={columns}
          data={returnListFL}
          isLoading={isFetching}
          isError={isError}
          currentPage={currentPage}
          totalPages={totalPage}
          onPageChange={handlePageChange}
          onRowClick={(returnR:Return) =>
            navigate(
              `/rootumex/documents/final-docs/return-final/details/${returnR.docEntry}`
            )
          }
        />
      </div>
    </div>
  );
};

export default ReturnFLTable;
