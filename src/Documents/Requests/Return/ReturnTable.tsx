import Search from "@/components/Search";
import { useStateContext } from "@/context/useStateContext";
import { purschaseMenu } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateReturn from "./CreateReturn";
import { getReturnRequest } from "@/api/client";
import DataRenderer from "@/components/DataRenderer";
import StatusBadge from "@/components/StatusBadge";
import Pagination from "@/components/Pagination";
import { numberWithCommas } from "@/lib/utils";
import { format } from "date-fns";

const ReturnTable = () => {
  const { setError, setTotalPage, totalPage } = useStateContext();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const [search, setSearch] = useState({
    searchKey: purschaseMenu[0].value,
    searchValue: "",
  });
  const {
    data: returnList,
    isFetching,
    isError,
  } = useQuery({
    queryKey: ["returnList", search.searchValue, currentPage],
    queryFn: () =>
      getReturnRequest(
        `/return_request?${search.searchKey}=${search.searchValue}&limit=15&page=${currentPage}`,
        setError,
        setTotalPage
      ),
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
  return (
    <div className="max-w-full overflow-hidden h-full space-y-2  bg-white  border border-Primary-15  p-4 rounded-2xl">
      <div className="flex w-full   flex-col sm:flex-row justify-between gap-2 ">
        <Search
          search={search}
          setSearch={setSearch}
          menuList={purschaseMenu}
        />
        <CreateReturn />{" "}
      </div>
      <div className=" sm:h-[calc(100dvh-17.325rem)] h-[calc(100dvh-20.313rem)]  border-2  border-Primary-5 rounded-2xl block overflow-scroll">
        <DataRenderer isLoading={isFetching} isError={isError}>
          <table className="w-full  caption-bottom ">
            <thead className="sticky top-0 w-full bg-Primary-5">
              <tr className="text-nowrap font-semibold  text-base/CS   text-left text-Primary-400">
                <th className="pr-6 pl-4 py-3  rounded-tl-xl">Code</th>
                <th className="pr-6 pl-4 py-3">Status</th>
                <th className="pr-6 pl-4 py-3">Vendor</th>
                <th className="pr-6 pl-4 py-3">Document date</th>
                <th className="pr-6 pl-4 py-3">Delivery date</th>
                <th className="pr-6 pl-4 py-3 rounded-tr-xl">Total amount </th>
              </tr>
            </thead>
            <tbody className=" [&_tr:last-child]:border-0 ">
              {!returnList?.length ? (
                <tr className="p-6">
                  <td colSpan={6} className="text-center ">
                    No data found
                  </td>
                </tr>
              ) : (
                returnList.map((returnLine) => (
                  <tr
                    onClick={() =>
                      navigate(
                        `/rootumex/documents/requests/return/details/${returnLine.docEntry}`
                      )
                    }
                    className="text-RT-Black  text-nowrap font-medium text-base/CS border-b-1 border-Primary-15 transition duration-300 ease-in-out hover:bg-gray-100 cursor-pointer">
                    <td className="pr-6 pl-4 py-3">{returnLine.code}</td>
                    <td className="pr-6 pl-4 py-3">
                      <StatusBadge status={returnLine.status} />
                    </td>
                    <td className="pr-6 pl-4 py-3">{returnLine.vendorName}</td>
                    <td className="pr-6 pl-4 py-3">{format(returnLine.docDate, "yyyy-MM-dd")}</td>
                    <td className="pr-6 pl-4 py-3">{format(returnLine.docDueDate, "yyyy-MM-dd")}</td>
                    <td className="pr-6 pl-4 py-3">
                      {numberWithCommas(returnLine.total)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot className="sticky -bottom-0 ">
              <tr>
                <td colSpan={6}>
                  <Pagination
                    totalPages={totalPage}
                    currentPage={currentPage}
                    onPageChange={handlePageChange}
                  />
                </td>
              </tr>
            </tfoot>
          </table>
        </DataRenderer>
      </div>
    </div>
  );
};

export default ReturnTable;
