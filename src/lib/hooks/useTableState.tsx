import { useState } from "react";

type UseTableStateProps = {
  initialSearchKey: string;
};
export type TSearch = {
  searchKey: string;
  searchValue: string;
};
export function useTableState({ initialSearchKey }: UseTableStateProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPage, setTotalPage] = useState<number>(0);
  const [search, setSearch] = useState<TSearch>({
    searchKey: initialSearchKey,
    searchValue: "",
  });
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };
  return {
    currentPage,
    setCurrentPage,
    handlePageChange,
    totalPage,
    setTotalPage,
    search,
    setSearch,
  };
}
