import { getVendors } from "@/api/client";
import DataRenderer from "@/components/DataRenderer";
import Pagination from "@/components/Pagination";
import Search from "@/components/Search";
import { useStateContext } from "@/context/useStateContext";
import { vendorsMenu } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const VendorsTable = () => {
  const { setError, setTotalPage, totalPage } = useStateContext();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const [search, setSearch] = useState({
    searchKey: vendorsMenu[0].value,
    searchValue: "",
  });
  const {
    data: vendorList,
    isFetching,
    isError,
  } = useQuery({
    queryKey: ["vendorList", search, currentPage],
    queryFn: () =>
      getVendors(
        `/vendor?${search.searchKey}=${search.searchValue}&perPage=15&page=${currentPage}`,
        setError,
        setTotalPage
      ),
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
  return (
    <div className="max-w-full overflow-hidden h-full space-y-2 bg-white  border border-Primary-15 p-4 rounded-2xl">
      <Search search={search} setSearch={setSearch} menuList={vendorsMenu} />
      <div className=" h-[calc(100dvh-12rem)] border-2  border-Primary-5 rounded-2xl block overflow-scroll">
        <DataRenderer isLoading={isFetching} isError={isError}>
          <table className="w-full  caption-bottom ">
            <thead className="sticky top-0 w-full bg-Primary-5">
              <tr className="text-nowrap font-semibold  text-base/CS   text-left text-Primary-400">
                <th className="pr-6 pl-4 py-3   rounded-tl-xl">Code</th>
                <th className="pr-6 pl-4 py-3">Name En.</th>
                <th className="pr-6 pl-4 py-3">Vendor Type</th>
                <th className="pr-6 pl-4 py-3 rounded-tr-xl">Vendor Address</th>
              </tr>
            </thead>
            <tbody className=" [&_tr:last-child]:border-0 ">
              {!vendorList?.length ? (
                <tr className="p-6">
                  <td colSpan={4} className="text-center ">
                    No data found
                  </td>
                </tr>
              ) : (
                vendorList.map((vendor) => (
                  <tr
                    onClick={() => navigate(`/rootumex/vendors/details/158745`)}
                    className="text-RT-Black  text-nowrap  font-medium text-base/CS border-b-1 border-Primary-15 transition duration-300 ease-in-out hover:bg-gray-100 cursor-pointer">
                    <td className="pr-6 pl-4 py-3">{vendor.vendorCode}</td>
                    <td className="pr-6 pl-4 py-3">{vendor.vendorName}</td>
                    <td className="pr-6 pl-4 py-3">{vendor.vendorType}</td>
                    <td className="pr-6 pl-4 py-3">{vendor.vendorAddress}</td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot className="sticky -bottom-0 w-full">
              <tr>
                <td colSpan={4}>
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

export default VendorsTable;
