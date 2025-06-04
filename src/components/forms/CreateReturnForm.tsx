/* eslint-disable @typescript-eslint/no-explicit-any */
import { postReturn } from "@/api/client";
import { CreatePORequest, CreateReturnRequest, CreateReturnSchema } from "@/lib/formsValidation";
import { Dependencies, Docline } from "@/lib/types";
import { calculateLineTotal, cn, numberWithCommas } from "@/lib/utils";
import { faCalendarCirclePlus, faSpinner, faSquareCheck, faSquareExclamation, faTrashCan } from "@fortawesome/pro-regular-svg-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { useOutletContext } from "react-router-dom";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../ui/form";
import Loader from "../ui/Loader";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Button } from "../ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Calendar } from "../calendar";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Label } from "../ui/label";
import ItemSelect from "../ItemsSelect";
import { DialogClose } from "../ui/dialog";
import ConfirmationDialog from "../ConfirmationDialog";

const CreateReturnForm = () => {
    const queryClient = useQueryClient();
  const dependencies = useOutletContext<Dependencies>();
  const [docLine, setdocLine] = useState<Docline[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogConfig, setDialogConfig] = useState({
    title: "",
    description: "",
    icon: faSquareCheck,
    iconColor: "text-Success-600",
    variant: "success" as "success" | "danger",
  });

  const form = useForm<CreateReturnRequest>({
    resolver: zodResolver(CreateReturnSchema),
    defaultValues: {
      vendorCode: "",
      vendorName: "",
      vendorInvoiceNumber: "",
      projectCode: "",
      warehouseCode: "",
      remark: "",
      docDate: new Date(),
      docDueDate: new Date(),
      poLines: [],
    },
  });
  const { mutate: createReturn, isPending } = useMutation({
    mutationFn: (data: CreateReturnRequest) => postReturn("/return_request", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["returnList"] });
      form.reset();
      setdocLine([]);
      setDialogConfig({
        title: "Return created successfully!",
        description: "Your return request is successfully created ",
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
        title: "Return request not created",
        description: errorMessage,
        icon: faSquareExclamation,
        iconColor: "text-Error-600",
        variant: "danger",
      });
      setDialogOpen(true);
    },
  });
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
  const onSubmit = async (values: CreatePORequest) => {
    const newValues = {
      ...values,
      docDueDate: new Date(format(values.docDueDate, "yyyy-MM-dd")),
      vendorName:
        dependencies.vendors.find(
          (vendor) => vendor.vendorCode === values.vendorCode
        )?.vendorName || "",
      poLines: docLine.map((value) => ({
        itemCode: value.itemCode,
        description: value.itemDescription,
        price: value.price,
        uomCode: value.uom,
        quantity: value.quantity,
      })),
    };
    createReturn(newValues);
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col w-full overflow-scroll  justify-between h-full">
        <Loader enable={isPending} />
        <div className="flex w-full flex-col  overflow-scroll   h-full ">
          <div className="flex p-4 gap-4 min-w-[80rem]">
            <div className="w-1/3 space-y-4">
              <FormField
                control={form.control}
                name="docDate"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-Gray-500  ml-2 font-bold text-sm leading-CS h-[1.1875rem]">
                      Document date
                      <FormMessage />
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left rounded-2xl font-normal",
                              !field.value && "text-muted-foreground"
                            )}>
                            {field.value ? (
                              format(field.value, "PP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <FontAwesomeIcon
                              icon={faCalendarCirclePlus}
                              className="ml-auto text-Primary-600 h-5 w-5 "
                            />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0 " align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                        />
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="docDueDate"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-Gray-500   ml-2 font-bold text-sm leading-CS h-[1.1875rem]">
                      Delivery Date
                      <FormMessage />
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left rounded-2xl  font-normal",
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
                      <PopoverContent className="w-auto p-0 " align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date("1900-01-01")}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="remark"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-Gray-500   ml-2 font-bold text-sm leading-CS h-[1.1875rem]">
                      Comment
                      <FormMessage />
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        placeholder="comment"
                        {...field}
                        className="border w-full inline-flex disabled:bg-Gray-50 disabled:text-Gray-300 border-Secondary-500 font-medium text-base leading-CS"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="w-1/3 space-y-4">
              <FormField
                control={form.control}
                name="vendorCode"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-Gray-500   ml-2 font-bold text-sm leading-CS h-[1.1875rem]">
                      Vendor
                      <FormMessage />
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={isPending}>
                        <SelectTrigger className=" border w-full h-10  inline-flex p-2 disabled:bg-Gray-50 disabled:text-Gray-300 border-Secondary-500 font-medium text-base leading-CS ">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {dependencies?.vendors.map((vendor) => (
                            <SelectItem
                              key={vendor.vendorCode}
                              value={vendor.vendorCode}>
                              {vendor.vendorName + "-" + vendor.vendorCode}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="vendorInvoiceNumber"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-Gray-500   ml-2 font-bold text-sm leading-CS h-[1.1875rem]">
                      Vendor Invoice Number
                      <FormMessage />
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        placeholder="Vendor Invoice Number"
                        {...field}
                        className="border w-full inline-flex disabled:bg-Gray-50 disabled:text-Gray-300 border-Secondary-500 font-medium text-base leading-CS"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="warehouseCode"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-Gray-500   ml-2 font-bold text-sm leading-CS h-[1.1875rem]">
                      Warehouse
                      <FormMessage />
                    </FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={isPending}>
                        <SelectTrigger className=" border w-full h-10  inline-flex p-2 disabled:bg-Gray-50 disabled:text-Gray-300 border-Secondary-500 font-medium text-base leading-CS ">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {dependencies?.warehouses.map((whs) => (
                            <SelectItem
                              key={whs.warehouseCode}
                              value={whs.warehouseCode}>
                              {whs.warehouseName + "-" + whs.warehouseCode}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <div className="w-1/3 space-y-4">
              <FormField
                control={form.control}
                name="projectCode"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-Gray-500   ml-2 font-bold text-sm leading-CS h-[1.1875rem]">
                      Project name
                      <FormMessage />
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isPending}
                        placeholder="Project name"
                        {...field}
                        className="border w-full inline-flex disabled:bg-Gray-50 disabled:text-Gray-300 border-Secondary-500 font-medium text-base leading-CS"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
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
            </div>
          </div>
          <div className="space-y-4  p-4 min-w-[80rem]">
            <Label className="text-Gray-500 font-bold text-lg leading-CS h-[1.5625rem]">
              Return Items
            </Label>
            <div className="border-2 overflow-scroll   border-Primary-5 rounded-2xl">
              <table className="w-full  caption-bottom ">
                <thead className="sticky top-0 w-full bg-Primary-5">
                  <tr className="text-nowrap font-semibold  text-base/CS   text-left text-Primary-400">
                    <th className="pr-6 pl-4 py-3  rounded-tl-xl">Code</th>
                    <th className="pr-6 pl-4 py-3">Name</th>
                    <th className="pr-6 pl-4 py-3">Quantity </th>
                    <th className="pr-6 pl-4 py-3">Price </th>
                    <th className="pr-6 pl-4 py-3">UOM </th>
                    <th className="pr-6 pl-4 py-3">Barcode </th>
                    <th className="pr-6 pl-4 py-3">Total price </th>
                    <th className="pr-6 pl-4 py-3 rounded-tr-xl">Remove</th>
                  </tr>
                </thead>
                <tbody className=" [&_tr:last-child]:border-0 ">
                  {docLine?.map((item, i) => (
                    <tr
                      key={i}
                      className="text-RT-Black  text-nowrap font-medium text-base/CS border-b-1 border-Primary-15 transition duration-300 ease-in-out hover:bg-gray-100 cursor-pointer">
                      <td className="pr-6 pl-4 py-3">{item.itemCode}</td>
                      <td className="pr-6 pl-4 py-3">{item.name}</td>
                      <td className="pr-6 pl-4 py-3">
                        <Input
                          value={item.quantity}
                          step="0.25"
                          type="number"
                          key={i}
                          onChange={(e) => {
                            updateLineQuantity(item.line, e.target.value);
                          }}
                          className="w-[5rem] p-0 h-1/2 border-0 text-center rounded-lg"
                        />
                      </td>
                      <td className="pr-6 pl-4 py-3">
                        {numberWithCommas(item.price)}
                      </td>
                      <td className="pr-6 pl-4 py-3">{item.uom}</td>
                      <td className="pr-6 pl-4 py-3">{item.barcode}</td>
                      <td className="pr-6 pl-4 py-3">
                        {numberWithCommas(item.total_price)} LYD
                      </td>
                      <td className="pr-6 pl-4 py-3">
                        <Button
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
                  <tr className="text-RT-Black font-normal text-base border-b-2 border-Primary-15 transition duration-300 hover:rounded-bl-2xl ease-in-out hover:bg-gray-100 cursor-pointer">
                    <td className="pr-6 pl-4 py-3 ">
                      <ItemSelect setState={setdocLine} state={docLine} />
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
        <div className=" bg-Primary-5 w-full rounded-bl-2xl px-6 py-4  rounded-br-CS  border-t flex justify-center sm:justify-end flex-row gap-4 h-[4.5rem] border-Primary-15">
          <DialogClose asChild>
            <Button
              disabled={isPending}
              onClick={() => {
                form.reset();
              }}
              className="bg-white w-[11.25rem] border rounded-2xl disabled:text-Gray-300  text-Primary-500 leading-CS font-bold text-base"
              type="button">
              Close
            </Button>
          </DialogClose>
          <Button
            disabled={isPending}
            className="bg-Primary-500 w-[11.25rem] disabled:bg-Gray-50  disabled:text-Gray-300 rounded-2xl leading-CS font-bold text-base"
            type="submit">
            {isPending && (
              <FontAwesomeIcon className="" icon={faSpinner} spin />
            )}
            Confirm
          </Button>
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
      </form>
    </Form>
  );
  
}

export default CreateReturnForm