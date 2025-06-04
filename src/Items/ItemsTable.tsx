import { getItemsMasterData } from "@/api/client";
import DataRenderer from "@/components/DataRenderer";
import Pagination from "@/components/Pagination";
import Search from "@/components/Search";
import StatusBadge from "@/components/StatusBadge";
import { useStateContext } from "@/context/useStateContext";
import { itemsMenu } from "@/lib/constants";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import CreateItem from "./CreateItem";

const ItemsTable = () => {
  const { setError, setTotalPage, totalPage } = useStateContext();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const [search, setSearch] = useState({
    searchKey: itemsMenu[0].value,
    searchValue: "",
  });
  const {
    data: itemList,
    isFetching,
    isError,
  } = useQuery({
    queryKey: ["itemList", search, currentPage],
    queryFn: () =>
      getItemsMasterData(
        `/item?${search.searchKey}=${search.searchValue}&limit=15&page=${currentPage}`,
        setError,
        setTotalPage
      ),
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
  return (
    <div className="max-w-full overflow-hidden h-full space-y-2  bg-white border border-Primary-15  p-4 rounded-2xl">
      <div className="flex w-full   flex-col sm:flex-row justify-between gap-2 ">
        <Search search={search} setSearch={setSearch} menuList={itemsMenu} />
        <CreateItem />
      </div>
      <div className="sm:h-[calc(100dvh-12rem)] h-[calc(100dvh-15rem)] border-2  border-Primary-5 rounded-2xl block overflow-scroll">
        <DataRenderer isLoading={isFetching} isError={isError}>
          <table className="w-full  caption-bottom ">
            <thead className="sticky top-0 w-full bg-Primary-5">
              <tr className="text-nowrap font-semibold  text-base/CS   text-left text-Primary-400">
                <th className="pr-6 pl-4 py-3  rounded-tl-xl">Code</th>
                <th className="pr-6 pl-4 py-3">Status</th>
                <th className="pr-6 pl-4 py-3">Name En.</th>
                <th className="pr-6 pl-4 py-3">Department</th>
                <th className="pr-6 pl-4 py-3">UoM</th>
                <th className="pr-6 pl-4 py-3 rounded-tr-xl">Barcode</th>
              </tr>
            </thead>
            <tbody className=" [&_tr:last-child]:border-0 ">
              {!itemList?.length ? (
                <tr className="p-6">
                  <td colSpan={6} className="text-center ">
                    No data found
                  </td>
                </tr>
              ) : (
                itemList.map((item) => (
                  <tr
                    onClick={() =>
                      navigate(`/rootumex/items/details/${item.itemCode}`)
                    }
                    className="text-RT-Black  text-nowrap  font-medium text-base/CS border-b-1 border-Primary-15 transition duration-300 ease-in-out hover:bg-gray-100 cursor-pointer">
                    <td className="pr-6 pl-4 py-3">{item.itemCode}</td>
                    <td className="pr-6 pl-4 py-3">
                      <StatusBadge
                        status={item.status === true ? "Active" : "Inactive"}
                      />
                    </td>
                    <td className="pr-6 pl-4 py-3">{item.itemName}</td>
                    {/* <td className="pr-6 pl-4 py-3">{item.itemDescription}</td> */}
                    <td className="pr-6 pl-4 py-3">{item.department}</td>
                    <td className="pr-6 pl-4 py-3">{item.uom}</td>
                    <td className="pr-6 pl-4 py-3">{item.barcode}</td>
                  </tr>
                ))
              )}
            </tbody>
            <tfoot className="sticky -bottom-0 w-full">
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

export default ItemsTable;
