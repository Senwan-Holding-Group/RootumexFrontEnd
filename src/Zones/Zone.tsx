import { Input } from "@/components/ui/input";
import { faMagnifyingGlass } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const Zone = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handleSearch = (value: string) => {
    if (!value.trim()) return;
    setSearch(value);
    navigate(`/rootumex/zones/details/${value}`);
  };
  return (
    <div className="space-y-2  w-full ">
      <h1 className="ml-2 w-full text-Gray-500 font-bold text-lg leading-CS ">
        Zones
      </h1>
      <div className="max-w-full overflow-hidden h-full space-y-2 bg-white  border border-Primary-15 p-4 rounded-2xl">
        <div className=" max-w-3xl sm:w-[30rem] h-10 flex items-center  px-2 gap-x-1 border border-Secondary-500 rounded-2xl">
          <span className="size-9 flex items-center justify-center">
            <FontAwesomeIcon
              className="h-5 w-5 text-Primary-400"
              icon={faMagnifyingGlass}
            />
          </span>
          <Input
            defaultValue={search}
            onChange={(e) => {
              if (e.currentTarget.value.trim() === "") {
                setSearch("");
                navigate("/rootumex/zones");
              }
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSearch(e.currentTarget.value);
            }}
            placeholder="Search"
            className="border-0 px-0 flex-1 leading-[22.4px]  bg-transparent"
          />
        </div>
        <Outlet context={{ search }} />
      </div>
    </div>
  );
};

export default Zone;
