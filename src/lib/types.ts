export type MenuList = {
  label: string;
  value: string;
};
type Actions = ["View", "Update", "Create", "Cancle", "Close"];
export type Permissions = {
  po: Actions[];
  grpo: Actions[];
  warehouse_transfer: Actions[];
  warehouse_transfer_request: Actions[];
  site_transfer: Actions[];
  site_transfer_request: Actions[];
  return_request: Actions[];
  return_document: Actions[];
  waste: Actions[];
  inventory_count: Actions[];
  item: Actions[];
  vendor: Actions[];
  zone: Actions[];
};
export type User = {
  id: string;
  name: string;
  warehouse_code: string;
  permissions: Permissions;
  exp: number;
};
export type Item = {
  itemName: string;
  itemCode: string;
  itemDescription: string;
  department: string;
  section: string;
  family: string;
  subFamily: string;
  uom: string;
  uomGroup: string;
  status: boolean;
  barcode: string;
  price: number;
  item_locations: {
    asigned_quantity: number;
    project_code: string;
    quantity: number;
    warehouse: string;
    zone: string;
  }[];
  created_at: string;
  updated_at: string;
  total_quantity: number;
};
export type StockCount = {
  remark: string;
  warehouse_code: string;
  batch: string;
  doc_entry: number;
  inventory_count_number: string;
  doc_date: string;
  status: string;
  cancelled: string;
  created_at: string;
  update_at: string;
  lines: [
    {
      item_code: string;
      uom: string;
      line_number: number;
      doc_entry: number;
      counted_quantity: number;
      zone_quantity: number;
      item_name: string;
      zone_code: string;
    }
  ];
};
export type PO = {
  code: string;
  docEntry: string;
  total: number;
  vendorCode: string;
  vendorName: string;
  vendorInvoiceNumber: string;
  docDate: string;
  docDueDate: string;
  docTotal: number;
  warehouseCode: string;
  projectCode: string;
  remark: string;
  status: string;
  cancelled: string;
  created_at: string;
  updated_at: string;
  poLines: Docline[];
};
export type Docline = {
  itemCode: string;
  itemDescription: string;
  description: string;
  name: string;
  uom: string;
  quantity: number;
  recieved_quantity: number;
  price: number;
  line: number;
  total_price: number;
  status: string;
  barcode: string;
  uomCode: string;
};
export type Return = {
  code: string;
  docEntry: string;
  total: number;
  vendorCode: string;
  vendorName: string;
  vendorInvoiceNumber: string;
  docDate: string;
  docDueDate: string;
  docTotal: number;
  warehouseCode: string;
  projectCode: string;
  remark: string;
  status: string;
  cancelled: string;
  created_at: string;
  updated_at: string;
  poLines: Docline[];
};

export type WhsTransfer = {
  transferNumber: string;
  docEntry: number;
  from: string;
  to: string;
  docDueDate: string;
  docDate: string;
  remark: string;
  status: string;
  cancelled: string;
  createdAt: string;
  updateAt: string;
  transferLines: Docline[];
};
export type Waste = {
  doc_entry: number;
  waste_number: string;
  warehouse: string;
  document_date: string;
  remark: string;
  status: string;
  cancelled: string;
  create_at: string;
  update_at: string;
  waste_lines: [
    {
      line_number: number;
      item_code: string;
      description: string;
      reason: string;
      quantity: number;
      status: string;
      uom_code: string;
      line_status: string;
      item_name: string;
    }
  ];
};
export type Vendor = {
  vendorCode: string;
  vendorName: string;
  vendorType: string;
  vendorAddress: string;
  vendorNameEng: string;
  contactNumber: string;
  status: string;
};
export type Dependencies = {
  departments: [
    {
      departmentCode: string;
      departmentName: string;
    }
  ];
  families: [
    {
      familyCode: string;
      familyName: string;
      sectionCode: string;
      departmentCode: string;
    }
  ];
  sections: [
    {
      sectionCode: string;
      sectionName: string;
      departmentCode: string;
    }
  ];
  sub_families: [
    {
      subFamilyCode: string;
      subFamilyName: string;
      familyCode: string;
      sectionCode: string;
      departmentCode: string;
    }
  ];
  uoms: [
    {
      uomCode: string;
      uomName: string;
    }
  ];
  uom_groups: [
    {
      uomGroupCode: string;
      uomGroupName: string;
      baseUomCode: string;
      baseQuantity: number;
      calculateUomCode: string;
      calculateQuantity: number;
    }
  ];
  warehouses: [
    {
      warehouseCode: string;
      warehouseName: string;
      warehouseType: string;
    }
  ];
  sites: [
    {
      warehouseCode: string;
      warehouseName: string;
      warehouseType: string;
    }
  ];
  vendors: [
    {
      vendorCode: string;
      vendorName: string;
      vendorType: string;
      vendorAddress: string;
      vendorNameEng: string;
      contactNumber: string;
      status: string;
    }
  ];
};
export type ZoneDashboard = {
  total_items: number;
  total_zones: number;
  full_zones: number;
  idle_zones: number;
  flagged_zones: number;
};
export type ZoneItem = {
  item_code: string;
  quantity: number;
  zone_code: string;
  warehouse_code: string;
  uom_code: string;
  uom_group: string;
  item_name: string;
  zone_status: string;
};
