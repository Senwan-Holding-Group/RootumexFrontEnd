import { useCancelTransfer, useUpdateTransfer } from "@/api/mutations";
import { getTransferDetailsQueryOptions } from "@/api/query";
import { Calendar } from "@/components/calendar";
import DataRenderer from "@/components/DataRenderer";
import ItemSelect from "@/components/ItemsSelect";
import Print from "@/components/Printlayout/Print";
import TransferLayout from "@/components/Printlayout/TransferLayout";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStateContext } from "@/context/useStateContext";
import { EditTransferRequest, EditTransferSchema } from "@/lib/formsValidation";
import { Dependencies, Docline } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  faCalendarCirclePlus,
  faChevronLeft,
  faSpinner,
  faSquareExclamation,
  faTrashCan,
} from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useOutletContext, useParams } from "react-router-dom";

const SiteTransferDetails = () => {
  const { id } = useParams();
  const { setDialogConfig, setDialogOpen } = useStateContext();
  const dependencies = useOutletContext<Dependencies>();
  const [docLine, setdocLine] = useState<Docline[]>([]);
  const [isEdit, setisEdit] = useState(false);
  const form = useForm<EditTransferRequest>({
    resolver: zodResolver(EditTransferSchema),
    defaultValues: {
      from: "",
      to: "",
      remark: "",
      docDueDate: new Date(),
      transferLines: [],
    },
  });
  const {
    data: siteTransferDetails,
    isFetching,
    isError,
    error,
  } = useQuery(getTransferDetailsQueryOptions("SITE", id));

  const updateLineQuantity = (line: number, newQuantity: string) => {
    const quantity = parseFloat(newQuantity);
    if (isNaN(quantity)) return;
    setdocLine(
      docLine.map((value) => {
        if (value.line != line) {
          return value;
        }
        return {
          ...value,
          quantity: Math.abs(quantity),
        };
      })
    );
  };
  useEffect(() => {
    if (siteTransferDetails) {
      form.reset({
        docDueDate: new Date(siteTransferDetails.docDueDate),
        from: siteTransferDetails.from,
        to: siteTransferDetails.to,
        remark: siteTransferDetails.remark,
        transferLines: [],
      });
      const linesWithLineProperty = siteTransferDetails.transferLines.map(
        (item, index) => ({
          ...item,
          line: index + 1,
        })
      );

      setdocLine(linesWithLineProperty);
    }
  }, [form, siteTransferDetails]);

  const { mutate: editTransfer, isPending } = useUpdateTransfer("SITE", id);
  const { mutate: cancelTransfer, isPending: isClosing } = useCancelTransfer(
    "SITE",
    id
  );
  const onSubmit = async (values: EditTransferRequest) => {
    const newValues = {
      ...values,
      docDueDate: new Date(format(values.docDueDate, "yyyy-MM-dd")),
      transferLines: docLine
        .filter((value) => value.status === "O")
        .map((value) => ({
          itemCode: value.itemCode,
          description: value.description,
          uomCode: value.uomCode,
          quantity: value.quantity,
        })),
    };
    editTransfer(newValues);
  };
  return (
    <Form {...form}>
      <div className=" h-[calc(100dvh-12.25rem)] overflow-auto  ">
        <Loader enable={isPending} />
        <div className=" h-full bg-white border border-Primary-15 rounded-CS flex flex-col justify-between">
          <DataRenderer isLoading={isFetching} isError={isError} error={error}>
            <div className="px-6 py-4 flex justify-between  h-[4.5rem] border-b border-Primary-15">
              <div className="flex gap-x-6 items-center">
                {" "}
                <Link
                  to={"/rootumex/documents/requests/sites-transfer"}
                  className="size-10 border flex items-center   cursor-pointer border-Secondary-500 rounded-CS p-2">
                  <FontAwesomeIcon
                    className="size-6 text-Primary-500"
                    icon={faChevronLeft}
                  />
                </Link>
                <span className="text-2xl leading-CS  font-bold  text-RT-Black">
                  {siteTransferDetails?.transferNumber}
                </span>
              </div>
              <Print btnText={"Transfer"}>
                {siteTransferDetails && (
                  <TransferLayout data={siteTransferDetails} type="SITE" />
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
                        className={`${
                          isEdit ? "text-Gray-300" : "text-Gray-500"
                        } ml-2 font-bold text-sm leading-CS h-[1.1875rem]`}>
                        Code
                      </Label>
                      <span
                        className={`${
                          isEdit ? "bg-Gray-50 text-Gray-300" : "text-Gray-500"
                        } p-2 rounded-CS  text-Gray-300 border w-full inline-flex border-Secondary-500 font-medium text-base leading-CS h-10`}>
                        {siteTransferDetails?.transferNumber}
                      </span>
                    </div>

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
                        {siteTransferDetails?.status}
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
                        Document Date
                      </Label>
                      <span
                        className={`${
                          isEdit ? "bg-Gray-50 text-Gray-300" : "text-Gray-500"
                        } p-2 rounded-CS border w-full inline-flex border-Secondary-500 font-medium text-base leading-CS h-10`}>
                        {siteTransferDetails?.docDate &&
                          format(new Date(siteTransferDetails.docDate), "PP")}
                      </span>
                    </div>
                    <FormField
                      control={form.control}
                      name="docDueDate"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-Gray-500   ml-2 font-bold text-sm leading-CS h-[1.1875rem]">
                            Delivery Date
                          </FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  disabled={isPending || !isEdit}
                                  className={cn(
                                    "w-full pl-3 text-left disabled:opacity-100 rounded-2xl border border-Secondary-500  font-normal",
                                    !field.value && ""
                                  )}>
                                  {field.value ? (
                                    format(field.value, "PP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <FontAwesomeIcon
                                    icon={faCalendarCirclePlus}
                                    className="ml-auto text-Primary-600 h-5 w-5"
                                  />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0 "
                              align="start">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date < new Date("1900-01-01")
                                }
                              />
                            </PopoverContent>
                          </Popover>
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
                        From
                      </Label>
                      <span
                        className={`${
                          isEdit ? "bg-Gray-50 text-Gray-300" : "text-Gray-500"
                        } p-2 rounded-CS border w-full inline-flex border-Secondary-500 font-medium text-base leading-CS h-10`}>
                        {siteTransferDetails?.from}
                      </span>
                    </div>

                    <FormField
                      control={form.control}
                      name="to"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-Gray-500   ml-2 font-bold text-sm leading-CS h-[1.1875rem]">
                            To
                          </FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                              disabled={isPending || !isEdit}>
                              <SelectTrigger className=" border w-full h-10  inline-flex p-2 disabled:opacity-100 border-Secondary-500 font-medium text-base leading-CS ">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                {dependencies?.sites?.map((whs) => (
                                  <SelectItem
                                    key={whs.warehouseCode}
                                    value={whs.warehouseCode}>
                                    {whs.warehouseName +
                                      "-" +
                                      whs.warehouseCode}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                        </FormItem>
                      )}
                    />
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
                        <th className="pr-6 pl-4 py-3">Status</th>
                        <th className="pr-6 pl-4 py-3 rounded-tr-xl">Remove</th>
                      </tr>
                    </thead>
                    <tbody className=" [&_tr:last-child]:border-0 ">
                      {docLine.map((item) => (
                        <tr
                          key={item.line}
                          className="text-RT-Black  text-nowrap font-medium text-base/CS border-b-1 border-Primary-15 transition duration-300 ease-in-out hover:bg-gray-100 cursor-pointer">
                          <td className="pr-6 pl-4 py-3">{item.itemCode}</td>
                          <td className="pr-6 pl-4 py-3">{item.name}</td>
                          <td className="pr-6 pl-4 py-3">{item.uomCode}</td>
                          <td className="pr-6 pl-4 py-3">
                            <Input
                              value={item.quantity}
                              step="0.25"
                              type="number"
                              disabled={!isEdit || item.status === "C"}
                              key={item.line}
                              onChange={(e) => {
                                updateLineQuantity(item.line, e.target.value);
                              }}
                              className="w-[5rem] p-0 h-1/2 border-0 text-center rounded-lg"
                            />
                          </td>
                          <td className="pr-6 pl-4 py-3">{item.barcode}</td>
                          <td className="pr-6 pl-4 py-3">{item.status}</td>
                          <td className="pr-6 pl-4 py-3">
                            <Button
                              disabled={!isEdit || item.status === "C"}
                              onClick={() => {
                                setdocLine(
                                  docLine.filter((value) => {
                                    if (docLine.length === 1) return value;
                                    else return value.line != item.line;
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
                      {isEdit && (
                        <tr className="text-RT-Black font-normal text-base border-b-2 border-Primary-15 transition duration-300 hover:rounded-bl-2xl ease-in-out hover:bg-gray-100 cursor-pointer">
                          <td className="pr-6 pl-4 py-3 ">
                            <ItemSelect setState={setdocLine} state={docLine} />
                          </td>
                        </tr>
                      )}
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
                        {siteTransferDetails?.createdAt &&
                          format(new Date(siteTransferDetails.createdAt), "PP")}
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
                        {siteTransferDetails?.updateAt &&
                          format(new Date(siteTransferDetails.updateAt), "PP")}
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
                  disabled={isFetching || isClosing}
                  onClick={() => {
                    setDialogOpen(true);
                    setDialogConfig({
                      title: "Cancel Site Transfer",
                      description:
                        "Are you sure you want to cancel this Site Transfer? ",
                      icon: faSquareExclamation,
                      iconColor: "text-Primary-400",
                      variant: "danger",
                      type: "Confirmation",
                      confirm: () => cancelTransfer(),
                      confirmText: "Cancel Site Transfer",
                    });
                  }}
                  className=" bg-transparent w-[10rem] rounded-2xl font-bold text-Error-600 border border-Secondary-500  ">
                  Cancel Transfer
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
                  onClick={() => {
                    setDialogOpen(true);
                    setDialogConfig({
                      title: "Edit Site Transfer",
                      description:
                        "Are you sure you want to edit this Site Transfer? ",
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

export default SiteTransferDetails;
