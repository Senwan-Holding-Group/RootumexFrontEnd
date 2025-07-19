/* eslint-disable @typescript-eslint/no-explicit-any */
import { NavigateFunction } from "react-router-dom";
import { UseFormReturn } from "react-hook-form";
import secureLocalStorage from "react-secure-storage";
import {
  CreateItemRequest,
  CreatePORequest,
  CreateReturnRequest,
  CreateStockCount,
  CreateTransferRequest,
  CreateVendorRequest,
  EditItemRequest,
  EditPORequest,
  EditReturnRequest,
  EditStockCountRequest,
  EditTransferRequest,
  EditVendorRequest,
  EditWasteRequest,
  LoginRequest,
} from "@/lib/formsValidation";
import api from ".";
import {
  Dependencies,
  Item,
  PO,
  Return,
  StockCount,
  Vendor,
  Waste,
  WhsTransfer,
  ZoneDashboard,
  ZoneItem,
} from "@/lib/types";

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

    console.log(error);
  }
};
export const getDependencies = async (
  url: string,
  setError: React.Dispatch<React.SetStateAction<string | undefined>>
) => {
  try {
    const res = await api.get(url);
    return res.data as Dependencies;
  } catch (error: any) {
    if (error.message === "Network Error") {
      setError("Something went wrong check your connection");
    } else {
      setError(error.response.data.details);
    }
    throw error;
  }
};
//Item MasterData
export const getItemsMasterData = async (
  url: string,
  setError: React.Dispatch<React.SetStateAction<string | undefined>>,
  setTotalPage?: React.Dispatch<React.SetStateAction<number>>
) => {
  try {
    const res = await api.get(url);
    if (setTotalPage) {
      setTotalPage(res.data.meta.total_pages);
    }
    return res.data.data as Item[];
  } catch (error: any) {
    console.log(error);
    if (error.message === "Network Error") {
      setError("Something went wrong check your connection");
    } else {
      setError(error.response.data.details);
    }
    throw error;
  }
};
export const getItemDetails = async (
  url: string,
  setError: React.Dispatch<React.SetStateAction<string | undefined>>
) => {
  try {
    const res = await api.get(url);
    return res.data as Item;
  } catch (error: any) {
    console.log(error);
    if (error.message === "Network Error") {
      setError("Something went wrong check your connection");
    } else {
      setError(error.response.data.details);
    }
    console.log(error);
  }
};
export const postItem = async (url: string, data: CreateItemRequest) => {
  const newValues = {
    ...data,
    itemPrice: [
      {
        ...data.itemPrice[0],
        uomCode: data.uomCode,
      },
    ],
  };
  try {
    const res = await api.post(url, newValues);
    return res.data;
  } catch (error: any) {
    console.log(error);
    throw error;
  }
};
export const putItem = async (url: string, data: EditItemRequest) => {
  try {
    const res = await api.patch(url, data);
    return res.data;
  } catch (error: any) {
    console.log(error);
    throw error;
  }
};
//Purchase Order
export const getPurchaseOrder = async (
  url: string,
  setError: React.Dispatch<React.SetStateAction<string | undefined>>,
  setTotalPage: React.Dispatch<React.SetStateAction<number>>
) => {
  try {
    const res = await api.get(url);
    setTotalPage(res.data.meta.total_pages);
    return res.data.data as PO[];
  } catch (error: any) {
    console.log(error);
    if (error.message === "Network Error") {
      setError("Something went wrong check your connection");
    } else {
      setError(error.response.data.details);
    }
    console.log(error);
  }
};
export const getPODetails = async (
  url: string,
  setError: React.Dispatch<React.SetStateAction<string | undefined>>
) => {
  try {
    const res = await api.get(url);
    return res.data as PO;
  } catch (error: any) {
    console.log(error);
    if (error.message === "Network Error") {
      setError("Something went wrong check your connection");
    } else {
      setError(error.response.data.details);
    }
    console.log(error);
  }
};
export const postPO = async (url: string, data: CreatePORequest) => {
  try {
    const res = await api.post(url, data);
    return res.data;
  } catch (error: any) {
    console.log(error);
    throw error;
  }
};
export const putPO = async (url: string, data: EditPORequest) => {
  try {
    const res = await api.patch(url, data);
    return res.data;
  } catch (error: any) {
    console.log(error);
    throw error;
  }
};
export const postCancelPO = async (url: string) => {
  try {
    const res = await api.post(url);
    return res.data;
  } catch (error: any) {
    console.log(error);
    throw error;
  }
};
//GRPO
export const getGRPO = async (
  url: string,
  setError: React.Dispatch<React.SetStateAction<string | undefined>>,
  setTotalPage: React.Dispatch<React.SetStateAction<number>>
) => {
  try {
    const res = await api.get(url);
    setTotalPage(res.data.meta.total_pages);
    return res.data.data as PO[];
  } catch (error: any) {
    console.log(error);
    if (error.message === "Network Error") {
      setError("Something went wrong check your connection");
    } else {
      setError(error.response.data.details);
    }
    console.log(error);
  }
};
export const getGRPODetails = async (
  url: string,
  setError: React.Dispatch<React.SetStateAction<string | undefined>>
) => {
  try {
    const res = await api.get(url);
    return res.data as PO;
  } catch (error: any) {
    console.log(error);
    if (error.message === "Network Error") {
      setError("Something went wrong check your connection");
    } else {
      setError(error.response.data.details);
    }
    console.log(error);
  }
};
// export const putGRPO = async (url: string, data: EditGRPORequest) => {
//   try {
//     const res = await api.patch(url, data);
//     return res.data;
//   } catch (error: any) {
//     console.log(error);
//     throw error;
//   }
// };
export const postGRPO = async (url: string) => {
  try {
    const res = await api.post(url);
    return res.data;
  } catch (error: any) {
    console.log(error);
    throw error;
  }
};

