import { ReactNode } from "react";
import Loading from "./ui/Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquareExclamation } from "@fortawesome/pro-regular-svg-icons";

export interface ApiError extends Error {
  response?: {
    data?: {
      details: string;
    };
    message?: string;
  };
}
type props = {
  isLoading: boolean;
  isError: boolean;
  children: ReactNode;
  error: ApiError | null;
};
const DataRenderer = ({ children, isError, isLoading, error }: props) => {

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
            {error?.message === "Network Error"
              ? "Something went wrong check your connection"
              :  error?.response?.data?.details||error?.message}
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default DataRenderer;
