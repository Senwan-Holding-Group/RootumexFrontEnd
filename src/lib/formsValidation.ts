import { z } from "zod";

export const loginFormSchema = z.object({
  code: z.string().min(2, { message: "Username is required." }),
  password: z.string().min(4, { message: "Password is required " }),
});
export type LoginRequest = z.infer<typeof loginFormSchema>;
export const EditItemSchema = z.object({
  name: z.string().min(1, { message: "Item name is required" }),
  description: z.string().min(1, { message: "Item description is required" }),
  department: z.string(),
  section: z.string(),
  family_code: z.string(),
  sub_family_code: z.string(),
  uom_code: z.string(),
  uom_group: z.string(),
  price: z.number(),
  status: z.boolean(),
});
export type EditItemRequest = z.infer<typeof EditItemSchema>;

export const CreateItemSchema = z.object({
  itemName: z.string().min(1, { message: "Item name is required" }),
  itemDescription: z
    .string()
    .min(1, { message: "Item description is required" }),
  departmentCode: z.string().min(1, { message: "Department code is required" }),
  sectionCode: z.string().min(1, { message: "Section code is required" }),
  familyCode: z.string().min(1, { message: "Family code is required" }),
  subFamilyCode: z.string().min(1, { message: "Sub family code is required" }),
  uomCode: z.string().min(1, { message: "UOM code is required" }),
  uomGroup: z.string().min(1, { message: "UOM group is required" }),
  itemPrice: z.array(
    z.object({
      priceListId: z.number(),
      price: z.number().min(1, { message: "Item price is required" }),
      uomCode: z.string(),
    })
  ),
});
export type CreateItemRequest = z.infer<typeof CreateItemSchema>;

export const CreatePOSchema = z.object({
  vendorCode: z.string().min(1, { message: "Vendor Code is required" }),
  vendorName: z.string(),
  vendorInvoiceNumber: z
    .string()
    .min(1, { message: "Vendor Invoice Number is required" }),
  warehouseCode: z.string().min(1, { message: "Warehouse Code is required" }),
  projectCode: z.string().min(1, { message: "Project Code is required" }),
  remark: z.string().min(1, { message: "Remark is required" }),
  docDueDate: z.date({
    required_error: "Document Due Date is required.",
  }),
  docDate: z.date({
    required_error: "Document Date is required.",
  }),
  poLines: z.array(
    z.object({
      itemCode: z.string(),
      description: z.string(),
      price: z.number(),
      quantity: z.number(),
      uomCode: z.string(),
    })
  ),
});
export type CreatePORequest = z.infer<typeof CreatePOSchema>;

export const EditPOSchema = z.object({
  warehouseCode: z.string(),
  projectCode: z.string(),
  remark: z.string(),
  docDueDate: z.date(),
  poLines: z.array(
    z.object({
      itemCode: z.string(),
      description: z.string(),
      price: z.number(),
      uomCode: z.string(),
      quantity: z.number(),
    })
  ),
});
export type EditPORequest = z.infer<typeof EditPOSchema>;

// export const EditGRPOSchema = z.object({
//   warehouseCode: z.string(),
//   projectCode: z.string(),
//   remark: z.string(),
//   poLines: z.array(
//     z.object({
//       itemCode: z.string(),
//       description: z.string(),
//       price: z.number(),
//       uomCode: z.string(),
//       quantity: z.number(),
//     })
//   ),
// });
// export type EditGRPORequest = z.infer<typeof EditGRPOSchema>;

