import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faAngleDown,
  faMagnifyingGlass,
} from "@fortawesome/pro-regular-svg-icons";

import { Input } from "./ui/input";
import { MenuList } from "@/lib/types";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
type searchProps = {
  menuList: MenuList[];
  search: { searchKey: string; searchValue: string };
  setSearch: React.Dispatch<
    React.SetStateAction<{
      searchKey: string;
      searchValue: string;
    }>
  >;
};
const Search = ({ menuList, setSearch, search }: searchProps) => {
  return (
    <div className=" max-w-3xl sm:w-[21.188rem] h-10 flex items-center  px-2 gap-x-1 border border-Secondary-500 rounded-2xl">
      <span className="size-9 flex items-center justify-center">
        <FontAwesomeIcon
          className="h-5 w-5 text-Primary-400"
          icon={faMagnifyingGlass}
        />
      </span>
      <Input
        defaultValue={search.searchValue}
        onKeyDown={(e) => {
          // if (!e.currentTarget.value.trim()) return;
          if (e.key === "Enter")
            setSearch({ ...search, searchValue: e.currentTarget.value });
        }}
        placeholder="Search"
        className="border-0 px-0 flex-1 leading-[22.4px]  bg-transparent"
      />
      <span className="text-Primary-500  font-medium text-base leading-CS">
        By {menuList.find((item) => item.value === search.searchKey)?.label}
      </span>

      <DropdownMenu>
        <DropdownMenuTrigger className="outline-none ">
          <span className="size-6  flex items-center justify-center">
            <FontAwesomeIcon
              className="h-[1rem] w-[0.875rem] text-Primary-400 cursor-pointer"
              icon={faAngleDown}
            />
          </span>
        </DropdownMenuTrigger>
        <DropdownMenuContent className=" mt-3 rounded-xl border border-geantSap-gray-25">
          {menuList.map((item) => (
            <DropdownMenuItem
              onClick={() => {
                setSearch({ ...search, searchKey: item.value });
              }}
              key={item.value}
              className="border-b last:border-b-0 font-normal hover:bg-geantSap-gray-25 text-base leading-[22.4px] text-geantSap-black border-geantSap-gray-100 cursor-pointer"
            >
              {item.label}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Search;
