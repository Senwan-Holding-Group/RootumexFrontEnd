import { ReactNode } from "react";
import Loading from "./ui/Loading";
import { useStateContext } from "@/context/useStateContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareExclamation } from "@fortawesome/pro-regular-svg-icons";
type props = {
  isLoading: boolean;
  isError: boolean;
  children: ReactNode;
};

const DataRenderer = ({ children, isError, isLoading }: props) => {
  const { error } = useStateContext();
  if (isLoading) {
    return (
      <div className="flex items-center  h-full  justify-center w-full  ">
        <Loading />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col  items-center justify-center h-full  w-full">
        <div className="text-red-500 h-20 w-20 mb-2  flex items-center justify-center">
          <FontAwesomeIcon className="text-7xl" icon={faSquareExclamation} />
        </div>

        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Something went wrong
          </h3>
          <div className="bg-Error-50 text-Error-500 hover:bg-Error-100  rounded-lg p-4 max-w-md">
            {String(error)}
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default DataRenderer;