export const CreateReturnSchema = z.object({
  vendorCode: z.string().min(1, { message: "Vendor Code is required" }),
  vendorName: z.string(),
  vendorInvoiceNumber: z
    .string()
    .min(1, { message: "Vendor Invoice Number is required" }),
  warehouseCode: z.string().min(1, { message: "Warehouse Code is required" }),
  projectCode: z.string().min(1, { message: "Project Code is required" }),
  remark: z.string().min(1, { message: "Remark is required" }),
  docDueDate: z.date({
    required_error: "Document Due Date is required.",
  }),
  docDate: z.date({
    required_error: "Document Date is required.",
  }),
  poLines: z.array(
    z.object({
      itemCode: z.string(),
      description: z.string(),
      price: z.number(),
      quantity: z.number(),
      uomCode: z.string(),
    })
  ),
});
export type CreateReturnRequest = z.infer<typeof CreateReturnSchema>;
export const EditReturnSchema = z.object({
  warehouseCode: z.string(),
  projectCode: z.string(),
  remark: z.string(),
  docDueDate: z.date(),
  poLines: z.array(
    z.object({
      itemCode: z.string(),
      description: z.string(),
      price: z.number(),
      uomCode: z.string(),
      quantity: z.number(),
    })
  ),
});
export type EditReturnRequest = z.infer<typeof EditReturnSchema>;
export const CreateTransferSchema = z.object({
  from: z.string().min(1, { message: "From is required" }),
  to: z.string().min(1, { message: "To is required" }),
  remark: z.string().min(1, { message: "Remark is required" }),
  docDueDate: z.date({
    required_error: "Document Due Date is required.",
  }),
  docDate: z.date({
    required_error: "Document Date is required.",
  }),
  transferLines: z.array(
    z.object({
      itemCode: z.string(),
      description: z.string(),
      quantity: z.number(),
      uomCode: z.string(),
    })
  ),
});
export type CreateTransferRequest = z.infer<typeof CreateTransferSchema>;

export const EditTransferSchema = z.object({
  from: z.string(),
  to: z.string(),
  remark: z.string(),
  docDueDate: z.date(),
  transferLines: z.array(
    z.object({
      itemCode: z.string(),
      description: z.string(),
      quantity: z.number(),
      uomCode: z.string(),
    })
  ),
});
export type EditTransferRequest = z.infer<typeof EditTransferSchema>;
// export const EditTransferFLSchema = z.object({
//   from: z.string(),
//   to: z.string(),
//   remark: z.string(),
//   transferLines: z.array(
//     z.object({
//       itemCode: z.string(),
//       description: z.string(),
//       quantity: z.number(),
//       uomCode: z.string(),
//     })
//   ),
// });
// export type EditTransferFLRequest = z.infer<typeof EditTransferFLSchema>;

export const EditWasteSchema = z.object({
  remark: z.string(),
  wasteLines: z.array(
    z.object({
      item_code: z.string(),
      description: z.string(),
      reason: z.string(),
      quantity: z.number(),
      uom_code: z.string(),
    })
  ),
});
export type EditWasteRequest = z.infer<typeof EditWasteSchema>;

export const CreateStockCountSchema = z.object({
  remark: z.string().min(1, { message: "Remark name is required" }),
  warehouse_code: z.string().min(1, { message: "Warehouse code is required" }),
  batch: z.string().min(1, { message: "Batch code is required" }),
  docDate: z.date({
    required_error: "Document Date is required.",
  }),
});
export type CreateStockCount = z.infer<typeof CreateStockCountSchema>;
export const EditStockCountSchema = z.object({
  remark: z.string(),
  lines: z.array(
    z.object({
      item_code: z.string(),
      uom: z.string(),
      doc_entry: z.number(),
      counted_quantity: z.number(),
      zone_quantity: z.number(),
      item_name: z.string(),
      zone_code: z.string(),
    })
  ),
});
export type EditStockCountRequest = z.infer<typeof EditStockCountSchema>;
export const EditVendorSchema = z.object({
  vendorName: z.string(),
  vendorType: z.string(),
  vendorAddress: z.string(),
  vendorNameEng: z.string(),
  contactNumber: z.string(),
  status: z.string(),
});
export type EditVendorRequest = z.infer<typeof EditVendorSchema>;
export const CreateVendorSchema = z.object({
  vendorName:  z.string().min(1, { message: "Vendor name is required" }),
  vendorType:  z.string().min(1, { message: "Vendor type is required" }),
  vendorAddress:  z.string().min(1, { message: "Vendor address is required" }),
  vendorNameEng:  z.string().min(1, { message: "Vendor name (English) is required" }),
  contactNumber:  z.string().min(1, { message: "Contact number is required" }),
});
export type CreateVendorRequest = z.infer<typeof CreateVendorSchema>;
