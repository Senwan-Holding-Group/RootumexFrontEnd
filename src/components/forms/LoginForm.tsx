import { useForm } from "react-hook-form";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginFormSchema, LoginRequest } from "@/lib/formsValidation";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { useAuth } from "@/api/Auth/useAuth";
import { login } from "@/api/client";
import { useNavigate } from "react-router-dom";
import { faSpinner, faLockKeyhole } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const LoginForm = () => {
  const { setToken } = useAuth();
  const navigate = useNavigate();


  const form = useForm<LoginRequest>({
    resolver: zodResolver(loginFormSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const onSubmit = async (values: LoginRequest) => {
    return login(values, setToken, navigate, form);
  };

  return (
    <div className="bg-Secondary-50 shadow h-[33.125rem] drop-shadow-2xl  drop-shadow-[#8D8D8E24] w-[25rem] rounded-CS px-6 py-[2.875rem]">
      <Form {...form}>
        
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col justify-between h-full">
          <div className="space-y-12">
            <div className="flex justify-center">
              <Label className="font-[900] h-[1.563rem] text-4xl  text-Primary-500 leading-CS">
                ROOTUMEX
              </Label>
            </div>
            <div className="flex flex-col gap-y-6">
              <Label className="text-sm pl-1 leading-CS font-bold text-Gray-500 ">
                Welcome to Rootumex WM app
              </Label>
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-y-2">
                                     
                    <FormLabel className="text-sm pl-2 leading-CS flex text-RT-Black gap-x-1 font-bold ">
                      Username
                      <FormMessage />

                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Write your Username"
                        className="h-10  w-[22rem] border border-Secondary-500 p-2 rounded-2xl"
                        {...field}
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem className="flex flex-col gap-y-2">
                    <FormLabel className="flex pl-2  leading-CS text-RT-Black text-sm font-bold">
                      Password
                      <FormMessage />
                    </FormLabel>
                    <FormControl>
                      <div className="flex relative ">
                        <Input
                          type="password"
                          placeholder="Write your Password"
                          className="h-10 mb-6 w-[22rem] border  border-Secondary-500 p-2 rounded-2xl"
                          {...field}
                        />
                        <span className="absolute right-4 flex text-Primary-400 items-center justify-center  top-0.5 size-9  ">
                          <FontAwesomeIcon icon={faLockKeyhole} />
                        </span>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
          {form.formState.errors.root && (
            <div className="text-center w-full text-sm h-10 rounded-lg border text-Error-600 overflow-scroll border-Error-500 bg-Error-100  p-2">
              {form.formState.errors.root.message}
            </div>
          )}
          <Button
            disabled={form.formState.isSubmitting}
            className="w-[22rem] disabled:opacity-50  hover:bg-Primary-600 rounded-2xl bg-Primary-500">
            {form.formState.isSubmitting && (
              <FontAwesomeIcon className="" icon={faSpinner} spin />
            )}
            Login
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default LoginForm;