//Return
export const getReturnRequest = async (
  url: string,
  setError: React.Dispatch<React.SetStateAction<string | undefined>>,
  setTotalPage: React.Dispatch<React.SetStateAction<number>>
) => {
  try {
    const res = await api.get(url);
    setTotalPage(res.data.meta.total_pages);
    return res.data.data as Return[];
  } catch (error: any) {
    console.log(error);
    if (error.message === "Network Error") {
      setError("Something went wrong check your connection");
    } else {
      setError(error.response.data.details);
    }
    console.log(error);
  }
};
export const getReturnDetails = async (
  url: string,
  setError: React.Dispatch<React.SetStateAction<string | undefined>>
) => {
  try {
    const res = await api.get(url);
    return res.data as Return;
  } catch (error: any) {
    console.log(error);
    if (error.message === "Network Error") {
      setError("Something went wrong check your connection");
    } else {
      setError(error.response.data.details);
    }
    console.log(error);
  }
};
export const postReturn = async (url: string, data: CreateReturnRequest) => {
  try {
    const res = await api.post(url, data);
    return res.data;
  } catch (error: any) {
    console.log(error);
    throw error;
  }
};
export const postCancelReturn = async (url: string) => {
  try {
    const res = await api.post(url);
    return res.data;
  } catch (error: any) {
    console.log(error);
    throw error;
  }
};
export const putReturn = async (url: string, data: EditReturnRequest) => {
  try {
    const res = await api.patch(url, data);
    return res.data;
  } catch (error: any) {
    console.log(error);
    throw error;
  }
};
//Return Final
export const getReturnFL = async (
  url: string,
  setError: React.Dispatch<React.SetStateAction<string | undefined>>,
  setTotalPage: React.Dispatch<React.SetStateAction<number>>
) => {
  try {
    const res = await api.get(url);
    setTotalPage(res.data.meta.total_pages);
    return res.data.data as Return[];
  } catch (error: any) {
    console.log(error);
    if (error.message === "Network Error") {
      setError("Something went wrong check your connection");
    } else {
      setError(error.response.data.details);
    }
    console.log(error);
  }
};
export const getReturnFLDetails = async (
  url: string,
  setError: React.Dispatch<React.SetStateAction<string | undefined>>
) => {
  try {
    const res = await api.get(url);
    return res.data as Return;
  } catch (error: any) {
    console.log(error);
    if (error.message === "Network Error") {
      setError("Something went wrong check your connection");
    } else {
      setError(error.response.data.details);
    }
    console.log(error);
  }
};
// export const putReturnFL = async (url: string, data: EditReturnRequest) => {
//   try {
//     const res = await api.patch(url, data);
//     return res.data;
//   } catch (error: any) {
//     console.log(error);
//     throw error;
//   }
// };
export const postReturnFL = async (url: string) => {
  try {
    const res = await api.post(url);
    return res.data;
  } catch (error: any) {
    console.log(error);
    throw error;
  }
};
//Waste
export const getWaste = async (
  url: string,
  setError: React.Dispatch<React.SetStateAction<string | undefined>>,
  setTotalPage: React.Dispatch<React.SetStateAction<number>>
) => {
  try {
    const res = await api.get(url);
    setTotalPage(res.data.meta.total_pages);
    return res.data.data as Waste[];
  } catch (error: any) {
    console.log(error);
    if (error.message === "Network Error") {
      setError("Something went wrong check your connection");
    } else {
      setError(error.response.data.details);
    }
    console.log(error);
  }
};
export const getWasteDetails = async (
  url: string,
  setError: React.Dispatch<React.SetStateAction<string | undefined>>
) => {
  try {
    const res = await api.get(url);
    return res.data as Waste;
  } catch (error: any) {
    console.log(error);
    if (error.message === "Network Error") {
      setError("Something went wrong check your connection");
    } else {
      setError(error.response.data.details);
    }
    console.log(error);
  }
};
export const postCancelWaste = async (url: string) => {
  try {
    const res = await api.post(url);
    return res.data;
  } catch (error: any) {
    console.log(error);
    throw error;
  }
};
export const postCloseWaste = async (url: string) => {
  try {
    const res = await api.post(url);
    return res.data;
  } catch (error: any) {
    console.log(error);
    throw error;
  }
};
export const putWaste = async (url: string, data: EditWasteRequest) => {
  try {
    const res = await api.patch(url, data);
    return res.data;
  } catch (error: any) {
    console.log(error);
    throw error;
  }
};
//Transfer Request
export const getTransfer = async (
  url: string,
  setError: React.Dispatch<React.SetStateAction<string | undefined>>,
  setTotalPage: React.Dispatch<React.SetStateAction<number>>
) => {
  try {
    const res = await api.get(url);
    setTotalPage(res.data.meta.total_pages);
    return res.data.data as WhsTransfer[];
  } catch (error: any) {
    console.log(error);
    if (error.message === "Network Error") {
      setError("Something went wrong check your connection");
    } else {
      setError(error.response.data.details);
    }
    console.log(error);
  }
};
export const getTransferDetails = async (
  url: string,
  setError: React.Dispatch<React.SetStateAction<string | undefined>>
) => {
  try {
    const res = await api.get(url);
    return res.data as WhsTransfer;
  } catch (error: any) {
    console.log(error);
    if (error.message === "Network Error") {
      setError("Something went wrong check your connection");
    } else {
      setError(error.response.data.details);
    }
    console.log(error);
  }
};
export const postTransfer = async (
  url: string,
  data: CreateTransferRequest
) => {
  try {
    const res = await api.post(url, data);
    return res.data;
  } catch (error: any) {
    console.log(error);
    throw error;
  }
};
export const postCancelTransfer = async (url: string) => {
  try {
    const res = await api.post(url);
    return res.data;
  } catch (error: any) {
    console.log(error);
    throw error;
  }
};
export const putTransfer = async (url: string, data: EditTransferRequest) => {
  try {
    const res = await api.patch(url, data);
    return res.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
//Transfer Final
export const getTransferFL = async (
  url: string,
  setError: React.Dispatch<React.SetStateAction<string | undefined>>,
  setTotalPage: React.Dispatch<React.SetStateAction<number>>
) => {
  try {
    const res = await api.get(url);
    setTotalPage(res.data.meta.total_pages);
    return res.data.data as WhsTransfer[];
  } catch (error: any) {
    console.log(error);
    if (error.message === "Network Error") {
      setError("Something went wrong check your connection");
    } else {
      setError(error.response.data.details);
    }
    console.log(error);
  }
};
export const getTransferDetailsFL = async (
  url: string,
  setError: React.Dispatch<React.SetStateAction<string | undefined>>
) => {
  try {
    const res = await api.get(url);
    return res.data as WhsTransfer;
  } catch (error: any) {
    console.log(error);
    if (error.message === "Network Error") {
      setError("Something went wrong check your connection");
    } else {
      setError(error.response.data.details);
    }
    console.log(error);
  }
};
// export const putTransferFL = async (
//   url: string,
//   data: EditTransferFLRequest
// ) => {
//   try {
//     const res = await api.patch(url, { ...data, docDueDate: "2025-1-1" });
//     return res.data;
//   } catch (error: any) {
//     console.log(error);
//     throw error;
//   }
// };
export const postTransferFL = async (url: string) => {
  try {
    const res = await api.post(url);
    return res.data;
  } catch (error: any) {
    console.log(error);
    throw error;
  }
};
//Vendor
export const getVendors = async (
  url: string,
  setError: React.Dispatch<React.SetStateAction<string | undefined>>,
  setTotalPage: React.Dispatch<React.SetStateAction<number>>
) => {
  try {
    const res = await api.get(url);
    setTotalPage(res.data.meta.total_pages);
    return res.data.data as Vendor[];
  } catch (error: any) {
    console.log(error);
    if (error.message === "Network Error") {
      setError("Something went wrong check your connection");
    } else {
      setError(error.response.data.details);
    }
    console.log(error);
  }
};
export const getVendorDetails = async (
  url: string,
  setError: React.Dispatch<React.SetStateAction<string | undefined>>
) => {
  try {
    const res = await api.get(url);
    return res.data.data[0] as Vendor;
  } catch (error: any) {
    console.log(error);
    if (error.message === "Network Error") {
      setError("Something went wrong check your connection");
    } else {
      setError(error.response.data.details);
    }
    console.log(error);
  }
};
export const putVendor = async (url: string, data: EditVendorRequest) => {
  try {
    const res = await api.patch(url, data);
    return res.data;
  } catch (error: any) {
    console.log(error);
    throw error;
  }
};
export const postVendor = async (url: string, data: CreateVendorRequest) => {
  try {
    const res = await api.post(url, data);
    return res.data;
  } catch (error: any) {
    console.log(error);
    throw error;
  }
};
//Stock Count
export const getStockCount = async (
  url: string,
  setError: React.Dispatch<React.SetStateAction<string | undefined>>,
  setTotalPage?: React.Dispatch<React.SetStateAction<number>>
) => {
  try {
    const res = await api.get(url);
    if (setTotalPage) {
      setTotalPage(res.data.meta.total_pages);
    }
    return res.data.data as StockCount[];
  } catch (error: any) {
    console.log(error);
    if (error.message === "Network Error") {
      setError("Something went wrong check your connection");
    } else {
      setError(error.response.data.details);
    }
    console.log(error);
  }
};
export const getStockCountDetails = async (
  url: string,
  setError: React.Dispatch<React.SetStateAction<string | undefined>>
) => {
  try {
    const res = await api.get(url);
    return res.data as StockCount;
  } catch (error: any) {
    console.log(error);
    if (error.message === "Network Error") {
      setError("Something went wrong check your connection");
    } else {
      setError(error.response.data.details);
    }
    console.log(error);
  }
};
export const postStockCount = async (url: string, data: CreateStockCount) => {
  try {
    const res = await api.post(url, data);
    return res.data;
  } catch (error: any) {
    console.log(error);
    throw error;
  }
};
export const postCloseStockCount = async (url: string) => {
  try {
    const res = await api.post(url);
    return res.data;
  } catch (error: any) {
    console.log(error);
    throw error;
  }
};
export const postCancelStockCount = async (url: string) => {
  try {
    const res = await api.post(url);
    return res.data;
  } catch (error: any) {
    console.log(error);
    throw error;
  }
};
export const putStockCount = async (
  url: string,
  data: EditStockCountRequest
) => {
  try {
    const res = await api.patch(url, data);
    return res.data;
  } catch (error: any) {
    console.log(error);
    throw error;
  }
};
//Zones
export const getZoneDashboard = async (
  url: string,
  setError: React.Dispatch<React.SetStateAction<string | undefined>>
) => {
  try {
    const res = await api.get(url);
    return res.data as ZoneDashboard;
  } catch (error: any) {
    console.log(error);
    if (error.message === "Network Error") {
      setError("Something went wrong check your connection");
    } else {
      setError(error.response.data.details);
    }
    console.log(error);
  }
};
export const getZoneDetails = async (
  url: string,
  setError: React.Dispatch<React.SetStateAction<string | undefined>>
) => {
  try {
    const res = await api.get(url);
    return res.data as ZoneItem[];
  } catch (error: any) {
    console.log(error);
    if (error.message === "Network Error") {
      setError("Something went wrong check your connection");
    } else {
      setError(error.response.data.details);
    }
    console.log(error);
  }
};
