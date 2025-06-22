/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  getStockCountDetails,
  postCancelStockCount,
  postCloseStockCount,
  putStockCount,
} from "@/api/client";
import DataRenderer from "@/components/DataRenderer";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Loader from "@/components/ui/Loader";
import { useStateContext } from "@/context/useStateContext";
import {
  EditStockCountRequest,
  EditStockCountSchema,
} from "@/lib/formsValidation";
import { StockCount } from "@/lib/types";
import {
  faChevronLeft,
  faSpinner,
  faSquareCheck,
  faSquareExclamation,
} from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useParams } from "react-router-dom";

const StockCountDetails = () => {
  const { id } = useParams();
  const { setError, setDialogConfig, setDialogOpen } = useStateContext();
  const queryClient = useQueryClient();
  const [docLine, setdocLine] = useState<StockCount["lines"][0][]>([]);

  const [isEdit, setisEdit] = useState(false);
  const form = useForm<EditStockCountRequest>({
    resolver: zodResolver(EditStockCountSchema),
    defaultValues: {
      remark: "",
      lines: [],
    },
  });
  const {
    data: stockCountDetails,
    isFetching,
    isError,
  } = useQuery({
    queryKey: ["stockCountDetails", id],
    queryFn: () => getStockCountDetails(`/inventory_count/${id}`, setError),
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  useEffect(() => {
    if (stockCountDetails) {
      form.reset({
        remark: stockCountDetails.remark,
        lines: [],
      });
      const linesWithLineProperty =
        stockCountDetails.lines === null
          ? []
          : stockCountDetails.lines.map((item, index) => ({
              ...item,
              line_number: index + 1,
            }));
      setdocLine(linesWithLineProperty);
    }
  }, [form, stockCountDetails]);
  const updateLineQuantity = (line: number, newQuantity: string) => {
    const quantity = parseFloat(newQuantity);
    if (isNaN(quantity)) return;
    setdocLine(
      docLine.map((value) => {
        if (value.line_number != line) {
          return value;
        }
        return {
          ...value,
          counted_quantity: Math.abs(quantity),
        };
      })
    );
  };
  const calculateDifference = (counted: number, zoneQty: number) => {
    const diff = counted - zoneQty;

    if (diff === 0) {
      return <span className="text-Success-600">0</span>;
    } else if (diff > 0) {
      return <span className="text-Error-600">{diff} (Over)</span>;
    } else {
      return <span className="text-Error-600">{Math.abs(diff)} (Short)</span>;
    }
  };
  const { mutate: editStockCount, isPending } = useMutation({
    mutationFn: (data: EditStockCountRequest) =>
      putStockCount(`/inventory_count/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stockCountDetails"] });
      form.reset();
      setDialogConfig({
        title: "Stock count updated successfully!",
        description: "Your stock count is successfully updated ",
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
      form.setError("root", { message: errorMessage });
      setDialogConfig({
        title: "Stock count not updated",
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
  const { mutate: closeStocKCount, isPending: isClosing } = useMutation({
    mutationFn: () => postCloseStockCount(`/inventory_count/close/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["stockCountDetails"] });
      setDialogConfig({
        title: "Stock count Closed successfully!",
        description: "Your Stock count is successfully closed ",
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
        title: "Stock count not updated",
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
  const { mutate: cancelStockCount, isPending: isCancelling } = useMutation({
    mutationFn: () => postCancelStockCount(`/inventory_count/cancel/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wasteDetails"] });
      form.reset();
      setDialogConfig({
        title: "Stock count canceled successfully!",
        description: "Your Stock count is successfully canceled ",
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
      form.setError("root", { message: errorMessage });
      setDialogConfig({
        title: "Stock count not updated",
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
  const onSubmit = async (values: EditStockCountRequest) => {
    const newValues = {
      remark: values.remark,
      lines: docLine,
    };
    editStockCount(newValues);
  };
  return (
    <Form {...form}>
      <div className=" h-[calc(100dvh-6.875rem)] overflow-auto  ">
        <Loader enable={isPending} />
        <div className=" h-full bg-white border border-Primary-15 rounded-CS flex flex-col justify-between">
          <DataRenderer isLoading={isFetching} isError={isError}>
            <div className="px-6 py-4 flex gap-x-6 items-center h-[4.5rem] border-b border-Primary-15">
              <Link
                to={"/rootumex/stock-count"}
                className="size-10 border flex items-center   cursor-pointer border-Secondary-500 rounded-CS p-2">
                <FontAwesomeIcon
                  className="size-6 text-Primary-500"
                  icon={faChevronLeft}
                />
              </Link>
              <span className="text-2xl leading-CS  font-bold  text-RT-Black">
                {stockCountDetails?.inventory_count_number}
              </span>
            </div>
            <div className="flex-1 w-full overflow-scroll p-4 flex flex-col gap-y-10 ">
              <div className="space-y-4 min-w-[80rem]">
                <Label className="text-Gray-500 font-bold text-lg leading-CS h-[1.5625rem]">
                  Stock count details
                </Label>
                <div className="flex gap-x-16  ">
                  <div className=" w-1/3 space-y-4 ">
                    <div className="space-y-1  ">
                      <Label
                        className={`${
                          isEdit ? "text-Gray-300" : "text-Gray-500"
                        } ml-2 font-bold text-sm leading-CS h-[1.1875rem]`}>
                        Code
                      </Label>
                      <span
                        className={`${
                          isEdit ? "bg-Gray-50 text-Gray-300" : "text-Gray-500"
                        } p-2 rounded-CS  text-Gray-300 border w-full inline-flex border-Secondary-500 font-medium text-base leading-CS h-10`}>
                        {stockCountDetails?.inventory_count_number}
                      </span>
                    </div>

                    <div className="space-y-1  ">
                      <Label
                        className={`${
                          isEdit ? "text-Gray-300" : "text-Gray-500"
                        } ml-2 font-bold text-sm leading-CS h-[1.1875rem]`}>
                        Warehouse
                      </Label>
                      <span
                        className={`${
                          isEdit ? "bg-Gray-50 text-Gray-300" : "text-Gray-500"
                        } p-2 rounded-CS border w-full inline-flex border-Secondary-500 font-medium text-base leading-CS h-10`}>
                        {stockCountDetails?.warehouse_code}
                      </span>
                    </div>
                  </div>
                  <div className=" w-1/3 space-y-4">
                    <div className="space-y-1  ">
                      <Label
                        className={`${
                          isEdit ? "text-Gray-300" : "text-Gray-500"
                        } ml-2 font-bold text-sm leading-CS h-[1.1875rem]`}>
                        Document Date
                      </Label>
                      <span
                        className={`${
                          isEdit ? "bg-Gray-50 text-Gray-300" : "text-Gray-500"
                        } p-2 rounded-CS border w-full inline-flex border-Secondary-500 font-medium text-base leading-CS h-10`}>
                        {stockCountDetails?.doc_date &&
                          format(new Date(stockCountDetails.doc_date), "PP")}
                      </span>
                    </div>
                    <FormField
                      control={form.control}
                      name="remark"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-Gray-500   ml-2 font-bold text-sm leading-CS h-[1.1875rem]">
                            Comment
                          </FormLabel>
                          <FormControl>
                            <Input
                              disabled={isPending || !isEdit}
                              placeholder="comment"
                              {...field}
                              className="border w-full inline-flex disabled:opacity-100 border-Secondary-500 font-medium text-base leading-CS"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className=" w-1/3 space-y-4">
                    <div className="space-y-1  ">
                      <Label
                        className={`${
                          isEdit ? "text-Gray-300" : "text-Gray-500"
                        } ml-2 font-bold text-sm leading-CS h-[1.1875rem]`}>
                        Status
                      </Label>
                      <span
                        className={`${
                          isEdit ? "bg-Gray-50 text-Gray-300" : "text-Gray-500"
                        } p-2 rounded-CS border w-full inline-flex border-Secondary-500 font-medium text-base leading-CS h-10`}>
                        {stockCountDetails?.status}
                      </span>
                    </div>
                    <div className="space-y-1  ">
                      <Label
                        className={`${
                          isEdit ? "text-Gray-300" : "text-Gray-500"
                        } ml-2 font-bold text-sm leading-CS h-[1.1875rem]`}>
                        Section
                      </Label>
                      <span
                        className={`${
                          isEdit ? "bg-Gray-50 text-Gray-300" : "text-Gray-500"
                        } p-2 rounded-CS border w-full inline-flex border-Secondary-500 font-medium text-base leading-CS h-10`}>
                        {stockCountDetails?.batch}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4 min-w-[80rem]">
                <Label className="text-Gray-500 font-bold text-lg leading-CS h-[1.5625rem]">
                  Stock results
                </Label>
                <div className="border-2 overflow-scroll  border-Primary-5 rounded-2xl">
                  <table className="w-full  caption-bottom ">
                    <thead className="sticky top-0 w-full bg-Primary-5">
                      <tr className="text-nowrap font-semibold  text-base/CS   text-left text-Primary-400">
                        <th className="pr-6 pl-4 py-3  rounded-tl-xl">Code</th>
                        <th className="pr-6 pl-4 py-3">Name</th>
                        <th className="pr-6 pl-4 py-3">Zone</th>
                        <th className="pr-6 pl-4 py-3">Warehouse quantity </th>
                        <th className="pr-6 pl-4 py-3">
                          Stock count quantity{" "}
                        </th>
                        <th className="pr-6 pl-4 py-3 rounded-tr-xl">
                          Difference{" "}
                        </th>
                      </tr>
                    </thead>
                    <tbody className=" [&_tr:last-child]:border-0 ">
                      {docLine.map((item) => (
                        <tr
                          key={item.line_number}
                          className="text-RT-Black  text-nowrap font-medium text-base/CS border-b-1 border-Primary-15 transition duration-300 ease-in-out hover:bg-gray-100 cursor-pointer">
                          <td className="pr-6 pl-4 py-3">{item.item_code}</td>
                          <td className="pr-6 pl-4 py-3">{item.item_name}</td>
                          <td className="pr-6 pl-4 py-3">{item.zone_code}</td>
                          <td className="pr-6 pl-4 py-3">
                            {item.zone_quantity}
                          </td>
                          <td className="pr-6 pl-4 py-3">
                            <Input
                              value={item.counted_quantity}
                              step="0.25"
                              type="number"
                              disabled={!isEdit}
                              key={item.line_number}
                              onChange={(e) => {
                                updateLineQuantity(
                                  item.line_number,
                                  e.target.value
                                );
                              }}
                              className="w-[5rem] p-0 h-1/2 border-0 text-center rounded-lg"
                            />
                          </td>
                          <td className="pr-6 pl-4 py-3">
                            {calculateDifference(
                              item.counted_quantity,
                              item.zone_quantity
                            )}
                          </td>
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
                        {stockCountDetails?.created_at &&
                          format(new Date(stockCountDetails.created_at), "PP")}
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
                        {stockCountDetails?.update_at &&
                          format(new Date(stockCountDetails.update_at), "PP")}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </DataRenderer>
          <div className="flex justify-end gap-x-4 px-6 py-4 border-t h-[4.5rem] border-Primary-15">
            {!isEdit ? (
              <>
                <Button
                  disabled={isFetching || isClosing || isCancelling}
                  onClick={() => {
                    setDialogOpen(true);
                    setDialogConfig({
                      title: "Cancel Stock Count",
                      description:
                        "Are you sure you want to cancel this Stock Count? ",
                      icon: faSquareExclamation,
                      iconColor: "text-Primary-400",
                      variant: "danger",
                      type: "Confirmation",
                      confirm: () => cancelStockCount(),
                      confirmText: "Cancel Stock Count",
                    });
                  }}
                  className=" bg-transparent w-[10rem] rounded-2xl font-bold text-Error-600 border border-Secondary-500  ">
                  Cancel Stock Count
                </Button>
                <Button
                  disabled={isFetching || isClosing}
                  onClick={() => {
                    setDialogOpen(true);
                    setDialogConfig({
                      title: "Close Stock Count",
                      description:
                        "Are you sure you want to close this Stock Count? ",
                      icon: faSquareExclamation,
                      iconColor: "text-Primary-400",
                      variant: "danger",
                      type: "Confirmation",
                      confirm: () => closeStocKCount(),
                      confirmText: "Close Stock Count",
                    });
                  }}
                  className="  w-[10rem] rounded-2xl  font-bold ">
                  Close Stock Count
                </Button>
                <Button
                  disabled={isFetching}
                  type="button"
                  onClick={(e) => {
                    if (!isEdit) {
                      e.preventDefault();
                      setisEdit(true);
                    }
                  }}
                  className="bg-transparent border text-Primary-500 border-Secondary-500 font-bold rounded-2xl w-[10rem]">
                  Edit
                </Button>
              </>
            ) : (
              <>
                <Button
                  type="button"
                  onClick={() => {
                    setisEdit(false);
                  }}
                  disabled={isPending}
                  className="bg-transparent w-[10rem] text-Primary-600 border font-bold border-Secondary-500 rounded-2xl">
                  Cancel
                </Button>
                <Button
                  disabled={isPending}
                  type="submit"
                  onClick={() => {
                    setDialogOpen(true);
                    setDialogConfig({
                      title: "Edit Stock Count",
                      description:
                        "Are you sure you want to edit this Stock Count? ",
                      icon: faSquareExclamation,
                      iconColor: "text-Primary-400",
                      variant: "info",
                      type: "Confirmation",
                      confirm: () => form.handleSubmit(onSubmit)(),
                      confirmText: "Save",
                    });
                  }}
                  className="  rounded-2xl w-[10rem]">
                  {isPending && (
                    <FontAwesomeIcon className="" icon={faSpinner} spin />
                  )}
                  Save
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </Form>
  );
};

export default StockCountDetails;
