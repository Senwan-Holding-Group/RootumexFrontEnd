import { Outlet } from "react-router-dom"

const StockCount = () => {
  return (
    <div className=" space-y-2  w-full ">
          <h1 className="ml-2 w-full  text-Gray-500 font-bold text-lg leading-CS ">
            Stock Count
          </h1>
            <Outlet/>
        </div>
  )
}

export default StockCount