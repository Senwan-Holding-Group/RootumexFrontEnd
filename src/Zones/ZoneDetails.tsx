import { useAuth } from "@/api/Auth/useAuth";
import DataRenderer from "@/components/DataRenderer";
import { ZoneItem } from "@/lib/types";
import {
  faChevronDown,
  faChevronLeft,
} from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Link, useOutletContext, useParams } from "react-router-dom";
import ZoneItemCard from "./ZoneItemCard";
import { getZoneItemsQueryOptions } from "@/api/query";

const ZoneDetails = () => {
  const { zoneId } = useParams();
  const { user } = useAuth();
  const { search } = useOutletContext<{ search: string }>();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    {}
  );

  const toggleExpand = (zoneCode: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [zoneCode]: !prev[zoneCode],
    }));
    console.log(expandedItems);
  };
  const {
    data: zoneItems,
    isFetching,
    isError,
    error,
  } = useQuery(getZoneItemsQueryOptions(zoneId, search));

  const groupItemsByZone = () => {
    if (!zoneItems || zoneItems.length === 0) return [];

    const groupedItems: Record<string, ZoneItem[]> = {};

    zoneItems.forEach((item) => {
      if (!groupedItems[item.zone_code]) {
        groupedItems[item.zone_code] = [];
      }
      groupedItems[item.zone_code].push(item);
    });

    return Object.entries(groupedItems);
  };

  useEffect(() => {
    if (zoneItems && zoneItems.length > 0) {
      const initialExpandedState: Record<string, boolean> = {};

      const uniqueZoneCodes = [
        ...new Set(zoneItems.map((item) => item.zone_code)),
      ];

      uniqueZoneCodes.forEach((zoneCode, index) => {
        initialExpandedState[`zone_${zoneCode}_${index}`] = true;
      });
      setExpandedItems(initialExpandedState);
    }
  }, [zoneItems]);
  return (
    <div className=" h-[calc(100dvh-12rem)] ">
      <DataRenderer isLoading={isFetching} isError={isError} error={error}>
        <div className="space-y-4 overflow-y-scroll h-full">
          <div className="h-16 border-b flex gap-x-6 items-center border-Primary-5 p-4">
            <Link
              to={"/rootumex/zones"}
              className="size-10 border flex items-center   cursor-pointer border-Secondary-500 rounded-CS p-2">
              <FontAwesomeIcon
                className="size-6 text-Primary-500"
                icon={faChevronLeft}
              />
            </Link>
            <h1 className="text-2xl text-RT-Black font-bold leading-CS">
              {user.warehouse_code}
            </h1>
          </div>
          <div className="space-y-4">
            {!zoneItems?.length ? (
              <div className=" h-[25rem] flex items-center justify-center text-2xl text-Primary-500">
                <div className="border-2 border-Primary-5 b rounded-CS w-[25rem] h-[15rem] flex items-center justify-center">
                  No items found
                </div>
              </div>
            ) : (
              groupItemsByZone().map(([zoneCode, items], zoneIndex) => {
                const uniqueId = `zone_${zoneCode}_${zoneIndex}`;
                return (
                  <div
                    key={uniqueId}
                    className="border-2 px-4 py-2 rounded-CS border-Secondary-500">
                    <div
                      onClick={() => toggleExpand(uniqueId)}
                      className="h-14 px-2 border-b-2 border-Primary-5   flex justify-between items-center cursor-pointer">
                      <h1 className="font-bold text-lg h-[1.563rem] leading-CS text-Primary-500">
                        {zoneCode}
                      </h1>
                      <FontAwesomeIcon
                        className={`size-4 text-Primary-500 transition-transform duration-300 ${
                          expandedItems[uniqueId] ? "rotate-180" : ""
                        }`}
                        icon={faChevronDown}
                      />
                    </div>
                    <div
                      className={`[&_div:last-child]:border-0  overflow-y-scroll transition-all duration-300 ease-in-out ${
                        expandedItems[uniqueId]
                          ? "max-h-96 opacity-100"
                          : "max-h-0 opacity-0"
                      }`}>
                      {items.map((item, itemIndex) => (
                        <div
                          key={`${uniqueId}_item_${itemIndex}`}
                          className="  border-b-2  border-Secondary-500">
                          <ZoneItemCard
                            item={item}
                            key={`${uniqueId}_itemCard_${itemIndex}`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </DataRenderer>
    </div>
  );
};

export default ZoneDetails;
