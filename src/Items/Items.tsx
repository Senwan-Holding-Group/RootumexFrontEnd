import { Outlet, useOutletContext } from "react-router-dom";

const Items = () => {
  return (
    <div className=" space-y-2  w-full ">
      <h1 className="ml-2 w-full  text-Gray-500 font-bold text-lg leading-CS ">
        Items Master Data
      </h1>
      <Outlet context={useOutletContext()} />
    </div>
  );
};

export default Items;
