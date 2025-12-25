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
} from "@/lib/formsValidation";
import { useMutation } from "@tanstack/react-query";
import { UseFormReturn } from "react-hook-form";
import { createResource, performAction, updateResource } from "./client";
import { Docline } from "@/lib/types";

// Item Mutations
/********************************************* */
export const useUpdateItem = (id?: string) =>
  useMutation({
    mutationFn: (data: EditItemRequest) =>
      updateResource<EditItemRequest>(`/item/${id}`, data),
    meta: {
      invalidatesQuery: ["itemDetails", { id }],
      titleOnSuccess: "Item updated successfully!",
      titleOnError: "Item not updated",
      descriptionOnSuccess: "Your item is successfully updated",
    },
  });
export const useCreateItem = (form: UseFormReturn<CreateItemRequest>) =>
  useMutation({
    mutationFn: (data: CreateItemRequest) => {
      const transformedData = {
        ...data,
        itemPrice: [{ ...data.itemPrice[0], uomCode: data.uomCode }],
      };
      return createResource<CreateItemRequest>("/item", transformedData);
    },

    onSuccess: () => {
      form.reset();
    },
    meta: {
      invalidatesQuery: ["itemList"],
      titleOnSuccess: "Item created successfully!",
      titleOnError: "Item not updated",
      descriptionOnSuccess: "Your Item is successfully created ",
    },
  });
//PO Mutations
//********************************************* */
export const useCreatePO = (
  form: UseFormReturn<CreatePORequest>,
  setdocLine: React.Dispatch<React.SetStateAction<Docline[]>>
) =>
  useMutation({
    mutationFn: (data: CreatePORequest) =>
      createResource<CreatePORequest>(`/purchase_order`, data),
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
    mutationFn: (data: EditPORequest) =>
      updateResource<EditPORequest>(`/purchase_order/${id}`, data),
    meta: {
      invalidatesQuery: ["poDetails", { id }],
      titleOnSuccess: "PO updated successfully!",
      titleOnError: "PO not updated",
      descriptionOnSuccess: "Your PO is successfully updated",
    },
  });
export const useCancelPo = (id?: string) =>
  useMutation({
    mutationFn: () => performAction(`/purchase_order/cancel/${id}`),
    meta: {
      invalidatesQuery: ["poDetails", { id }],
      titleOnSuccess: "PO canceled successfully!",
      titleOnError: "PO not updated",
      descriptionOnSuccess: "Your PO is successfully canceled",
    },
  });
