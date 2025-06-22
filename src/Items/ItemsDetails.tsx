/* eslint-disable @typescript-eslint/no-explicit-any */
import { getItemDetails, putItem } from "@/api/client";
import DataRenderer from "@/components/DataRenderer";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  // FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Loader from "@/components/ui/Loader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStateContext } from "@/context/useStateContext";
import { EditItemRequest, EditItemSchema } from "@/lib/formsValidation";
import { Dependencies } from "@/lib/types";
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
import { Link, useOutletContext, useParams } from "react-router-dom";
const ItemsDetails = () => {
  const { id } = useParams();
  const { setError, setDialogConfig, setDialogOpen } = useStateContext();
  const queryClient = useQueryClient();
  const dependencies = useOutletContext<Dependencies>();

  const [isEdit, setisEdit] = useState(false);
  const {
    data: itemDetails,
    isFetching,
    isError,
  } = useQuery({
    queryKey: ["itemDetails", id],
    queryFn: () => getItemDetails(`/item/${id}`, setError),
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
  const form = useForm<EditItemRequest>({
    resolver: zodResolver(EditItemSchema),
    defaultValues: {
      name: "",
      description: "",
      department: "",
      section: "",
      family_code: "",
      sub_family_code: "",
      uom_code: "",
      uom_group: "",
      price: 0,
      status: true,
    },
  });
  useEffect(() => {
    if (itemDetails) {
      form.reset({
        name: itemDetails?.itemName,
        description: itemDetails?.itemDescription,
        department: itemDetails?.department,
        section: itemDetails?.section,
        family_code: itemDetails?.family,
        sub_family_code: itemDetails?.subFamily,
        uom_code: itemDetails?.uom,
        uom_group: itemDetails?.uomGroup,
        price: itemDetails?.price,
        status: itemDetails?.status,
      });
    }
  }, [form, itemDetails]);
  const { mutate: editItem, isPending } = useMutation({
    mutationFn: (data: EditItemRequest) => putItem(`/item/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["itemDetails"] });
      form.reset();
      setDialogConfig({
        title: "Item updated successfully!",
        description: "Your item is successfully updated ",
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
        title: "Item not updated",
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
  const onSubmit = async (values: EditItemRequest) => {
    editItem(values);
  };
  return (
    <Form {...form}>
      <div className=" h-[calc(100dvh-6.875rem)] overflow-auto  ">
        <Loader enable={isPending} />
        <div className=" h-full bg-white border border-Primary-15 rounded-CS flex flex-col justify-between">
          <DataRenderer isLoading={isFetching} isError={isError}>
            <div className="px-6 py-4 flex gap-x-6 items-center h-[4.5rem] border-b border-Primary-15">
              <Link
                to={"/rootumex/items"}
                className="size-10 border flex items-center   cursor-pointer border-Secondary-500 rounded-CS p-2">
                <FontAwesomeIcon
                  className="size-6 text-Primary-500"
                  icon={faChevronLeft}
                />
              </Link>
              <span className="text-2xl leading-CS  font-bold  text-RT-Black">
                {itemDetails?.itemCode}
              </span>
            </div>
            <div className="flex-1 w-full overflow-scroll p-4 flex flex-col gap-y-10 ">
              <div className="space-y-4 min-w-[80rem]">
                <Label className="text-Gray-500 font-bold text-lg leading-CS h-[1.5625rem]">
                  Item details
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
                        {itemDetails?.itemCode}
                      </span>
                    </div>
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-Gray-500   ml-2 font-bold text-sm leading-CS h-[1.1875rem]">
                            Name
                          </FormLabel>

                          <FormControl>
                            <Input
                              disabled={isPending || !isEdit}
                              placeholder="Item Description"
                              {...field}
                              className=" border w-full inline-flex disabled:opacity-100 border-Secondary-500 font-medium text-base leading-CS  "
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-Gray-500   ml-2 font-bold text-sm leading-CS h-[1.1875rem]">
                            Description
                          </FormLabel>

                          <FormControl>
                            <Input
                              disabled={isPending || !isEdit}
                              placeholder="Item Description"
                              {...field}
                              className=" border w-full inline-flex disabled:opacity-100 border-Secondary-500 font-medium text-base leading-CS  "
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="department"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-Gray-500 ml-2 font-bold text-sm leading-CS h-[1.1875rem]">
                            Section
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
                                {dependencies?.departments.map((dep) => (
                                  <SelectItem
                                    key={dep.departmentCode}
                                    value={dep.departmentCode}>
                                    {dep.departmentName +
                                      "-" +
                                      dep.departmentCode}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          {/* <FormMessage /> */}
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="section"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-Gray-500 ml-2 font-bold text-sm leading-CS h-[1.1875rem]">
                            Section
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
                                {dependencies?.sections.map((sec) => (
                                  <SelectItem
                                    key={sec.sectionCode}
                                    value={sec.sectionCode}>
                                    {sec.sectionName + "-" + sec.sectionCode}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          {/* <FormMessage /> */}
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className=" w-1/3 space-y-4">
                    <FormField
                      control={form.control}
                      name="family_code"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-Gray-500 ml-2 font-bold text-sm leading-CS h-[1.1875rem]">
                            Family
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
                                {dependencies?.families.map((fam) => (
                                  <SelectItem
                                    key={fam.familyCode}
                                    value={fam.familyCode}>
                                    {fam.familyName + "-" + fam.familyCode}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          {/* <FormMessage /> */}
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="sub_family_code"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-Gray-500 ml-2 font-bold text-sm leading-CS h-[1.1875rem]">
                            Sub Family
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
                                {dependencies?.sub_families.map((subFamily) => (
                                  <SelectItem
                                    key={subFamily.subFamilyCode}
                                    value={subFamily.subFamilyCode}>
                                    {subFamily.subFamilyName +
                                      "-" +
                                      subFamily.subFamilyCode}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          {/* <FormMessage /> */}
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="uom_code"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-Gray-500 ml-2 font-bold text-sm leading-CS h-[1.1875rem]">
                            UoM
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
                                {dependencies?.uoms.map((uom) => (
                                  <SelectItem
                                    key={uom.uomCode}
                                    value={uom.uomCode}>
                                    {uom.uomCode}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          {/* <FormMessage /> */}
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="uom_group"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-Gray-500 ml-2 font-bold text-sm leading-CS h-[1.1875rem]">
                            UOM group
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
                                {dependencies?.uom_groups.map((uomGroup) => (
                                  <SelectItem
                                    key={uomGroup.uomGroupCode}
                                    value={uomGroup.uomGroupCode}>
                                    {uomGroup.uomGroupCode}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          {/* <FormMessage /> */}
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-Gray-500   ml-2 font-bold text-sm leading-CS h-[1.1875rem]">
                            Item Price
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              step="0.5"
                              min="0"
                              disabled={isPending || !isEdit}
                              placeholder="0.00 LYD"
                              {...field}
                              onChange={(e) =>
                                field.onChange(parseFloat(e.target.value) || 0)
                              }
                              className="border w-full inline-flex disabled:opacity-100 border-Secondary-500 font-medium text-base leading-CS"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className=" w-1/3 space-y-4">
                    <div className="space-y-1  ">
                      <Label className="text-Gray-500 ml-2 font-bold text-sm leading-CS h-[1.1875rem]">
                        Total Quantity
                      </Label>
                      <span className="p-2 rounded-CS border w-full inline-flex border-Secondary-500 font-medium text-base leading-CS h-10 ">
                        {itemDetails?.total_quantity}
                      </span>
                    </div>
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-Gray-500   ml-2 font-bold text-sm leading-CS h-[1.1875rem]">
                            Status
                          </FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={(val) =>
                                field.onChange(val === "true")
                              }
                              value={String(field.value)}
                              disabled={isPending || !isEdit}>
                              <SelectTrigger className=" border w-full h-10  inline-flex p-2 disabled:opacity-100 border-Secondary-500 font-medium text-base leading-CS ">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem key={"active"} value="true">
                                  Active
                                </SelectItem>
                                <SelectItem key={"inactive"} value="false">
                                  InActive
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <div className="space-y-1  ">
                      <Label className="text-Gray-500 ml-2 font-bold text-sm leading-CS h-[1.1875rem]">
                        Barcode
                      </Label>
                      <span className="p-2 rounded-CS border w-full inline-flex border-Secondary-500 font-medium text-base leading-CS h-10 ">
                        {itemDetails?.barcode}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="space-y-4 min-w-[80rem]">
                <Label className="text-Gray-500 font-bold text-lg leading-CS h-[1.5625rem]">
                  Item Location
                </Label>
                <div className="border-2  border-Primary-5 rounded-2xl">
                  <table className="w-full  caption-bottom ">
                    <thead className="sticky top-0 w-full bg-Primary-5">
                      <tr className="text-nowrap font-semibold  text-base/CS   text-left text-Primary-400">
                        <th className="pr-6 pl-4 py-3  rounded-tl-xl">
                          Quantity
                        </th>
                        <th className="pr-6 pl-4 py-3">Project Name</th>
                        <th className="pr-6 pl-4 py-3">Warehouse</th>
                        <th className="pr-6 pl-4 py-3 rounded-tr-xl">
                          Location
                        </th>
                      </tr>
                    </thead>
                    <tbody className=" [&_tr:last-child]:border-0 ">
                      <tr className="text-RT-Black  text-nowrap font-medium text-base/CS border-b-1 border-Primary-15 transition duration-300 ease-in-out hover:bg-gray-100 cursor-pointer">
                        <td className="pr-6 pl-4 py-3">560</td>
                        <td className="pr-6 pl-4 py-3">General</td>
                        <td className="pr-6 pl-4 py-3">MMS</td>
                        <td className="pr-6 pl-4 py-3">
                          SK02-ZN01-RK03-RO4-C02R04
                        </td>
                      </tr>
                      <tr className="text-RT-Black  text-nowrap font-medium text-base/CS border-b-1 border-Primary-15 transition duration-300 ease-in-out hover:bg-gray-100 cursor-pointer">
                        <td className="pr-6 pl-4 py-3">780</td>
                        <td className="pr-6 pl-4 py-3">General</td>
                        <td className="pr-6 pl-4 py-3">MMF</td>
                        <td className="pr-6 pl-4 py-3">
                          SK02-ZN01-RK08-R08-C07R08
                        </td>
                      </tr>
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
                        {itemDetails?.created_at &&
                          format(new Date(itemDetails?.created_at), "PP")}
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
                        {itemDetails?.updated_at &&
                          format(new Date(itemDetails?.updated_at), "PP")}
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
                  Delete
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
                      title: "Edit Item",
                      description: "Are you sure you want to edit this Item? ",
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

export default ItemsDetails;
