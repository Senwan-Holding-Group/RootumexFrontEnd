import { queryOptions, useMutation } from "@tanstack/react-query";
import {
  getGRPO,
  getGRPODetails,
  getPODetails,
  getPurchaseOrder,
  getReturnDetails,
  getReturnRequest,
  getStockCount,
  getStockCountDetails,
  getTransfer,
  getTransferDetails,
  getTransferDetailsFL,
  getTransferFL,
  getVendorDetails,
  getVendors,
  getWaste,
  getWasteDetails,
  postCancelPO,
  postCancelReturn,
  postCancelStockCount,
  postCancelTransfer,
  postCancelWaste,
  postCloseStockCount,
  postCloseWaste,
  postGRPO,
  postPO,
  postReturn,
  postStockCount,
  postTransfer,
  postTransferFL,
  postVendor,
  putPO,
  putReturn,
  putStockCount,
  putTransfer,
  putVendor,
  putWaste,
} from "./client";
import {
  CreatePORequest,
  CreateReturnRequest,
  CreateStockCount,
  CreateTransferRequest,
  CreateVendorRequest,
  EditPORequest,
  EditReturnRequest,
  EditStockCountRequest,
  EditTransferRequest,
  EditVendorRequest,
  EditWasteRequest,
} from "@/lib/formsValidation";
import { UseFormReturn } from "react-hook-form";
import { Docline } from "@/lib/types";
//PO Queries
//********************************************* */
export const getPOQueryOptions = (
  search: {
    searchKey: string;
    searchValue: string;
  },
  currentPage: number,
  setTotalPage: React.Dispatch<React.SetStateAction<number>>,
  setError: React.Dispatch<React.SetStateAction<string | undefined>>
) =>
  queryOptions({
    queryKey: ["poList", search.searchValue, currentPage],
    queryFn: () => {
      const searchParam = search.searchValue
        ? `${search.searchKey}=${search.searchValue}&`
        : "";
      return getPurchaseOrder(
        `/purchase_order?${searchParam}limit=15&page=${
          searchParam ? "1" : currentPage
        }`,
        setError,
        setTotalPage
      );
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
export const getPODetailsQueryOptions = (
  setError: React.Dispatch<React.SetStateAction<string | undefined>>,
  id?: string
) =>
  queryOptions({
    queryKey: ["poDetails", { id }],
    queryFn: () => getPODetails(`/purchase_order/${id}`, setError),
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    enabled: id != undefined,
  });
export const useCreatePO = (
  form: UseFormReturn<CreatePORequest>,
  setdocLine: React.Dispatch<React.SetStateAction<Docline[]>>
) =>
  useMutation({
    mutationFn: (data: CreatePORequest) => postPO(`/purchase_order`, data),
    onSuccess: () => {
      form.reset();
      setdocLine([]);
    },
    meta: {
      invalidatesQuery: ["poList"],
      titleOnSuccess: "PO created successfully!",
      titleOnError: "PO not updated",
      descriptionOnSuccess: "Your purchase order is successfully created ",
    },
  });
export const useUpdatePO = (id?: string) =>
  useMutation({
    mutationFn: (data: EditPORequest) => putPO(`/purchase_order/${id}`, data),
    meta: {
      invalidatesQuery: ["poDetails", { id }],
      titleOnSuccess: "PO updated successfully!",
      titleOnError: "PO not updated",
      descriptionOnSuccess: "Your PO is successfully updated",
    },
  });
export const useCancelPo = (id?: string) =>
  useMutation({
    mutationFn: () => postCancelPO(`/purchase_order/cancel/${id}`),
    meta: {
      invalidatesQuery: ["poDetails", { id }],
      titleOnSuccess: "PO canceled successfully!",
      titleOnError: "PO not updated",
      descriptionOnSuccess: "Your PO is successfully canceled",
    },
  });
//********************************************* */
//Transfer request Queries
//********************************************* */
export const getTransferQueryOptions = (
  search: {
    searchKey: string;
    searchValue: string;
  },
  currentPage: number,
  setTotalPage: React.Dispatch<React.SetStateAction<number>>,
  setError: React.Dispatch<React.SetStateAction<string | undefined>>,
  type: "SITE" | "WHS"
) =>
  queryOptions({
    queryKey: [
      `${type == "SITE" ? "siteTransferList" : "transferList"}`,
      search.searchValue,
      currentPage,
    ],
    queryFn: () => {
      const searchParam = search.searchValue
        ? `${search.searchKey}=${search.searchValue}&`
        : "";
      return getTransfer(
        `${
          type == "SITE" ? "site_transfer_request" : "transfer"
        }?${searchParam}limit=15&page=${searchParam ? "1" : currentPage}`,
        setError,
        setTotalPage
      );
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
export const getTransferDetailsQueryOptions = (
  setError: React.Dispatch<React.SetStateAction<string | undefined>>,
  type: "SITE" | "WHS",
  id?: string
) =>
  queryOptions({
    queryKey: [
      `${type == "SITE" ? "siteTransferDetails" : "WhtransferDetails"}`,
      { id },
    ],
    queryFn: () =>
      getTransferDetails(
        `/${type == "SITE" ? "site_transfer_request" : "transfer"}/${id}`,
        setError
      ),
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    enabled: id != undefined,
  });
export const useCreateTransfer = (
  form: UseFormReturn<CreateTransferRequest>,
  setdocLine: React.Dispatch<React.SetStateAction<Docline[]>>,
  type: "SITE" | "WHS"
) =>
  useMutation({
    mutationFn: (data: CreateTransferRequest) =>
      postTransfer(
        `${type === "WHS" ? "/transfer" : "/site_transfer_request"}`,
        data
      ),
    onSuccess: () => {
      form.reset();
      setdocLine([]);
    },
    meta: {
      invalidatesQuery: [`${type === "WHS" ? "transfer" : "siteTransfer"}List`],
      titleOnSuccess: "Transfer created successfully!",
      titleOnError: "Transfer not updated",
      descriptionOnSuccess: "Your Transfer is successfully created ",
    },
  });
export const useUpdateTransfer = (type: "SITE" | "WHS", id?: string) =>
  useMutation({
    mutationFn: (data: EditTransferRequest) =>
      putTransfer(
        `/${type == "SITE" ? "site_transfer_request" : "transfer"}/${id}`,
        data
      ),
    meta: {
      invalidatesQuery: [
        `${type == "SITE" ? "siteTransferDetails" : "WhtransferDetails"}`,
        { id },
      ],
      titleOnSuccess: "Transfer updated successfully!",
      titleOnError: "Transfer not updated",
      descriptionOnSuccess: "Your Transfer is successfully updated",
    },
  });
export const useCancelTransfer = (type: "SITE" | "WHS", id?: string) =>
  useMutation({
    mutationFn: () =>
      postCancelTransfer(
        `/${type == "SITE" ? "site_transfer_request" : "transfer"}/cancel/${id}`
      ),
    meta: {
      invalidatesQuery: [
        `${type == "SITE" ? "siteTransferDetails" : "WhtransferDetails"}`,
        { id },
      ],
      titleOnSuccess: "Waste canceled successfully!",
      titleOnError: "Waste not updated",
      descriptionOnSuccess: "Your Waste is successfully canceled",
    },
  });
//********************************************* */
//Return request Queries
//********************************************* */
export const getReturnQueryOptions = (
  search: {
    searchKey: string;
    searchValue: string;
  },
  currentPage: number,
  setTotalPage: React.Dispatch<React.SetStateAction<number>>,
  setError: React.Dispatch<React.SetStateAction<string | undefined>>
) =>
  queryOptions({
    queryKey: ["returnList", search.searchValue, currentPage],
    queryFn: () => {
      const searchParam = search.searchValue
        ? `${search.searchKey}=${search.searchValue}&`
        : "";
      return getReturnRequest(
        `/return_request?${searchParam}limit=15&page=${
          searchParam ? "1" : currentPage
        }`,
        setError,
        setTotalPage
      );
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
export const getReturnDetailsQueryOptions = (
  setError: React.Dispatch<React.SetStateAction<string | undefined>>,
  id?: string
) =>
  queryOptions({
    queryKey: ["returnDetails", { id }],
    queryFn: () => getReturnDetails(`/return_request/${id}`, setError),
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    enabled: id != undefined,
  });
export const useCreateReturn = (
  form: UseFormReturn<CreateReturnRequest>,
  setdocLine: React.Dispatch<React.SetStateAction<Docline[]>>
) =>
  useMutation({
    mutationFn: (data: CreateReturnRequest) =>
      postReturn("/return_request", data),
    onSuccess: () => {
      form.reset();
      setdocLine([]);
    },
    meta: {
      invalidatesQuery: ["returnList"],
      titleOnSuccess: "Return created successfully!",
      titleOnError: "Return not updated",
      descriptionOnSuccess: "Your Return is successfully created ",
    },
  });
export const useUpdateReurn = (id?: string) =>
  useMutation({
    mutationFn: (data: EditReturnRequest) =>
      putReturn(`/return_request/${id}`, data),
    meta: {
      invalidatesQuery: ["returnDetails", { id }],
      titleOnSuccess: "Return updated successfully!",
      titleOnError: "Return not updated",
      descriptionOnSuccess: "Your Return is successfully updated",
    },
  });
export const useCancelReturn = (id?: string) =>
  useMutation({
    mutationFn: () => postCancelReturn(`/return_request/cancel/${id}`),
    meta: {
      invalidatesQuery: ["returnDetails", { id }],
      titleOnSuccess: "Return canceled successfully!",
      titleOnError: "Return not updated",
      descriptionOnSuccess: "Your Return is successfully canceled",
    },
  });
//********************************************* */
//Waste Queries
//********************************************* */
export const getWasteQueryOptions = (
  search: {
    searchKey: string;
    searchValue: string;
  },
  currentPage: number,
  setTotalPage: React.Dispatch<React.SetStateAction<number>>,
  setError: React.Dispatch<React.SetStateAction<string | undefined>>
) =>
  queryOptions({
    queryKey: ["wasteList", search.searchValue, currentPage],
    queryFn: () => {
      const searchParam = search.searchValue
        ? `${search.searchKey}=${search.searchValue}&`
        : "";
      return getWaste(
        `/waste?${searchParam}limit=15&page=${searchParam ? "1" : currentPage}`,
        setError,
        setTotalPage
      );
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
export const getWasteDetailsQueryOptions = (
  setError: React.Dispatch<React.SetStateAction<string | undefined>>,
  id?: string
) =>
  queryOptions({
    queryKey: ["wasteDetails", { id }],
    queryFn: () => getWasteDetails(`/waste/${id}`, setError),
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    enabled: id != undefined,
  });
export const useUpdateWaste = (id?: string) =>
  useMutation({
    mutationFn: (data: EditWasteRequest) => putWaste(`/waste/${id}`, data),
    meta: {
      invalidatesQuery: ["wasteDetails", { id }],
      titleOnSuccess: "Waste updated successfully!",
      titleOnError: "Waste not updated",
      descriptionOnSuccess: "Your Waste is successfully updated",
    },
  });
export const useCancelWaste = (id?: string) =>
  useMutation({
    mutationFn: () => postCancelWaste(`/waste/cancel/${id}`),
    meta: {
      invalidatesQuery: ["wasteDetails", { id }],
      titleOnSuccess: "Waste canceled successfully!",
      titleOnError: "Waste not updated",
      descriptionOnSuccess: "Your Waste is successfully canceled",
    },
  });
export const useCloseWaste = (id?: string) =>
  useMutation({
    mutationFn: () => postCloseWaste(`/waste/close/${id}`),
    meta: {
      invalidatesQuery: ["wasteDetails", { id }],
      titleOnSuccess: "Waste Closed successfully!",
      titleOnError: "Waste not updated",
      descriptionOnSuccess: "Your Waste is successfully closed",
    },
  });
//********************************************* */
//GRPO Queries
//********************************************* */
export const getGRPOueryOptions = (
  search: {
    searchKey: string;
    searchValue: string;
  },
  currentPage: number,
  setTotalPage: React.Dispatch<React.SetStateAction<number>>,
  setError: React.Dispatch<React.SetStateAction<string | undefined>>
) =>
  queryOptions({
    queryKey: ["grpoList", search.searchValue, currentPage],
    queryFn: () => {
      const searchParam = search.searchValue
        ? `${search.searchKey}=${search.searchValue}&`
        : "";
      return getGRPO(
        `/GRPO?${searchParam}limit=15&page=${searchParam ? "1" : currentPage}`,
        setError,
        setTotalPage
      );
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
export const getGRPODetailsQueryOptions = (
  setError: React.Dispatch<React.SetStateAction<string | undefined>>,
  id?: string
) =>
  queryOptions({
    queryKey: ["grpoDetails", { id }],
    queryFn: () => getGRPODetails(`/GRPO/${id}`, setError),
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    enabled: id != undefined,
  });
export const useCloseGRPO = (id?: string) =>
  useMutation({
    mutationFn: () => postGRPO(`/GRPO/close/${id}`),
    meta: {
      invalidatesQuery: ["grpoDetails", { id }],
      titleOnSuccess: "GRPO Closed successfully!",
      titleOnError: "GRPO not updated",
      descriptionOnSuccess: "Your GRPO is successfully closed",
    },
  });
//********************************************* */
//Transfer Final Queries
//********************************************* */
export const getTransferFLQueryOptions = (
  search: {
    searchKey: string;
    searchValue: string;
  },
  currentPage: number,
  setTotalPage: React.Dispatch<React.SetStateAction<number>>,
  setError: React.Dispatch<React.SetStateAction<string | undefined>>,
  type: "SITE" | "WHS"
) =>
  queryOptions({
    queryKey: [
      `${type == "SITE" ? "siteTransferListFL" : "transferListFL"}`,
      search.searchValue,
      currentPage,
    ],
    queryFn: () => {
      const searchParam = search.searchValue
        ? `${search.searchKey}=${search.searchValue}&`
        : "";
      return getTransferFL(
        `${
          type == "SITE" ? "site_transfer" : "transfer_handheld"
        }?${searchParam}limit=15&page=${searchParam ? "1" : currentPage}`,
        setError,
        setTotalPage
      );
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
export const getTransferDetailsFLQueryOptions = (
  setError: React.Dispatch<React.SetStateAction<string | undefined>>,
  type: "SITE" | "WHS",
  id?: string
) =>
  queryOptions({
    queryKey: [
      `${type == "SITE" ? "siteTransferDetailsFL" : "transferDetailsFL"}`,
      { id },
    ],
    queryFn: () =>
      getTransferDetailsFL(
        `/${type == "SITE" ? "site_transfer" : "transfer_handheld"}/${id}`,
        setError
      ),
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    enabled: id != undefined,
  });
export const useCloseTransferFL = (type: "SITE" | "WHS", id?: string) =>
  useMutation({
    mutationFn: () =>
      postTransferFL(
        `/${type == "SITE" ? "site_transfer" : "transfer_handheld"}/close/${id}`
      ),
    meta: {
      invalidatesQuery: [
        `${type == "SITE" ? "siteTransferDetailsFL" : "transferDetailsFL"}`,
        { id },
      ],
      titleOnSuccess: "Transfer Closed successfully!",
      titleOnError: "Transfer not updated",
      descriptionOnSuccess: "Your Transfer is successfully closed",
    },
  });
//********************************************* */
//Return Final Queries
//********************************************* */

//********************************************* */
//Vendors Queries
//********************************************* */
export const getVendorsQueryOptions = (
  search: {
    searchKey: string;
    searchValue: string;
  },
  currentPage: number,
  setTotalPage: React.Dispatch<React.SetStateAction<number>>,
  setError: React.Dispatch<React.SetStateAction<string | undefined>>
) =>
  queryOptions({
    queryKey: ["vendorList", search.searchValue, currentPage],
    queryFn: () => {
      const searchParam = search.searchValue
        ? `${search.searchKey}=${search.searchValue}&`
        : "";
      return getVendors(
        `/vendor?${searchParam}limit=15&page=${
          searchParam ? "1" : currentPage
        }`,
        setError,
        setTotalPage
      );
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
export const getVendorDetailsQueryOptions = (
  setError: React.Dispatch<React.SetStateAction<string | undefined>>,
  id?: string
) =>
  queryOptions({
    queryKey: ["vendorDetails", { id }],
    queryFn: () => getVendorDetails(`/vendor?vendorCode=${id}`, setError),
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    enabled: id != undefined,
  });
export const useCreateVendor = (form: UseFormReturn<CreateVendorRequest>) =>
  useMutation({
    mutationFn: (data: CreateVendorRequest) => postVendor("/vendor", data),
    onSuccess: () => {
      form.reset();
    },
    meta: {
      invalidatesQuery: ["vendorList"],
      titleOnSuccess: "Vendor created successfully!",
      titleOnError: "Vendor not updated",
      descriptionOnSuccess: "Your Vendor is successfully created ",
    },
  });
export const useUpdateVendor = (id?: string) =>
  useMutation({
    mutationFn: (data: EditVendorRequest) => putVendor(`/vendor/${id}`, data),
    meta: {
      invalidatesQuery: ["vendorDetails", { id }],
      titleOnSuccess: "Vendor updated successfully!",
      titleOnError: "Vendor not updated",
      descriptionOnSuccess: "Your Vendor is successfully updated",
    },
  });
//********************************************* */
//Stock Queries
//********************************************* */
export const getStockCountQueryOptions = (
  search: {
    searchKey: string;
    searchValue: string;
  },
  currentPage: number,
  setTotalPage: React.Dispatch<React.SetStateAction<number>>,
  setError: React.Dispatch<React.SetStateAction<string | undefined>>
) =>
  queryOptions({
    queryKey: ["stockCountList", search.searchValue, currentPage],
    queryFn: () => {
      const searchParam = search.searchValue
        ? `${search.searchKey}=${search.searchValue}&`
        : "";
      return getStockCount(
        `/inventory_count?${searchParam}limit=15&page=${
          searchParam ? "1" : currentPage
        }`,
        setError,
        setTotalPage
      );
    },
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  });
export const getStockCountDetailsQueryOptions = (
  setError: React.Dispatch<React.SetStateAction<string | undefined>>,
  id?: string
) =>
  queryOptions({
    queryKey: ["stockCountDetails", { id }],
    queryFn: () => getStockCountDetails(`/inventory_count/${id}`, setError),
    refetchOnWindowFocus: false,
    refetchOnMount: true,
    enabled: id != undefined,
  });
export const useCreateStockCount = (form: UseFormReturn<CreateStockCount>) =>
  useMutation({
    mutationFn: (data: CreateStockCount) =>
      postStockCount("/inventory_count", data),
    onSuccess: () => {
      form.reset();
    },
    meta: {
      invalidatesQuery: ["stockCountList"],
      titleOnSuccess: "Stock count created successfully!",
      titleOnError: "Stock count not updated",
      descriptionOnSuccess: "Your Stock count is successfully created ",
    },
  });
export const useUpdateStockCount = (id?: string) =>
  useMutation({
    mutationFn: (data: EditStockCountRequest) =>
      putStockCount(`/inventory_count/${id}`, data),
    meta: {
      invalidatesQuery: ["stockCountDetails", { id }],
      titleOnSuccess: "Stock count updated successfully!",
      titleOnError: "stock count not updated",
      descriptionOnSuccess: "Your stock count is successfully updated",
    },
  });
export const useCancelStockCount = (id?: string) =>
  useMutation({
    mutationFn: () => postCancelStockCount(`/inventory_count/cancel/${id}`),
    meta: {
      invalidatesQuery: ["stockCountDetails", { id }],
      titleOnSuccess: "Stock count canceled successfully!",
      titleOnError: "Stock count not updated",
      descriptionOnSuccess: "Your Stock count is successfully canceled",
    },
  });
export const useCloseStockCount = (id?: string) =>
  useMutation({
    mutationFn: () => postCloseStockCount(`/inventory_count/close/${id}`),
    meta: {
      invalidatesQuery: ["stockCountDetails", { id }],
      titleOnSuccess: "Stock count Closed successfully!",
      titleOnError: "Stock count not updated",
      descriptionOnSuccess: "Your Stock count is successfully closed",
    },
  });
