/* eslint-disable @typescript-eslint/no-explicit-any */
import { getWasteQueryOptions } from "@/api/query";
import DataTable from "@/components/DataTable";
import Search from "@/components/Search";
import { useStateContext } from "@/context/useStateContext";
import { wasteMenu } from "@/lib/constants";
import { useTableState } from "@/lib/hooks/useTableState";
import { Waste } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
 const columns = [
    { header: "Code", accessor: "waste_number", isFirstColumn: true },
    {
      header: "Warehouse",
      accessor: "warehouse"
    },
    {
      header: "Document date",
      accessor: "docDate",
      render: (item: any) => format(item.document_date, "yyyy-MM-dd"),
    },
   
  ];
const WasteTable = () => {
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
    initialSearchKey: wasteMenu[0].value,
  });

  const {
    data: wasteList,
    isFetching,
    isError,
  } = useQuery(getWasteQueryOptions(search, currentPage, setTotalPage, setError));
  return (
    <div className="max-w-full overflow-hidden h-full space-y-2 bg-white  border border-Primary-15 p-4 rounded-2xl">
      <Search search={search} setSearch={setSearch} menuList={wasteMenu} />
      <div className=" h-[calc(100dvh-17.325rem)]">
        <DataTable
          columns={columns}
          data={wasteList}
          isLoading={isFetching}
          isError={isError}
          currentPage={currentPage}
          totalPages={totalPage}
          onPageChange={handlePageChange}
          onRowClick={(waste: Waste) => navigate(`/rootumex/documents/requests/waste/details/${waste.doc_entry}`)}
        />
      </div>
    </div>
  );
}

export default WasteTable