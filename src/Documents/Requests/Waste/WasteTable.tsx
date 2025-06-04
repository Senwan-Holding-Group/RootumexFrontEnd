import { getWaste } from "@/api/client";
import DataRenderer from "@/components/DataRenderer";
import Pagination from "@/components/Pagination";
import Search from "@/components/Search";
import { useStateContext } from "@/context/useStateContext";
import { wasteMenu } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const WasteTable = () => {
 const { setError, setTotalPage, totalPage } = useStateContext();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const [search, setSearch] = useState({
    searchKey: wasteMenu[0].value,
    searchValue: "",
  });
  const {
    data: wasteList,
    isFetching,
    isError,
  } = useQuery({
    queryKey: ["wasteList", search, currentPage],
    queryFn: () =>
      getWaste(
        `/waste?${search.searchKey}=${search.searchValue}&perPage=15&page=${currentPage}`,
        setError,
        setTotalPage
      ),
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
  return (
    <div className="max-w-full overflow-hidden h-full space-y-2 bg-white  border border-Primary-15 p-4 rounded-2xl">
      <Search search={search} setSearch={setSearch} menuList={wasteMenu} />
      <div className=" h-[calc(100dvh-17.325rem)] border-2  border-Primary-5 rounded-2xl block overflow-scroll">
        <DataRenderer isLoading={isFetching} isError={isError}>
          <table className="w-full  caption-bottom ">
            <thead className="sticky top-0 w-full bg-Primary-5">
              <tr className="text-nowrap font-semibold  text-base/CS   text-left text-Primary-400">
                <th className="pr-6 pl-4 py-3   rounded-tl-xl">Code</th>
                <th className="pr-6 pl-4 py-3">Warehouse</th>
                <th className="pr-6 pl-4 py-3 rounded-tr-xl">Document Date</th>
              </tr>
            </thead>
            <tbody className=" [&_tr:last-child]:border-0 ">
              {!wasteList?.length ? (
                <tr className="p-6">
                  <td colSpan={3} className="text-center ">
                    No data found
                  </td>
                </tr>
              ) : (
                wasteList.map((waste) => (
                  <tr
                    onClick={() => navigate(`/rootumex/documents/requests/waste/details/${waste.doc_entry}`)}
                    className="text-RT-Black  text-nowrap  font-medium text-base/CS border-b-1 border-Primary-15 transition duration-300 ease-in-out hover:bg-gray-100 cursor-pointer">
                    <td className="pr-6 pl-4 py-3">{waste.waste_number}</td>
                    <td className="pr-6 pl-4 py-3">{waste.warehouse}</td>
                    <td className="pr-6 pl-4 py-3">{format(waste.document_date, "yyyy-MM-dd")}</td>

                  </tr>
                ))
              )}
            </tbody>
            <tfoot className="sticky bottom-0 w-full">
              <tr>
                <td colSpan={3}>
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
}

export default WasteTable