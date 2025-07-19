import { getVendorDetailsQueryOptions, useUpdateVendor } from "@/api/query";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStateContext } from "@/context/useStateContext";
import { EditVendorRequest, EditVendorSchema } from "@/lib/formsValidation";
import {
  faChevronLeft,
  faSpinner,
  faSquareExclamation,
} from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { zodResolver } from "@hookform/resolvers/zod";
import {  useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useParams } from "react-router-dom";

const VendorsDetails = () => {
  const { id } = useParams();
  const { setError, setDialogConfig, setDialogOpen } = useStateContext();
  const [isEdit, setisEdit] = useState(false);
  const form = useForm<EditVendorRequest>({
    resolver: zodResolver(EditVendorSchema),
    defaultValues: {
      vendorAddress: "",
      vendorName: "",
      vendorType: "",
      vendorNameEng: "",
      contactNumber: "",
      status: "",
    },
  });
  const {
    data: vendorDetails,
    isFetching,
    isError,
  } = useQuery(getVendorDetailsQueryOptions(setError,id));

  useEffect(() => {
    if (vendorDetails) {
      form.reset({
        vendorAddress: vendorDetails?.vendorAddress,
        vendorName: vendorDetails?.vendorName,
        vendorType: vendorDetails?.vendorType,
        vendorNameEng: vendorDetails?.vendorNameEng,
        contactNumber: vendorDetails?.contactNumber,
        status: vendorDetails?.status,
      });
    }
  }, [form, vendorDetails]);

  const { mutate: editVendor, isPending } = useUpdateVendor(id)
  const onSubmit = async (values: EditVendorRequest) => {
    editVendor(values);
  };
  return (
    <Form {...form}>
      <div className=" h-[calc(100dvh-6.875rem)] overflow-auto  ">
        <Loader enable={isPending} />
        <div className=" h-full bg-white border border-Primary-15 rounded-CS flex flex-col justify-between">
          <DataRenderer isLoading={isFetching} isError={isError}>
            <div className="px-6 py-4 flex gap-x-6 items-center h-[4.5rem] border-b border-Primary-15">
              <Link
                to={"/rootumex/vendors"}
                className="size-10 border flex items-center   cursor-pointer border-Secondary-500 rounded-CS p-2">
                <FontAwesomeIcon
                  className="size-6 text-Primary-500"
                  icon={faChevronLeft}
                />
              </Link>
              <span className="text-2xl leading-CS  font-bold  text-RT-Black">
                {vendorDetails?.vendorCode}
              </span>
            </div>
            <div className="flex-1 w-full overflow-scroll p-4 flex flex-col gap-y-10 ">
              <div className="space-y-4 min-w-[80rem]">
                <Label className="text-Gray-500 font-bold text-lg leading-CS h-[1.5625rem]">
                  Vendor details
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
                        {vendorDetails?.vendorCode}
                      </span>
                    </div>

                    <FormField
                      control={form.control}
                      name="vendorNameEng"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-Gray-500   ml-2 font-bold text-sm leading-CS h-[1.1875rem]">
                            Name En.
                          </FormLabel>
                          <FormControl>
                            <Input
                              disabled={isPending || !isEdit}
                              placeholder="Name En."
                              {...field}
                              className="border w-full inline-flex disabled:opacity-100 border-Secondary-500 font-medium text-base leading-CS"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="vendorType"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-Gray-500   ml-2 font-bold text-sm leading-CS h-[1.1875rem]">
                            Type
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
                                <SelectItem key={"Local"} value={"Local"}>
                                  Local
                                </SelectItem>
                                <SelectItem
                                  key={"International"}
                                  value={"International"}>
                                  International
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className=" w-1/3 space-y-4">
                    <FormField
                      control={form.control}
                      name="vendorName"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-Gray-500   ml-2 font-bold text-sm leading-CS h-[1.1875rem]">
                            Name Ar.
                          </FormLabel>
                          <FormControl>
                            <Input
                              disabled={isPending || !isEdit}
                              placeholder="Name Ar."
                              {...field}
                              className="border w-full inline-flex disabled:opacity-100 border-Secondary-500 font-medium text-base leading-CS"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="contactNumber"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-Gray-500   ml-2 font-bold text-sm leading-CS h-[1.1875rem]">
                            Contact Number
                          </FormLabel>
                          <FormControl>
                            <Input
                              disabled={isPending || !isEdit}
                              placeholder="Contact Number"
                              {...field}
                              className="border w-full inline-flex disabled:opacity-100 border-Secondary-500 font-medium text-base leading-CS"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className=" w-1/3 space-y-4">
                    <FormField
                      control={form.control}
                      name="vendorAddress"
                      render={({ field }) => (
                        <FormItem className="space-y-1">
                          <FormLabel className="text-Gray-500   ml-2 font-bold text-sm leading-CS h-[1.1875rem]">
                            Address
                          </FormLabel>
                          <FormControl>
                            <Input
                              disabled={isPending || !isEdit}
                              placeholder="Address"
                              {...field}
                              className="border w-full inline-flex disabled:opacity-100 border-Secondary-500 font-medium text-base leading-CS"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
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
                              onValueChange={field.onChange}
                              value={field.value}
                              disabled={isPending || !isEdit}>
                              <SelectTrigger className=" border w-full h-10  inline-flex p-2 disabled:opacity-100 border-Secondary-500 font-medium text-base leading-CS ">
                                <SelectValue placeholder="Select" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem key={"O"} value={"O"}>
                                  Active
                                </SelectItem>
                                <SelectItem
                                  key={"D"}
                                  value={"D"}>
                                  InActive
                                </SelectItem>
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
                      title: "Edit Vendor",
                      description:
                        "Are you sure you want to edit this Vendor? ",
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

export default VendorsDetails;
