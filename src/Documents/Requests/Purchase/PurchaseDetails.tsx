import { useCancelPo, useUpdatePO } from "@/api/mutations";
import { getPODetailsQueryOptions } from "@/api/query";
import { Calendar } from "@/components/calendar";
import DataRenderer from "@/components/DataRenderer";
import ItemSelect from "@/components/ItemsSelect";
import POLayout from "@/components/Printlayout/POLayout";
import Print from "@/components/Printlayout/Print";
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
import { EditPORequest, EditPOSchema } from "@/lib/formsValidation";
import { Dependencies, Docline } from "@/lib/types";
import { calculateLineTotal, cn, numberWithCommas } from "@/lib/utils";
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
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useOutletContext, useParams } from "react-router-dom";

const PurchaseDetails = () => {
  const { id } = useParams();
  const { setDialogOpen, setDialogConfig } = useStateContext();
  const dependencies = useOutletContext<Dependencies>();
  const [docLine, setdocLine] = useState<Docline[]>([]);
  const [isEdit, setisEdit] = useState(false);
  const form = useForm<EditPORequest>({
    resolver: zodResolver(EditPOSchema),
    defaultValues: {
      warehouseCode: "",
      projectCode: "",
      remark: "",
      docDueDate: new Date(),
      poLines: [],
    },
  });
  const {
    data: poDetails,
    isFetching,
    isError,
    error,
  } = useQuery(getPODetailsQueryOptions(id));

  const calculateDocumentTotal = useCallback(() => {
    return docLine?.reduce((sum, line) => sum + (line.total_price || 0), 0);
  }, [docLine]);
  const documentTotal = calculateDocumentTotal();
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
          total_price: calculateLineTotal(quantity, value.price),
        };
      })
    );
  };
  useEffect(() => {
    if (poDetails) {
      form.reset({
        docDueDate: new Date(poDetails.docDueDate),
        warehouseCode: poDetails.warehouseCode,
        projectCode: poDetails.projectCode,
        remark: poDetails.remark,
        poLines: [],
      });
      const linesWithLineProperty =
        poDetails.poLines === null
          ? []
          : poDetails.poLines.map((item, index) => ({
              ...item,
              line: index + 1,
            }));

      setdocLine(linesWithLineProperty);
    }
  }, [form, poDetails]);

  const { mutate: editPO, isPending } = useUpdatePO(id);
  const { mutate: cancelPO, isPending: isClosing } = useCancelPo(id);

  const onSubmit = async (values: EditPORequest) => {
    const newValues = {
      ...values,
      docDueDate: new Date(format(values.docDueDate, "yyyy-MM-dd")),
      poLines: docLine
        .filter((value) => value.status === "O")
        .map((value) => ({
          itemCode: value.itemCode,
          description: value.description,
          price: value.price,
          uomCode: value.uom,
          quantity: value.quantity,
        })),
    };
    editPO(newValues);
  };
  return (
    <Form {...form}>
      <div className=" h-[calc(100dvh-12.25rem)] overflow-auto  ">
        <Loader enable={isPending || isClosing} />
        <div className=" h-full bg-white border border-Primary-15 rounded-CS flex flex-col justify-between">
          <DataRenderer isLoading={isFetching} isError={isError} error={error}>
            <div className="px-6 py-4 flex justify-between  h-[4.5rem] border-b border-Primary-15">
              <div className="flex gap-x-6 items-center">
                <Link
                  to={"/rootumex/documents/requests/purchase"}
                  className="size-10 border flex items-center   cursor-pointer border-Secondary-500 rounded-CS p-2">
                  <FontAwesomeIcon
                    className="size-6 text-Primary-500"
                    icon={faChevronLeft}
                  />
                </Link>
                <span className="text-2xl leading-CS  font-bold  text-RT-Black">
                  {poDetails?.code}
                </span>
              </div>
              <Print btnText={"PO"}>
                {poDetails && <POLayout data={poDetails} type="PO" />}
              </Print>
            </div>
            <div className="flex-1 w-full overflow-scroll p-4 flex flex-col gap-y-10 ">
              <div className="space-y-4 min-w-[80rem]">
                <Label className="text-Gray-500 font-bold text-lg leading-CS h-[1.5625rem]">
                  PO details
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
                        {poDetails?.code}
                      </span>
                    </div>
                    <div className="space-y-1  ">
                      <Label
                        className={`${
                          isEdit ? "text-Gray-300" : "text-Gray-500"
                        }  ml-2 font-bold text-sm leading-CS h-[1.1875rem]`}>
                        Vendor
                      </Label>
                      <span
                        className={`${
                          isEdit ? "bg-Gray-50 text-Gray-300" : "text-Gray-500"
                        } p-2 rounded-CS border w-full inline-flex border-Secondary-500 font-medium text-base leading-CS h-10 `}>
                        {poDetails?.vendorName}
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
                        {poDetails?.status}
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
                        {poDetails?.docDate &&
                          format(new Date(poDetails.docDate), "PP")}
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
                    <FormField
                      control={form.control}
                      name="warehouseCode"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-Gray-500   ml-2 font-bold text-sm leading-CS h-[1.1875rem]">
                            The received warehouse
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
                                {dependencies?.warehouses?.map((whs) => (
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
                  <div className=" w-1/3 space-y-4">
                    <div className="space-y-1  ">
                      <Label
                        className={`ml-2 font-bold text-sm text-Gray-500  leading-CS h-[1.1875rem]`}>
                        Document Total
                      </Label>
                      <span
                        className={`p-2 rounded-CS  bg-Primary-5 text-Primary-500 border w-full inline-flex border-Secondary-500 font-medium text-base leading-CS h-10`}>
                        {numberWithCommas(documentTotal)}
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
                    <FormField
                      control={form.control}
                      name="projectCode"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-Gray-500   ml-2 font-bold text-sm leading-CS h-[1.1875rem]">
                            Project name
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
                  PO Items
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
                          <td className="pr-6 pl-4 py-3">{item.uom}</td>
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
                          <td className="pr-6 pl-4 py-3">
                            {item.recieved_quantity}
                          </td>
                          <td className="pr-6 pl-4 py-3">{item.price}</td>
                          <td className="pr-6 pl-4 py-3">{item.total_price}</td>
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
                        {poDetails?.created_at &&
                          format(new Date(poDetails?.created_at), "PP")}
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
                        {poDetails?.updated_at &&
                          format(new Date(poDetails?.updated_at), "PP")}
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
                      title: "Cancel PO",
                      description: "Are you sure you want to cancel this PO? ",
                      icon: faSquareExclamation,
                      iconColor: "text-Primary-400",
                      variant: "danger",
                      type: "Confirmation",
                      confirm: () => cancelPO(),
                      confirmText: "Cancel PO",
                    });
                  }}
                  className=" bg-transparent w-[10rem] rounded-2xl font-bold text-Error-600 border border-Secondary-500  ">
                  Cancel PO
                </Button>
                <Button
                  disabled={isFetching || isClosing}
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
                  disabled={isPending || isClosing}
                  type="submit"
                  onClick={() => {
                    setDialogOpen(true);
                    setDialogConfig({
                      title: "Edit PO",
                      description: "Are you sure you want to edit this PO? ",
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

export default PurchaseDetails;
