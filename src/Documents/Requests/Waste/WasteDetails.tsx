/* eslint-disable @typescript-eslint/no-explicit-any */
import { getWasteDetails, putWaste } from "@/api/client";
import ConfirmationDialog from "@/components/ConfirmationDialog";
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
import { EditWasteRequest, EditWasteSchema } from "@/lib/formsValidation";
import { Waste } from "@/lib/types";
import {
  faChevronLeft,
  faSpinner,
  faSquareCheck,
  faSquareExclamation,
  faTrashCan,
} from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useParams } from "react-router-dom";

const WasteDetails = () => {
  const { id } = useParams();
  const { setError } = useStateContext();
  const queryClient = useQueryClient();
  const [docLine, setdocLine] = useState<Waste["waste_lines"][0][]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogConfig, setDialogConfig] = useState({
    title: "",
    description: "",
    icon: faSquareCheck,
    iconColor: "text-Success-600",
    variant: "success" as "success" | "danger",
  });
  const [isEdit, setisEdit] = useState(false);
  const form = useForm<EditWasteRequest>({
    resolver: zodResolver(EditWasteSchema),
    defaultValues: {
      remark: "",
      wasteLines: [],
    },
  });
  const {
    data: wasteDetails,
    isFetching,
    isError,
  } = useQuery({
    queryKey: ["wasteDetails", id],
    queryFn: () => getWasteDetails(`/waste/${id}`, setError),
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });

  useEffect(() => {
    if (wasteDetails) {
      form.reset({
        remark: wasteDetails.remark,
        wasteLines: [],
      });
      setdocLine(wasteDetails.waste_lines);
    }
  }, [form, wasteDetails]);
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
          quantity: Math.abs(quantity),
        };
      })
    );
  };
  const { mutate: editWaste, isPending } = useMutation({
    mutationFn: (data: EditWasteRequest) => putWaste(`/waste/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wasteDetails"] });
      form.reset();
      setDialogConfig({
        title: "Waste updated successfully!",
        description: "Your waste is successfully updated ",
        icon: faSquareCheck,
        iconColor: "text-Success-600",
        variant: "success",
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
        title: "Waste not updated",
        description: errorMessage,
        icon: faSquareExclamation,
        iconColor: "text-Error-600",
        variant: "danger",
      });
      setDialogOpen(true);
    },
  });
  const onSubmit = async (values: EditWasteRequest) => {
    const newValues = {
      remark: values.remark,
      wasteLines: docLine.map((value) => ({
        item_code: value.item_code,
        uom_code: value.uom_code,
        description: value.description,
        reason: value.reason,
        quantity: value.quantity,
      })),
    };
    editWaste(newValues);
  };
  return (
    <Form {...form}>
      <div className=" h-[calc(100dvh-12.25rem)] overflow-auto  ">
        <Loader enable={isPending} />
        <div className=" h-full bg-white border border-Primary-15 rounded-CS flex flex-col justify-between">
          <DataRenderer isLoading={isFetching} isError={isError}>
            <div className="px-6 py-4 flex gap-x-6 items-center h-[4.5rem] border-b border-Primary-15">
              <Link
                to={"/rootumex/documents/requests/waste"}
                className="size-10 border flex items-center   cursor-pointer border-Secondary-500 rounded-CS p-2">
                <FontAwesomeIcon
                  className="size-6 text-Primary-500"
                  icon={faChevronLeft}
                />
              </Link>
              <span className="text-2xl leading-CS  font-bold  text-RT-Black">
                {wasteDetails?.waste_number}
              </span>
            </div>
            <div className="flex-1 w-full overflow-scroll p-4 flex flex-col gap-y-10 ">
              <div className="space-y-4 min-w-[80rem]">
                <Label className="text-Gray-500 font-bold text-lg leading-CS h-[1.5625rem]">
                  Waste details
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
                        {wasteDetails?.waste_number}
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
                        {wasteDetails?.warehouse}
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
                        {wasteDetails?.document_date &&
                          format(new Date(wasteDetails.document_date), "PP")}
                      </span>
                    </div>
                  </div>
                  <div className=" w-1/3 space-y-4">
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
                </div>
              </div>
              <div className="space-y-4 min-w-[80rem]">
                <Label className="text-Gray-500 font-bold text-lg leading-CS h-[1.5625rem]">
                  Waste Items
                </Label>
                <div className="border-2 overflow-scroll  border-Primary-5 rounded-2xl">
                  <table className="w-full  caption-bottom ">
                    <thead className="sticky top-0 w-full bg-Primary-5">
                      <tr className="text-nowrap font-semibold  text-base/CS   text-left text-Primary-400">
                        <th className="pr-6 pl-4 py-3  rounded-tl-xl">Code</th>
                        <th className="pr-6 pl-4 py-3">Name</th>
                        <th className="pr-6 pl-4 py-3">UOM</th>
                        <th className="pr-6 pl-4 py-3">Reason</th>
                        <th className="pr-6 pl-4 py-3">Quantity</th>
                        <th className="pr-6 pl-4 py-3 rounded-tr-xl">Remove</th>
                      </tr>
                    </thead>
                    <tbody className=" [&_tr:last-child]:border-0 ">
                      {docLine.map((item) => (
                        <tr
                          key={item.line_number}
                          className="text-RT-Black  text-nowrap font-medium text-base/CS border-b-1 border-Primary-15 transition duration-300 ease-in-out hover:bg-gray-100 cursor-pointer">
                          <td className="pr-6 pl-4 py-3">{item.item_code}</td>
                          <td className="pr-6 pl-4 py-3">{item.item_name}</td>
                          <td className="pr-6 pl-4 py-3">{item.uom_code}</td>
                          <td className="pr-6 pl-4 py-3">
                            <Input
                              value={item.reason}
                              type="text"
                              disabled={!isEdit}
                              key={item.line_number}
                              onChange={(e) => {
                                setdocLine(
                                  docLine.map((value) => {
                                    if (value.line_number != item.line_number) {
                                      return value;
                                    }
                                    return {
                                      ...value,
                                      reason: e.target.value,
                                    };
                                  })
                                );
                              }}
                              className="w-[8rem] p-1 h-1/2 border text-center rounded-lg"
                            />
                          </td>
                          <td className="pr-6 pl-4 py-3">
                            <Input
                              value={item.quantity}
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
                            <Button
                              disabled={!isEdit}
                              onClick={() => {
                                setdocLine(
                                  docLine.filter((value) => {
                                    if (docLine.length === 1) return value;
                                    else
                                      return (
                                        value.line_number != item.line_number
                                      );
                                  })
                                );
                              }}
                              type="button"
                              size={"icon"}
                              className=" flex p-0 items-center justify-center bg-transparent ">
                              <FontAwesomeIcon
                                className="text-Error-500"
                                icon={faTrashCan}
                              />
                            </Button>
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
                        31,Mar,2025
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
                        31,Mar,2025
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
                  disabled={isFetching}
                  className=" bg-transparent w-[10rem] rounded-2xl font-bold text-Error-600 border border-Secondary-500  ">
                  Cancel Waste
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
                  className="  rounded-2xl w-[10rem]">
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
                  onClick={form.handleSubmit(onSubmit)}
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
      <ConfirmationDialog
        isOpen={dialogOpen}
        onClose={() => setDialogOpen(false)}
        title={dialogConfig.title}
        description={dialogConfig.description}
        icon={dialogConfig.icon}
        iconColor={dialogConfig.iconColor}
        confirmText="OK"
        type="Info"
        onConfirm={() => setDialogOpen(false)}
        variant={dialogConfig.variant}
      />
    </Form>
  );
};

export default WasteDetails;
