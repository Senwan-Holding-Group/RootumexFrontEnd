import { useCloseTransferFL } from "@/api/mutations";
import { getTransferDetailsFLQueryOptions } from "@/api/query";
import DataRenderer from "@/components/DataRenderer";
import Print from "@/components/Printlayout/Print";
import TransferLayout from "@/components/Printlayout/TransferLayout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Loader from "@/components/ui/Loader";
import { useStateContext } from "@/context/useStateContext";
import {
  faChevronLeft,
  faSquareExclamation,
} from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Link, useParams } from "react-router-dom";

const WhsTransferFLDetails = () => {
  const { id } = useParams();
  const { setDialogOpen, setDialogConfig } = useStateContext();

  const {
    data: transferDetailsFL,
    isFetching,
    isError,
    error,
  } = useQuery(getTransferDetailsFLQueryOptions("WHS", id));

  const { mutate: closeTransferFL, isPending: isClosing } = useCloseTransferFL(
    "WHS",
    id
  );

  return (
    <div className=" h-[calc(100dvh-12.25rem)] overflow-auto  ">
      <Loader enable={isClosing} />
      <div className=" h-full bg-white border border-Primary-15 rounded-CS flex flex-col justify-between">
        <DataRenderer isLoading={isFetching} isError={isError} error={error}>
          <div className="px-6 py-4 flex justify-between  h-[4.5rem] border-b border-Primary-15">
            <div className="flex gap-x-6 items-center">
              {" "}
              <Link
                to={"/rootumex/documents/final-docs/Wh-transfer-FL"}
                className="size-10 border flex items-center   cursor-pointer border-Secondary-500 rounded-CS p-2">
                <FontAwesomeIcon
                  className="size-6 text-Primary-500"
                  icon={faChevronLeft}
                />
              </Link>
              <span className="text-2xl leading-CS  font-bold  text-RT-Black">
                {transferDetailsFL?.transferNumber}
              </span>
            </div>
            <Print btnText={"Transfer"}>
              {transferDetailsFL && (
                <TransferLayout data={transferDetailsFL} type="WHSFL" />
              )}
            </Print>
          </div>
          <div className="flex-1 w-full overflow-scroll p-4 flex flex-col gap-y-10 ">
            <div className="space-y-4 min-w-[80rem]">
              <Label className="text-Gray-500 font-bold text-lg leading-CS h-[1.5625rem]">
                Transfer details
              </Label>
              <div className="flex gap-x-16  ">
                <div className=" w-1/3 space-y-4 ">
                  <div className="space-y-1  ">
                    <Label
                      className={
                        "text-Gray-500 ml-2 font-bold text-sm leading-CS h-[1.1875rem]"
                      }>
                      Code
                    </Label>
                    <span
                      className={
                        "text-Gray-500 p-2 rounded-CS  border w-full inline-flex border-Secondary-500 font-medium text-base leading-CS h-10"
                      }>
                      {transferDetailsFL?.transferNumber}
                    </span>
                  </div>

                  <div className="space-y-1  ">
                    <Label
                      className={
                        "text-Gray-500 ml-2 font-bold text-sm leading-CS h-[1.1875rem]"
                      }>
                      Status
                    </Label>
                    <span
                      className={
                        "text-Gray-500 p-2 rounded-CS border w-full inline-flex border-Secondary-500 font-medium text-base leading-CS h-10"
                      }>
                      {transferDetailsFL?.status}
                    </span>
                  </div>
                </div>
                <div className=" w-1/3 space-y-4">
                  <div className="space-y-1  ">
                    <Label
                      className={
                        "text-Gray-500 ml-2 font-bold text-sm leading-CS h-[1.1875rem]"
                      }>
                      Document Date
                    </Label>
                    <span
                      className={
                        "text-Gray-500 p-2 rounded-CS border w-full inline-flex border-Secondary-500 font-medium text-base leading-CS h-10"
                      }>
                      {transferDetailsFL?.docDate &&
                        format(new Date(transferDetailsFL.docDate), "PP")}
                    </span>
                  </div>
                  <div className="space-y-1  ">
                    <Label
                      className={
                        "text-Gray-500 ml-2 font-bold text-sm leading-CS h-[1.1875rem]"
                      }>
                      Comment
                    </Label>
                    <span
                      className={
                        "text-Gray-500 p-2 rounded-CS border w-full inline-flex border-Secondary-500 font-medium text-base leading-CS h-10"
                      }>
                      {transferDetailsFL?.remark}
                    </span>
                  </div>
                </div>
                <div className=" w-1/3 space-y-4">
                  <div className="space-y-1  ">
                    <Label
                      className={
                        "text-Gray-500 ml-2 font-bold text-sm leading-CS h-[1.1875rem]"
                      }>
                      From
                    </Label>
                    <span
                      className={
                        "text-Gray-500 p-2 rounded-CS border w-full inline-flex border-Secondary-500 font-medium text-base leading-CS h-10"
                      }>
                      {transferDetailsFL?.from}
                    </span>
                  </div>
                  <div className="space-y-1  ">
                    <Label
                      className={
                        "text-Gray-500 ml-2 font-bold text-sm leading-CS h-[1.1875rem]"
                      }>
                      To
                    </Label>
                    <span
                      className={
                        "text-Gray-500 p-2 rounded-CS border w-full inline-flex border-Secondary-500 font-medium text-base leading-CS h-10"
                      }>
                      {transferDetailsFL?.to}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4 min-w-[80rem]">
              <Label className="text-Gray-500 font-bold text-lg leading-CS h-[1.5625rem]">
                Transfer Items
              </Label>
              <div className="border-2 overflow-scroll  border-Primary-5 rounded-2xl">
                <table className="w-full  caption-bottom ">
                  <thead className="sticky top-0 w-full bg-Primary-5">
                    <tr className="text-nowrap font-semibold  text-base/CS   text-left text-Primary-400">
                      <th className="pr-6 pl-4 py-3  rounded-tl-xl">Code</th>
                      <th className="pr-6 pl-4 py-3">Name</th>
                      <th className="pr-6 pl-4 py-3">UOM</th>
                      <th className="pr-6 pl-4 py-3 ">Quantity</th>
                      <th className="pr-6 pl-4 py-3 ">Barcode</th>
                      <th className="pr-6 pl-4 py-3 rounded-tr-xl">Status</th>
                    </tr>
                  </thead>
                  <tbody className=" [&_tr:last-child]:border-0 ">
                    {transferDetailsFL?.transferLines?.map((item) => (
                      <tr
                        key={item.line}
                        className="text-RT-Black  text-nowrap font-medium text-base/CS border-b-1 border-Primary-15 transition duration-300 ease-in-out hover:bg-gray-100 cursor-pointer">
                        <td className="pr-6 pl-4 py-3">{item.itemCode}</td>
                        <td className="pr-6 pl-4 py-3">{item.name}</td>
                        <td className="pr-6 pl-4 py-3">{item.uomCode}</td>
                        <td className="pr-6 pl-4 py-3">{item.quantity}</td>
                        <td className="pr-6 pl-4 py-3">{item.barcode}</td>
                        <td className="pr-6 pl-4 py-3">{item.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="space-y-4 min-w-[80rem]">
              <Label className="text-Gray-500 font-bold text-lg leading-CS h-[1.5625rem]">
                Administrative data
              </Label>
              <div className="flex gap-x-8 ">
                <div className="space-y-6">
                  <div className="flex gap-x-2 items-center">
                    <Label className="text-Gray-500 font-bold text-sm leading-CS h-[1.188rem]">
                      Created by:
                    </Label>
                    <span className="text-RT-Black font-bold text-base leading-CS">
                      Adam
                    </span>
                  </div>
                  <div className="flex gap-x-2 items-center">
                    <Label className="text-Gray-500 font-bold text-sm leading-CS h-[1.188rem]">
                      Created at:
                    </Label>
                    <span className="text-RT-Black font-bold text-base leading-CS">
                      {transferDetailsFL?.createdAt &&
                        format(new Date(transferDetailsFL.createdAt), "PP")}
                    </span>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="flex gap-x-2 items-center">
                    <Label className="text-Gray-500 font-bold text-sm leading-CS h-[1.188rem]">
                      Edited by:
                    </Label>
                    <span className="text-RT-Black font-bold text-base leading-CS">
                      Adam
                    </span>
                  </div>
                  <div className="flex gap-x-2 items-center">
                    <Label className="text-Gray-500 font-bold text-sm leading-CS h-[1.188rem]">
                      Edited at:
                    </Label>
                    <span className="text-RT-Black font-bold text-base leading-CS">
                      {transferDetailsFL?.updateAt &&
                        format(new Date(transferDetailsFL.updateAt), "PP")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DataRenderer>
        <div className="flex justify-end gap-x-4 px-6 py-4 border-t h-[4.5rem] border-Primary-15">
          <Button
            disabled={isFetching || isClosing}
            onClick={() => {
              setDialogOpen(true);
              setDialogConfig({
                title: "Close Transfer",
                description: "Are you sure you want to close this Transfer? ",
                icon: faSquareExclamation,
                iconColor: "text-Primary-400",
                variant: "danger",
                type: "Confirmation",
                confirm: () => closeTransferFL(),
                confirmText: "Close Transfer",
              });
            }}
            className="  w-[10rem] rounded-2xl  font-bold ">
            Close Transfer
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WhsTransferFLDetails;
