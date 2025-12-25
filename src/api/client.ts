/* eslint-disable @typescript-eslint/no-explicit-any */
import { NavigateFunction } from "react-router-dom";
import { UseFormReturn } from "react-hook-form";
import secureLocalStorage from "react-secure-storage";
import { LoginRequest } from "@/lib/formsValidation";
import api from ".";

export const fetchAll = async <T>(
  url: string,
  setTotalPage?: React.Dispatch<React.SetStateAction<number>>
): Promise<T[]> => {
  const res = await api.get(url);
  if (setTotalPage && res.data.meta?.total_pages) {
    setTotalPage(res.data.meta.total_pages);
  }
  return (res.data.data ? res.data.data : res.data) as T[];
};
export const fetchById = async <T>(url: string): Promise<T> => {
  const res = await api.get(url);
  return (res.data.data ? res.data.data[0] : res.data) ;
}; 
export const createResource = async <T>(url: string, data: T): Promise<any> => {
  const res = await api.post(url, data);
  return res.data;
};
export const updateResource = async <T>(url: string, data: T): Promise<any> => {
  const res = await api.patch(url, data);
  return res.data;
};
export const performAction = async (url: string): Promise<any> => {
  const res = await api.post(url);
  return res.data;
};
export const login = async (
  data: LoginRequest,
  setToken: React.Dispatch<React.SetStateAction<string | null | undefined>>,
  navigate: NavigateFunction,
  form: UseFormReturn<LoginRequest>
) => {
  try {
    const res = await api.post("/login", data);
    setToken(res.data.access_token);
    secureLocalStorage.setItem("token", res.data.access_token);
    navigate("/rootumex/dashboard", { replace: true });
  } catch (error: any) {
    if (error.message === "Network Error") {
      form.setError("root", {
        message: "Something went wrong check your connection",
      });
    } else {
      form.setError("root", {
        message: error.response.data.details,
      });
    }
  }
};
