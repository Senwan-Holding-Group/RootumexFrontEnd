/* eslint-disable @typescript-eslint/no-explicit-any */
import Search from "@/components/Search";
import { useStateContext } from "@/context/useStateContext";
import {  returnRequestMenu } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import CreateReturn from "./CreateReturn";
import { getReturnRequest } from "@/api/client";
import StatusBadge from "@/components/StatusBadge";
import { numberWithCommas } from "@/lib/utils";
import { format } from "date-fns";
import { useTableState } from "@/lib/hooks/useTableState";
import DataTable from "@/components/DataTable";
import { Return } from "@/lib/types";
const columns = [
  { header: "Code", accessor: "code", isFirstColumn: true },
  {
    header: "Status",
    accessor: "status",
    render: (item: any) => <StatusBadge status={item.status} />,
  },
  { header: "Vendor", accessor: "vendorName" },
  {
    header: "Document date",
    accessor: "docDate",
    render: (item: any) => format(item.docDate, "yyyy-MM-dd"),
  },
  {
    header: "Delivery date",
    accessor: "docDueDate",
    render: (item: any) => format(item.docDueDate, "yyyy-MM-dd"),
  },
  {
    header: "Total amount",
    accessor: "total",
    render: (item: any) => numberWithCommas(item.total),
    isLastColumn: true,
  },
];
const ReturnTable = () => {
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
    initialSearchKey: returnRequestMenu[0].value,
  });
  const {
    data: returnList,
    isFetching,
    isError,
  } = useQuery({
    queryKey: ["returnList", search.searchValue, currentPage],
    queryFn: () => {
      const searchParam = search.searchValue
        ? `${search.searchKey}=${search.searchValue}&`
        : "";
      return getReturnRequest(
        `/return_request?${searchParam}&limit=15&page=${currentPage}`,
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
          menuList={returnRequestMenu}
        />
        <CreateReturn />
      </div>
      <div className=" sm:h-[calc(100dvh-17.325rem)] h-[calc(100dvh-20.313rem)] ">
        <DataTable
          columns={columns}
          data={returnList}
          isLoading={isFetching}
          isError={isError}
          currentPage={currentPage}
          totalPages={totalPage}
          onPageChange={handlePageChange}
          onRowClick={(returnItem: Return) =>
            navigate(
              `/rootumex/documents/requests/return/details/${returnItem.docEntry}`
            )
          }
        />
      </div>
    </div>
  );
};

export default ReturnTable;
