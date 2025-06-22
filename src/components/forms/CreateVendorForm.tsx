/* eslint-disable @typescript-eslint/no-explicit-any */
import { postVendor } from "@/api/client";
import { useStateContext } from "@/context/useStateContext";
import { CreateVendorRequest, CreateVendorSchema } from "@/lib/formsValidation";
import {
  faSpinner,
  faSquareCheck,
  faSquareExclamation,
} from "@fortawesome/pro-regular-svg-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import Loader from "../ui/Loader";
import { DialogClose } from "../ui/dialog";
import { Button } from "../ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

const CreateVendorForm = () => {
  const queryClient = useQueryClient();
  const { setDialogOpen, setDialogConfig } = useStateContext();

  const form = useForm<CreateVendorRequest>({
    resolver: zodResolver(CreateVendorSchema),
    defaultValues: {
      contactNumber: "",
      vendorAddress: "",
      vendorName: "",
      vendorNameEng: "",
      vendorType: "",
    },
  });
  const { mutate: createVendor, isPending } = useMutation({
    mutationFn: (data: CreateVendorRequest) => postVendor("/vendor", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["vendorList"] });
      form.reset();
      setDialogConfig({
        title: "Vendor created successfully!",
        description: "Your vendor is successfully created ",
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
        title: "Vendor not created",
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
  const onSubmit = async (values: CreateVendorRequest) => {
    createVendor(values);
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col w-full overflow-scroll  justify-between h-full">
        <Loader enable={isPending} />
        <div className="flex  p-4 gap-4">
          <div className="w-1/2 space-y-4">
            <FormField
              control={form.control}
              name="vendorName"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-Gray-500    ml-2 font-bold text-sm leading-CS h-[1.1875rem]">
                    Name Ar.
                    <FormMessage />
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="Name Ar."
                      {...field}
                      className=" border w-full inline-flex disabled:bg-Gray-50 disabled:text-Gray-300 border-Secondary-500 font-medium text-base leading-CS  "
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="vendorNameEng"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-Gray-500    ml-2 font-bold text-sm leading-CS h-[1.1875rem]">
                    Name En.
                    <FormMessage />
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="Name En."
                      {...field}
                      className=" border w-full inline-flex disabled:bg-Gray-50 disabled:text-Gray-300 border-Secondary-500 font-medium text-base leading-CS  "
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
                  <FormLabel className="text-Gray-500    ml-2 font-bold text-sm leading-CS h-[1.1875rem]">
                    Contact Number
                    <FormMessage />
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="Contact Number"
                      {...field}
                      className=" border w-full inline-flex disabled:bg-Gray-50 disabled:text-Gray-300 border-Secondary-500 font-medium text-base leading-CS  "
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <div className="w-1/2 space-y-4">
            <FormField
              control={form.control}
              name="vendorAddress"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-Gray-500    ml-2 font-bold text-sm leading-CS h-[1.1875rem]">
                    Vendor Address
                    <FormMessage />
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="Vendor Address"
                      {...field}
                      className=" border w-full inline-flex disabled:bg-Gray-50 disabled:text-Gray-300 border-Secondary-500 font-medium text-base leading-CS  "
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
                      disabled={isPending}>
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
      </form>
    </Form>
  );
};

export default CreateVendorForm;