//Transfer request Mutations
//********************************************* */
export const useCreateTransfer = (
  form: UseFormReturn<CreateTransferRequest>,
  setdocLine: React.Dispatch<React.SetStateAction<Docline[]>>,
  type: "SITE" | "WHS"
) =>
  useMutation({
    mutationFn: (data: CreateTransferRequest) =>
      createResource<CreateTransferRequest>(
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
      updateResource<EditTransferRequest>(
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
      performAction(
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
//Return request Mutations
//********************************************* */
export const useCreateReturn = (
  form: UseFormReturn<CreateReturnRequest>,
  setdocLine: React.Dispatch<React.SetStateAction<Docline[]>>
) =>
  useMutation({
    mutationFn: (data: CreateReturnRequest) =>
      createResource<CreateReturnRequest>("/return_request", data),
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
      updateResource<EditReturnRequest>(`/return_request/${id}`, data),
    meta: {
      invalidatesQuery: ["returnDetails", { id }],
      titleOnSuccess: "Return updated successfully!",
      titleOnError: "Return not updated",
      descriptionOnSuccess: "Your Return is successfully updated",
    },
  });
export const useCancelReturn = (id?: string) =>
  useMutation({
    mutationFn: () => performAction(`/return_request/cancel/${id}`),
    meta: {
      invalidatesQuery: ["returnDetails", { id }],
      titleOnSuccess: "Return canceled successfully!",
      titleOnError: "Return not updated",
      descriptionOnSuccess: "Your Return is successfully canceled",
    },
  });
//Waste Mutations
//********************************************* */
export const useUpdateWaste = (id?: string) =>
  useMutation({
    mutationFn: (data: EditWasteRequest) =>
      updateResource<EditWasteRequest>(`/waste/${id}`, data),
    meta: {
      invalidatesQuery: ["wasteDetails", { id }],
      titleOnSuccess: "Waste updated successfully!",
      titleOnError: "Waste not updated",
      descriptionOnSuccess: "Your Waste is successfully updated",
    },
  });
export const useCancelWaste = (id?: string) =>
  useMutation({
    mutationFn: () => performAction(`/waste/cancel/${id}`),
    meta: {
      invalidatesQuery: ["wasteDetails", { id }],
      titleOnSuccess: "Waste canceled successfully!",
      titleOnError: "Waste not updated",
      descriptionOnSuccess: "Your Waste is successfully canceled",
    },
  });
export const useCloseWaste = (id?: string) =>
  useMutation({
    mutationFn: () => performAction(`/waste/close/${id}`),
    meta: {
      invalidatesQuery: ["wasteDetails", { id }],
      titleOnSuccess: "Waste Closed successfully!",
      titleOnError: "Waste not updated",
      descriptionOnSuccess: "Your Waste is successfully closed",
    },
  });
//GRPO Mutations
//********************************************* */
export const useCloseGRPO = (id?: string) =>
  useMutation({
    mutationFn: () => performAction(`/GRPO/close/${id}`),
    meta: {
      invalidatesQuery: ["grpoDetails", { id }],
      titleOnSuccess: "GRPO Closed successfully!",
      titleOnError: "GRPO not updated",
      descriptionOnSuccess: "Your GRPO is successfully closed",
    },
  });
//Transfer Final Mutations
//********************************************* */
export const useCloseTransferFL = (type: "SITE" | "WHS", id?: string) =>
  useMutation({
    mutationFn: () =>
      performAction(
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

//Return Final Mutations
//********************************************* */
export const useCloseReturnFL = (id?: string) =>
  useMutation({
    mutationFn: () => performAction(`/return/close/${id}`),
    meta: {
      invalidatesQuery: ["returnDetailsFL", { id }],
      titleOnSuccess: "Return closed successfully!",
      titleOnError: "Return not updated",
      descriptionOnSuccess: "Your Return is successfully closed",
    },
  });
//Vendors Mutations
//********************************************* */
export const useCreateVendor = (form: UseFormReturn<CreateVendorRequest>) =>
  useMutation({
    mutationFn: (data: CreateVendorRequest) =>
      createResource<CreateVendorRequest>("/vendor", data),
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
    mutationFn: (data: EditVendorRequest) =>
      updateResource<EditVendorRequest>(`/vendor/${id}`, data),
    meta: {
      invalidatesQuery: ["vendorDetails", { id }],
      titleOnSuccess: "Vendor updated successfully!",
      titleOnError: "Vendor not updated",
      descriptionOnSuccess: "Your Vendor is successfully updated",
    },
  });
//Stock Mutations
//********************************************* */
export const useCreateStockCount = (form: UseFormReturn<CreateStockCount>) =>
  useMutation({
    mutationFn: (data: CreateStockCount) =>
      createResource<CreateStockCount>("/inventory_count", data),
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
      updateResource<EditStockCountRequest>(`/inventory_count/${id}`, data),
    meta: {
      invalidatesQuery: ["stockCountDetails", { id }],
      titleOnSuccess: "Stock count updated successfully!",
      titleOnError: "stock count not updated",
      descriptionOnSuccess: "Your stock count is successfully updated",
    },
  });
export const useCancelStockCount = (id?: string) =>
  useMutation({
    mutationFn: () => performAction(`/inventory_count/cancel/${id}`),
    meta: {
      invalidatesQuery: ["stockCountDetails", { id }],
      titleOnSuccess: "Stock count canceled successfully!",
      titleOnError: "Stock count not updated",
      descriptionOnSuccess: "Your Stock count is successfully canceled",
    },
  });
export const useCloseStockCount = (id?: string) =>
  useMutation({
    mutationFn: () => performAction(`/inventory_count/close/${id}`),
    meta: {
      invalidatesQuery: ["stockCountDetails", { id }],
      titleOnSuccess: "Stock count Closed successfully!",
      titleOnError: "Stock count not updated",
      descriptionOnSuccess: "Your Stock count is successfully closed",
    },
  });
