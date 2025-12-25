import DataTable from "@/components/DataTable";
import Search from "@/components/Search";
import { vendorsMenu } from "@/lib/constants";
import { useTableState } from "@/lib/hooks/useTableState";
import { Vendor } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import CreateVendor from "./CreateVendor";
import { getVendorsQueryOptions } from "@/api/query";
const columns = [
  { header: "Code", accessor: "vendorCode", isFirstColumn: true },
  { header: "Name En.", accessor: "vendorNameEng" },
  { header: "Vendor Type", accessor: "vendorType" },
  { header: "Vendor Address", accessor: "vendorAddress", isLastColumn: true },
];
const VendorsTable = () => {
  const navigate = useNavigate();
  const {
    currentPage,
    handlePageChange,
    search,
    setSearch,
    totalPage,
    setTotalPage,
  } = useTableState({
    initialSearchKey: vendorsMenu[0].value,
  });
  const {
    data: vendorList,
    isFetching,
    isError,
    error,
  } = useQuery(getVendorsQueryOptions(search, currentPage, setTotalPage));

  return (
    <div className="max-w-full overflow-hidden h-full space-y-2 bg-white  border border-Primary-15 p-4 rounded-2xl">
      <div className="flex w-full   flex-col sm:flex-row justify-between gap-2 ">
        <Search search={search} setSearch={setSearch} menuList={vendorsMenu} />
        <CreateVendor />
      </div>
      <div className=" sm:h-[calc(100dvh-12rem)] h-[calc(100dvh-15rem)]">
        <DataTable
          columns={columns}
          data={vendorList}
          isLoading={isFetching}
          isError={isError}
          error={error}
          currentPage={currentPage}
          totalPages={totalPage}
          onPageChange={handlePageChange}
          onRowClick={(vendor: Vendor) =>
            navigate(`/rootumex/vendors/details/${vendor.vendorCode}`)
          }
        />
      </div>
    </div>
  );
};

export default VendorsTable;
