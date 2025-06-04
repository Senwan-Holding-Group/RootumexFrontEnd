
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Button } from "./ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/pro-regular-svg-icons";
import { useState } from "react";

type childrenProps = {
  children: React.ReactNode;
};

const NavMenu = ({ children }: childrenProps) => {
  const [open, setOpen] = useState(false);
  

  
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button className=" w-8 h-8 bg-white flex lg:hidden border-[0.05rem] drop-shadow-[#8D8D8E40] hover:cursor-pointer p-[0.4rem] rounded-[0.7rem] border-Secondary-500    items-center justify-center cursor-pointer  ">
          <FontAwesomeIcon className="size-6 text-Primary-500" icon={faBars} />
        </Button>
      </PopoverTrigger>
      <PopoverContent  className="w-36 absolute  -right-4 top-4 rounded-2xl p-2 lg:hidden ">
        <div onClick={() => setOpen(false)}>
          {children}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default NavMenu;
