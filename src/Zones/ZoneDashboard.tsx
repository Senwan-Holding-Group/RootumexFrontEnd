import { useAuth } from "@/api/Auth/useAuth";
import { getZoneDashboardQueryOptions } from "@/api/query";
import DataRenderer from "@/components/DataRenderer";
import {
  faBasketShopping,
  faClock,
  faFlagSwallowtail,
  faSquareExclamation,
  faWarehouseFull,
} from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";

const ZoneDashboard = () => {
  const { user } = useAuth();

  const {
    data: zoneDashBoard,
    isFetching,
    isError,
    error,
  } = useQuery(getZoneDashboardQueryOptions());

  return (
    <div className=" h-[calc(100dvh-12rem)] ">
      <DataRenderer isLoading={isFetching} isError={isError} error={error}>
        <div className="space-y-8 overflow-y-scroll h-full">
          <div className="h-16 border-b border-Primary-5 p-4">
            <h1 className="text-2xl text-RT-Black font-bold leading-CS">
              {user.warehouse_code}
            </h1>
          </div>
          <div className="grid grid-cols-1  gap-x-6 gap-y-8 md:grid-cols-2 xl:grid-cols-3 ">
            <div className="font-bold bg-Primary-5 p-6 rounded-[1.125rem] space-y-6 ">
              <h1 className=" text-lg text-Primary-500 leading-CS">
                Full Zones
              </h1>
              <p className="text-[2.5rem] leading-CS  flex justify-between">
                {zoneDashBoard?.full_zones}
                <span className="rounded-full bg-Primary-50 size-12 flex items-center justify-center">
                  <FontAwesomeIcon
                    className="w-[1.25rem] text-Primary-300 h-[1.063rem]"
                    icon={faSquareExclamation}
                  />
                </span>
              </p>
            </div>
            <div className="font-bold bg-Primary-5 p-6 rounded-[1.125rem] space-y-6">
              <h1 className=" text-lg text-Primary-500  leading-CS">
                Total Zones{" "}
              </h1>
              <p className="text-[2.5rem] leading-CS flex justify-between">
                {zoneDashBoard?.total_zones}
                <span className="rounded-full bg-Primary-50 size-12 flex items-center justify-center">
                  <FontAwesomeIcon
                    className="w-[1.25rem] text-Primary-300 h-[1.063rem]"
                    icon={faWarehouseFull}
                  />
                </span>
              </p>
            </div>
            <div className="font-bold bg-Primary-5 p-6 rounded-[1.125rem] space-y-6">
              <h1 className=" text-lg text-Primary-500 leading-CS">
                Total items
              </h1>
              <p className="text-[2.5rem] leading-CS  flex justify-between">
                {zoneDashBoard?.total_items}
                <span className="rounded-full bg-Primary-50 size-12 flex items-center justify-center">
                  <FontAwesomeIcon
                    className="w-[1.25rem] text-Primary-300 h-[1.063rem]"
                    icon={faBasketShopping}
                  />
                </span>
              </p>
            </div>
            <div className="font-bold bg-Primary-5 p-6 rounded-[1.125rem] space-y-6">
              <h1 className=" text-lg text-Primary-500 leading-CS">
                Idle Zones
              </h1>
              <p className="text-[2.5rem] leading-CS  flex justify-between">
                {zoneDashBoard?.idle_zones}
                <span className="rounded-full bg-Primary-50 size-12 flex items-center justify-center">
                  <FontAwesomeIcon
                    className="w-[1.25rem] text-Primary-300 h-[1.063rem]"
                    icon={faClock}
                  />
                </span>
              </p>
            </div>
            <div className="font-bold bg-Primary-5 p-6 rounded-[1.125rem] space-y-6">
              <h1 className=" text-lg text-Primary-500 leading-CS">
                Flagged Zones
              </h1>
              <p className="text-[2.5rem] leading-CS  flex justify-between">
                {zoneDashBoard?.flagged_zones}
                <span className="rounded-full bg-Primary-50 size-12 flex items-center justify-center">
                  <FontAwesomeIcon
                    className="w-[1.25rem] text-Primary-300 h-[1.063rem]"
                    icon={faFlagSwallowtail}
                  />
                </span>
              </p>
            </div>
          </div>
        </div>
      </DataRenderer>
    </div>
  );
};

export default ZoneDashboard;
