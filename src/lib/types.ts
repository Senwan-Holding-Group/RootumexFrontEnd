export type MenuList = {
  label: string;
  value: string;
};
export type User = {
  code: string;
  name: string;
  phone: string;
  role: object;
  warehouseList: string[];
  transferType: string[];
  requestSource: string;
  sectionList: string[];
  paymentType: "Cash" | "Bank";
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
  created_at: string;
  updated_at: string;
  total_quantity: number;
  item_locations: string;
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
  vendors: [
    {
      vendorCode: string;
      vendorName: string;
      vendorType: string;
      vendorAddress: string;
    }
  ];
};
