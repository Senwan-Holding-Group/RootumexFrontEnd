import DataRenderer from "@/components/DataRenderer";
import Pagination from "@/components/Pagination";
import Search from "@/components/Search";
import StatusBadge from "@/components/StatusBadge";
// import { useStateContext } from "@/context/useStateContext";
import {  stockMenu } from "@/lib/constants";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
const StockCountTable = () => {
  // const { setError, setTotalPage, totalPage } = useStateContext();
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  const [search, setSearch] = useState({
    searchKey: stockMenu[0].value,
    searchValue: "",
  });
  return (
    <div className="max-w-full overflow-hidden h-full space-y-2  bg-white  drop-shadow-2xl drop-shadow-[#8D8D8E24] p-4 rounded-2xl">
      <Search search={search} setSearch={setSearch} menuList={stockMenu} />
      <div className=" h-[calc(100dvh-11.875rem)] border-2  border-Primary-5 rounded-2xl block overflow-scroll">
        <DataRenderer isLoading={false} isError={false}>
          <table className="w-full  caption-bottom ">
            <thead className="sticky top-0 w-full bg-Primary-5">
              <tr className="text-nowrap font-semibold  text-base/CS   text-left text-Primary-400">
                <th className="pr-6 pl-4 py-3  rounded-tl-xl">Code</th>
                <th className="pr-6 pl-4 py-3">Warehouse</th>
                <th className="pr-6 pl-4 py-3">Status</th>
                <th className="pr-6 pl-4 py-3">Document date</th>

                <th className="pr-6 pl-4 py-3 rounded-tr-xl">
                  View stock count
                </th>
              </tr>
            </thead>
            <tbody className=" [&_tr:last-child]:border-0 ">
              <tr
                onClick={() => navigate(`/rootumex/stock-count/details/158745`)}
                className="text-RT-Black  text-nowrap font-medium text-base/CS border-b-1 border-Primary-15 transition duration-300 ease-in-out hover:bg-gray-100 cursor-pointer">
                <td className="pr-6 pl-4 py-3">11254</td>
                <td className="pr-6 pl-4 py-3">11254</td>
                <td className="pr-6 pl-4 py-3">
                  <StatusBadge status="active" />
                </td>
                <td className="pr-6 pl-4 py-3">11254</td>
                <td className="pr-6 pl-4 py-3">11254</td>
              </tr>
              <tr
                onClick={() => navigate(`/rootumex/stock-count/details/158745`)}
                className="text-RT-Black  text-nowrap font-medium text-base/CS border-b-1 border-Primary-15 transition duration-300 ease-in-out hover:bg-gray-100 cursor-pointer">
                <td className="pr-6 pl-4 py-3">11254</td>
                <td className="pr-6 pl-4 py-3">11254</td>
                <td className="pr-6 pl-4 py-3">
                  <StatusBadge status="active" />
                </td>
                <td className="pr-6 pl-4 py-3">11254</td>
                <td className="pr-6 pl-4 py-3">11254</td>
              </tr>
              <tr
                onClick={() => navigate(`/rootumex/stock-count/details/158745`)}
                className="text-RT-Black  text-nowrap font-medium text-base/CS border-b-1 border-Primary-15 transition duration-300 ease-in-out hover:bg-gray-100 cursor-pointer">
                <td className="pr-6 pl-4 py-3">11254</td>
                <td className="pr-6 pl-4 py-3">11254</td>
                <td className="pr-6 pl-4 py-3">
                  <StatusBadge status="active" />
                </td>
                <td className="pr-6 pl-4 py-3">11254</td>
                <td className="pr-6 pl-4 py-3">11254</td>
              </tr>
              <tr
                onClick={() => navigate(`/rootumex/stock-count/details/158745`)}
                className="text-RT-Black  text-nowrap font-medium text-base/CS border-b-1 border-Primary-15 transition duration-300 ease-in-out hover:bg-gray-100 cursor-pointer">
                <td className="pr-6 pl-4 py-3">11254</td>
                <td className="pr-6 pl-4 py-3">11254</td>
                <td className="pr-6 pl-4 py-3">
                  <StatusBadge status="active" />
                </td>
                <td className="pr-6 pl-4 py-3">11254</td>
                <td className="pr-6 pl-4 py-3">11254</td>
              </tr>
              <tr
                onClick={() => navigate(`/rootumex/stock-count/details/158745`)}
                className="text-RT-Black  text-nowrap font-medium text-base/CS border-b-1 border-Primary-15 transition duration-300 ease-in-out hover:bg-gray-100 cursor-pointer">
                <td className="pr-6 pl-4 py-3">11254</td>
                <td className="pr-6 pl-4 py-3">11254</td>
                <td className="pr-6 pl-4 py-3">
                  <StatusBadge status="active" />
                </td>
                <td className="pr-6 pl-4 py-3">11254</td>
                <td className="pr-6 pl-4 py-3">11254</td>
              </tr>
            </tbody>
            <tfoot className="sticky -bottom-0 w-full">
              <tr>
                <td colSpan={5}>
                  <Pagination
                    totalPages={10}
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

export default StockCountTable;
