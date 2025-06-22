/* eslint-disable @typescript-eslint/no-explicit-any */
import { getGRPODetails, postGRPO } from "@/api/client";
import DataRenderer from "@/components/DataRenderer";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Loader from "@/components/ui/Loader";
import { useStateContext } from "@/context/useStateContext";
import { numberWithCommas } from "@/lib/utils";
import {
  faChevronLeft,
  faSquareCheck,
  faSquareExclamation,
} from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { useCallback } from "react";
import { Link, useParams } from "react-router-dom";

const GRPODetails = () => {
  const { id } = useParams();
  const { setError, setDialogOpen, setDialogConfig } = useStateContext();
  const queryClient = useQueryClient();
  const {
    data: grpoDetails,
    isFetching,
    isError,
  } = useQuery({
    queryKey: ["grpoDetails", id],
    queryFn: () => getGRPODetails(`/GRPO/${id}`, setError),
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  const { mutate: closeGRPO, isPending: isClosing } = useMutation({
    mutationFn: () => postGRPO(`/GRPO/close/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["grpoDetails"] });
      setDialogConfig({
        title: "GRPO Closed successfully!",
        description: "Your GRPO is successfully closed ",
        icon: faSquareCheck,
        iconColor: "text-Success-600",
        variant: "success",
        type: "Info",
        confirm: undefined,
        confirmText: "OK",
      });
      setDialogOpen(true);
    },
    onError: (error: any) => {
      const errorMessage =
        error.message === "Network Error"
          ? "Network error. Please check your connection."
          : error.response?.data?.details || "An error occurred";
      setDialogConfig({
        title: "GRPO not updated",
        description: errorMessage,
        icon: faSquareExclamation,
        iconColor: "text-Error-600",
        variant: "danger",
        type: "Info",
        confirm: undefined,
        confirmText: "OK",
      });
      setDialogOpen(true);
    },
  });
  const calculateDocumentTotal = useCallback(() => {
    return grpoDetails?.poLines?.reduce(
      (sum, line) => sum + (line.total_price || 0),
      0
    );
  }, [grpoDetails?.poLines]);
  const documentTotal = calculateDocumentTotal();
  return (
    <div className=" h-[calc(100dvh-12.25rem)] overflow-auto  ">
      <Loader enable={isClosing} />
      <div className=" h-full bg-white border border-Primary-15 rounded-CS flex flex-col justify-between">
        <DataRenderer isLoading={isFetching} isError={isError}>
          <div className="px-6 py-4 flex gap-x-6 items-center h-[4.5rem] border-b border-Primary-15">
            <Link
              to={"/rootumex/documents/final-docs/grpo"}
              className="size-10 border flex items-center   cursor-pointer border-Secondary-500 rounded-CS p-2">
              <FontAwesomeIcon
                className="size-6 text-Primary-500"
                icon={faChevronLeft}
              />
            </Link>
            <span className="text-2xl leading-CS  font-bold  text-RT-Black">
              {grpoDetails?.code}
            </span>
          </div>
          <div className="flex-1 w-full overflow-scroll p-4 flex flex-col gap-y-10 ">
            <div className="space-y-4 min-w-[80rem]">
              <Label className="text-Gray-500 font-bold text-lg leading-CS h-[1.5625rem]">
                GRPO details
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
                      {grpoDetails?.code}
                    </span>
                  </div>
                  <div className="space-y-1  ">
                    <Label
                      className={
                        "text-Gray-300   ml-2 font-bold text-sm leading-CS h-[1.1875rem]"
                      }>
                      Vendor
                    </Label>
                    <span
                      className={
                        "text-Gray-500 p-2 rounded-CS border w-full inline-flex border-Secondary-500 font-medium text-base leading-CS h-10"
                      }>
                      {grpoDetails?.vendorName}
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
                        "text-Gray-500  p-2 rounded-CS border w-full inline-flex border-Secondary-500 font-medium text-base leading-CS h-10"
                      }>
                      {grpoDetails?.status}
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
                      {grpoDetails?.docDate &&
                        format(new Date(grpoDetails.docDate), "PP")}
                    </span>
                  </div>
                  <div className="space-y-1  ">
                    <Label
                      className={
                        "text-Gray-500 ml-2 font-bold text-sm leading-CS h-[1.1875rem]"
                      }>
                      Warehouse Code
                    </Label>
                    <span
                      className={
                        "text-Gray-500  p-2 rounded-CS border w-full inline-flex border-Secondary-500 font-medium text-base leading-CS h-10"
                      }>
                      {grpoDetails?.warehouseCode}
                    </span>
                  </div>
                  <div className="space-y-1  ">
                    <Label
                      className={
                        "text-Gray-500 ml-2 font-bold text-sm leading-CS h-[1.1875rem]"
                      }>
                      Project Code
                    </Label>
                    <span
                      className={
                        "text-Gray-500  p-2 rounded-CS border w-full inline-flex border-Secondary-500 font-medium text-base leading-CS h-10"
                      }>
                      {grpoDetails?.projectCode}
                    </span>
                  </div>
                </div>
                <div className=" w-1/3 space-y-4">
                  <div className="space-y-1  ">
                    <Label
                      className={`ml-2 font-bold text-sm text-Gray-500  leading-CS h-[1.1875rem]`}>
                      Document Total
                    </Label>
                    <span
                      className={
                        "text-Gray-500  p-2 rounded-CS border w-full inline-flex border-Secondary-500 font-medium text-base leading-CS h-10"
                      }>
                      {numberWithCommas(documentTotal)}
                    </span>
                  </div>
                  <div className="space-y-1  ">
                    <Label
                      className={
                        "text-Gray-500 ml-2 font-bold text-sm leading-CS h-[1.1875rem]"
                      }>
                      Remark
                    </Label>
                    <span
                      className={
                        "text-Gray-500  p-2 rounded-CS border w-full inline-flex border-Secondary-500 font-medium text-base leading-CS h-10"
                      }>
                      {grpoDetails?.remark}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-4 min-w-[80rem]">
              <Label className="text-Gray-500 font-bold text-lg leading-CS h-[1.5625rem]">
                GRPO Items
              </Label>
              <div className="border-2 overflow-scroll  border-Primary-5 rounded-2xl">
                <table className="w-full  caption-bottom ">
                  <thead className="sticky top-0 w-full bg-Primary-5">
                    <tr className="text-nowrap font-semibold  text-base/CS   text-left text-Primary-400">
                      <th className="pr-6 pl-4 py-3  rounded-tl-xl">Code</th>
                      <th className="pr-6 pl-4 py-3">Name</th>
                      <th className="pr-6 pl-4 py-3">UOM</th>
                      <th className="pr-6 pl-4 py-3 ">PO quantity</th>
                      <th className="pr-6 pl-4 py-3 ">Received quantity</th>
                      <th className="pr-6 pl-4 py-3 ">Price</th>
                      <th className="pr-6 pl-4 py-3 ">Total Price</th>
                      <th className="pr-6 pl-4 py-3 ">Barcode</th>
                      <th className="pr-6 pl-4 py-3 rounded-tr-xl">Status</th>
                    </tr>
                  </thead>
                  <tbody className=" [&_tr:last-child]:border-0 ">
                    {grpoDetails?.poLines?.map((item) => (
                      <tr
                        key={item.line}
                        className="text-RT-Black  text-nowrap font-medium text-base/CS border-b-1 border-Primary-15 transition duration-300 ease-in-out hover:bg-gray-100 cursor-pointer">
                        <td className="pr-6 pl-4 py-3">{item.itemCode}</td>
                        <td className="pr-6 pl-4 py-3">{item.name}</td>
                        <td className="pr-6 pl-4 py-3">{item.uom}</td>
                        <td className="pr-6 pl-4 py-3">{item.quantity}</td>
                        <td className="pr-6 pl-4 py-3">
                          {item.recieved_quantity}
                        </td>
                        <td className="pr-6 pl-4 py-3">{item.price}</td>
                        <td className="pr-6 pl-4 py-3">{item.total_price}</td>
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
                      {grpoDetails?.created_at &&
                        format(new Date(grpoDetails.created_at), "PP")}
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
                      {grpoDetails?.updated_at &&
                        format(new Date(grpoDetails.updated_at), "PP")}
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
            type="button"
            onClick={() => {
              setDialogOpen(true);
              setDialogConfig({
                title: "Close GRPO",
                description: "Are you sure you want to close this GRPO? ",
                icon: faSquareExclamation,
                iconColor: "text-Primary-400",
                variant: "danger",
                type: "Confirmation",
                confirm: () => closeGRPO(),
                confirmText: "Close GRPO",
              });
            }}
            className="  w-[10rem] rounded-2xl font-bold    ">
            Close GRPO
          </Button>
        </div>
      </div>
    </div>
  );
};

export default GRPODetails;
