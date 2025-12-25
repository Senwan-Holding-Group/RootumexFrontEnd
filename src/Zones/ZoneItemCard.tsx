import { ZoneItem } from "@/lib/types";

const ZoneItemCard = ({ item }: { item: ZoneItem }) => (
  <div className="space-y-4 h-[4.75rem] px-2 py-2 text-base font-medium leading-CS text-RT-Black">
    <h1>{item.item_code + "-" + item.item_name}</h1>
    <div className="flex gap-x-14 text-Gray-500">
      <div className="flex">
        <span>Qty:&nbsp;</span>
        <span>{item.quantity}</span>
      </div>
      <div className="flex">
        <span>UOM:&nbsp;</span>
        <span>{item.uom_code}</span>
      </div>
      <div className="flex">
        <span>UOM group:&nbsp;</span>
        <span>{item.uom_group}</span>
      </div>
    </div>
  </div>
);
export default ZoneItemCard;