import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { itemsMenu } from "@/lib/constants";
import { useState } from "react";
import { Docline, Item } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import { useStateContext } from "@/context/useStateContext";
import DataRenderer from "./DataRenderer";
import { getItemsMasterData } from "@/api/client";
import Search from "./Search";
import { faGrid2Plus } from "@fortawesome/pro-regular-svg-icons";

type ItemSelectProps = {
  state: Docline[];
  setState: React.Dispatch<React.SetStateAction<Docline[]>>;
};

const ItemSelect = ({ setState, state }: ItemSelectProps) => {
  const { setError } = useStateContext();

  const [search, setSearch] = useState({
    searchKey: itemsMenu[0].value,
    searchValue: "",
  });
  const handleItemClick = (item: Item) => {
    const existingItemIndex = state.findIndex(
      (value) => String(value.itemCode) === item.itemCode && value.status === "O"
    );

    if (existingItemIndex !== -1) {
      setState((prev) => {
        const newState = [...prev];
        newState[existingItemIndex] = {
          ...newState[existingItemIndex],
          quantity: newState[existingItemIndex].quantity + 1,
          total_price:
            (newState[existingItemIndex].quantity + 1) *
            newState[existingItemIndex].price,
        };
        return newState;
      });
    } else {
      setState((prev) => [
        ...prev,
        {
          itemDescription: item.itemDescription,
          description: item.itemDescription,
          itemCode: item.itemCode,
          barcode: item.barcode,
          name: item.itemName,
          uom: item.uom,
          uomCode: item.uom,
          total_price: item.price,
          recieved_quantity: 0,
          quantity: 1,
          status: "O",
          price: item.price,
          line: Math.random(),
        },
      ]);
    }
  };
  const {
    data: itemSelectList,
    isFetching,
    isError,
  } = useQuery({
    queryKey: ["itemSelectList", search],
    queryFn: () => {
      const searchParam = search.searchValue
        ? `?${search.searchKey}=${search.searchValue}`
        : "";
     return getItemsMasterData(`/item${searchParam}`, setError);
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size={"icon"}
          className=" flex items-center justify-start bg-transparent ">
          <FontAwesomeIcon className="text-Primary-500" icon={faGrid2Plus} />
          <span className="text-Primary-500 font- leading-CS text-base ">
            Select Item
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent
        aria-describedby={undefined}
        className="h-[30rem] flex flex-col  justify-between max-w-md sm:max-w-[40rem]">
        <DialogHeader className="border-b px-6 py-4 border-Primary-15  md:h-[4.5rem] h-[6rem]">
          <DialogTitle className=" flex md:flex-row flex-col  justify-between items-center gap-2 pr-4">
            <span className="text-2xl leading-CS font-bold text-Primary-500">
              Select Items
            </span>

            <Search
              menuList={itemsMenu}
              search={search}
              setSearch={setSearch}
            />
          </DialogTitle>
        </DialogHeader>
        <div className=" px-2 mb- h-[17rem] w-full ">
          <div className="border w-full overflow-scroll h-full  border-Secondary-500 rounded-lg">
            <DataRenderer isLoading={isFetching} isError={isError}>
              <table className="w-full ">
                <thead className="bg-Primary-15">
                  <tr className="text-nowrap   text-base  text-left font-bold text-Primary-500">
                    <th className="px-6 py-3 rounded-tl-lg ">Code</th>
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3 rounded-tr-lg">Barcode</th>
                  </tr>
                </thead>
                <tbody className=" [&_tr:last-child]:border-0">
                  {itemSelectList?.map((item) => (
                    <tr
                      key={item.itemCode}
                      onClick={() => handleItemClick(item)}
                      className={`text-RT-Black font-normal text-base border-b border-Primary-15  cursor-pointer ${
                        state.find(
                          (value) => String(value.itemCode) === item.itemCode
                        ) && "bg-Primary-5"
                      }`}>
                      <td className="px-6 py-3">{item.itemCode}</td>
                      <td className="px-6 py-3">{item.itemName}</td>
                      <td className="px-6 py-3">{item.barcode}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </DataRenderer>
          </div>
        </div>
        <DialogFooter className="rounded-bl-lg p-6  rounded-br-lg  border-t flex flex-row gap-4 h-[5.5rem] border-Primary-15">
          <DialogClose asChild>
            <Button
              className="bg-white w-[11.25rem] border rounded-2xl text-Primary-600 font-medium text-base"
              type="button">
              Close
            </Button>
          </DialogClose>
          <DialogClose asChild>
            <Button
              className="bg-Primary-500 w-[11.25rem] rounded-2xl font-medium text-base"
              type="button">
              Confirm
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ItemSelect;
