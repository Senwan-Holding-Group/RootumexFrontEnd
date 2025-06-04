/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import Loader from "../ui/Loader";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateItemRequest, CreateItemSchema } from "@/lib/formsValidation";
import { DialogClose } from "../ui/dialog";
import { Button } from "../ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpinner,
  faSquareCheck,
  faSquareExclamation,
} from "@fortawesome/pro-regular-svg-icons";
import { postItem } from "@/api/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { useState } from "react";
import ConfirmationDialog from "../ConfirmationDialog";
import { useOutletContext } from "react-router-dom";
import { Dependencies } from "@/lib/types";

const CreateItemForm = () => {
  const queryClient = useQueryClient();
  const dependencies = useOutletContext<Dependencies>();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogConfig, setDialogConfig] = useState({
    title: "",
    description: "",
    icon: faSquareCheck,
    iconColor: "text-Success-600",
    variant: "success" as "success" | "danger",
  });

  const form = useForm<CreateItemRequest>({
    resolver: zodResolver(CreateItemSchema),
    defaultValues: {
      departmentCode: "",
      familyCode: "",
      sectionCode: "",
      subFamilyCode: "",
      uomCode: "",
      uomGroup: "",
      itemName: "",
      itemDescription: "",
      itemPrice: [
        {
          priceListId: 1,
          price: 0,
          uomCode: "",
        },
      ],
    },
  });
  const { mutate: createItem, isPending } = useMutation({
    mutationFn: (data: CreateItemRequest) => postItem("/item", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["itemList"] });
      form.reset();
      setDialogConfig({
        title: "Item created successfully!",
        description: "Your item is successfully created ",
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
        title: "Item not created",
        description: errorMessage,
        icon: faSquareExclamation,
        iconColor: "text-Error-600",
        variant: "danger",
      });
      setDialogOpen(true);
    },
  });
  const onSubmit = async (values: CreateItemRequest) => {
    createItem(values);
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
              name="itemName"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-Gray-500    ml-2 font-bold text-sm leading-CS h-[1.1875rem]">
                    Item Name
                    <FormMessage />
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="Item Name"
                      {...field}
                      className=" border w-full inline-flex disabled:bg-Gray-50 disabled:text-Gray-300 border-Secondary-500 font-medium text-base leading-CS  "
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="itemDescription"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-Gray-500   ml-2 font-bold text-sm leading-CS h-[1.1875rem]">
                    Item Description
                    <FormMessage />
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="Item Description"
                      {...field}
                      className=" border w-full inline-flex disabled:bg-Gray-50 disabled:text-Gray-300 border-Secondary-500 font-medium text-base leading-CS  "
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="itemPrice.0.price"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-Gray-500   ml-2 font-bold text-sm leading-CS h-[1.1875rem]">
                    Item Price
                    <FormMessage />
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.5"
                      min="0"
                      disabled={isPending}
                      placeholder="0.00 LYD"
                      {...field}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value) || 0)
                      }
                      className="border w-full inline-flex disabled:bg-Gray-50 disabled:text-Gray-300 border-Secondary-500 font-medium text-base leading-CS"
                    />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="departmentCode"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-Gray-500   ml-2 font-bold text-sm leading-CS h-[1.1875rem]">
                    Department
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
                        {dependencies?.departments.map((dep) => (
                          <SelectItem
                            key={dep.departmentCode}
                            value={dep.departmentCode}>
                            {dep.departmentName + "-" + dep.departmentCode}
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
              name="sectionCode"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-Gray-500   ml-2 font-bold text-sm leading-CS h-[1.1875rem]">
                    Section
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
                </FormItem>
              )}
            />
          </div>
          <div className="w-1/2 space-y-4">
            <FormField
              control={form.control}
              name="familyCode"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-Gray-500   ml-2 font-bold text-sm leading-CS h-[1.1875rem]">
                    Family
                    <FormMessage />
                  </FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={isPending}>
                      <SelectTrigger className=" border w-full h-10   inline-flex p-2 disabled:bg-Gray-50 disabled:text-Gray-300 border-Secondary-500 font-medium text-base leading-CS ">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        {dependencies?.families.map((family) => (
                          <SelectItem
                            key={family.familyCode}
                            value={family.familyCode}>
                            {family.familyName + "-" + family.familyCode}
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
              name="subFamilyCode"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-Gray-500   ml-2 font-bold text-sm leading-CS h-[1.1875rem]">
                    Sub family
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
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="uomCode"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-Gray-500   ml-2 font-bold text-sm leading-CS h-[1.1875rem]">
                    UoM
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
                        {dependencies?.uoms.map((uom) => (
                          <SelectItem key={uom.uomCode} value={uom.uomCode}>
                            {uom.uomName}
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
              name="uomGroup"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-Gray-500   ml-2 font-bold text-sm leading-CS h-[1.1875rem]">
                    UoM Group
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
                        {dependencies?.uom_groups.map((uomGroup) => (
                          <SelectItem
                            key={uomGroup.uomGroupCode}
                            value={uomGroup.uomGroupCode}>
                            {uomGroup.uomGroupName}
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
};

export default CreateItemForm;
