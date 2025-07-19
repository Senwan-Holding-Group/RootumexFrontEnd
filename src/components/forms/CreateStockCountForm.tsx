import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button } from "../ui/button";
import { DialogClose } from "../ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import Loader from "../ui/Loader";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  faCalendarCirclePlus,
  faSpinner,
} from "@fortawesome/pro-regular-svg-icons";
import { useOutletContext } from "react-router-dom";
import { Dependencies } from "@/lib/types";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  CreateStockCount,
  CreateStockCountSchema,
} from "@/lib/formsValidation";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { format } from "date-fns";
import { Calendar } from "../calendar";
import { cn } from "@/lib/utils";
import { useCreateStockCount } from "@/api/query";

const CreateStockCountForm = () => {
  const dependencies = useOutletContext<Dependencies>();
  const form = useForm<CreateStockCount>({
    resolver: zodResolver(CreateStockCountSchema),
    defaultValues: {
      warehouse_code: "",
      batch: "",
      remark: "",
    },
  });
  const { mutate: createStockCount, isPending } = useCreateStockCount(form);
  const onSubmit = async (values: CreateStockCount) => {
    createStockCount(values);
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
              name="remark"
              render={({ field }) => (
                <FormItem className="space-y-1">
                  <FormLabel className="text-Gray-500    ml-2 font-bold text-sm leading-CS h-[1.1875rem]">
                    Comment
                    <FormMessage />
                  </FormLabel>
                  <FormControl>
                    <Input
                      disabled={isPending}
                      placeholder="Comment"
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
              name="warehouse_code"
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
            <FormField
              control={form.control}
              name="batch"
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

export default CreateStockCountForm;
