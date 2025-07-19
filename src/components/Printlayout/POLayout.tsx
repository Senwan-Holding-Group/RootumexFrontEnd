import { useAuth } from "@/api/Auth/useAuth";
import { PO, Return } from "@/lib/types";
import { capitalizeCsSs } from "@/lib/utils";
import { format } from "date-fns";

type props<T> = {
  data: T;
  type: "PO" | "Return" | "GRPO" | "ReturnFL";
};
const POLayout = <T extends PO | Return>({ data, type }: props<T>) => {
  const { user } = useAuth();

  const getTitle = () => {
  switch (type) {
    case "PO":
      return "PURCHASE ORDER";
    case "Return":
      return "RETURN ORDER";
    case "GRPO":
      return "GOODS RECEIPT PO";
    case "ReturnFL":
      return "RETURN FINAL";
    default:
      return "DOCUMENT";
  }
};
  return (
    <>
      <div className="flex justify-between  pt-5 px-[5rem]">
        <img
          src={"/logo.png"}
          alt="logo"
          className=" h-[5rem] w-[15rem] object-fill "
        />
        <h1 className="text-lg font-bold  self-center ">
          {getTitle()} ({data.code})
        </h1>
        <div className="text-[12px] font-bold self-center ">
          <div className="flex gap-2">
            <p className="w-[3.5rem]">Date</p>
            <span>: {format(new Date(), "PPpp")}</span>
          </div>
          <div className="flex gap-2">
            <p className="w-[3.5rem]">UserId</p>
            <span>: {user.id}</span>
          </div>
        </div>
      </div>
      <div className="px-[5rem] py-8 flex font-semibold text-[12px]">
        <div className="w-1/3 ">
          <div className="flex gap-2">
            <p className="w-[7rem]">Supplier Code</p>
            <span>: {data.vendorCode}</span>
          </div>
          <div className="flex gap-2">
            <p className="w-[7rem]">Supplier Name</p>
            <span>: {data.vendorName}</span>
          </div>

          {/* <div className="flex gap-2">
            <p className="w-[7rem]">Contact Person</p>
            <span>: {data.}</span>
          </div>

          <div className="flex gap-2 ">
            <p className="w-[7rem]">Telephone</p>
            {/* <span>: {POPrintLayout?.telephone}</span> 
          </div> */}
        </div>
        <div className="w-1/3">
          <div className="flex gap-2">
            <p className="w-[8rem]">Order NO</p>
            <span>: -</span>
          </div>

          <div className="flex gap-2">
            <p className="w-[8rem]">Order Date</p>
            <span>: {format(new Date(data.docDate), "PP")}</span>
          </div>
          <div className="flex gap-2">
            <p className="w-[8rem]">Shipping Address</p>
            <span>: {data.warehouseCode}</span>
          </div>
          <div className="flex gap-2">
            <p className="w-[8rem]">Status</p>
            <span>: {data.status}</span>
          </div>

          <div className="flex gap-2">
            <p className="w-[8rem]">NO of Items</p>
            <span>: {data.poLines.length}</span>
          </div>
          {type!="GRPO" && (
            <div className="flex gap-2">
              <p className="w-[8rem]">Delivery Date</p>
              <span>: {format(new Date(data.docDueDate), "PP")}</span>
            </div>
          )}
        </div>
      </div>
      <div className="px-10">
        <table className=" w-full *:*:*:py-2.5 text-[12px] text-nowrap  text-justify *:*:*:px-2.5">
          <thead className="mt-3 border-y border-RT-Black">
            <tr className="bg-Gray-50 ">
              {data.poLines.length > 0 &&
                Object.keys(data.poLines[0])
                  .filter((key) => !["status"].includes(key))
                  .map((key) => <th key={key}>{capitalizeCsSs(key)}</th>)}
            </tr>
          </thead>
          <tbody>
            {data.poLines.map((line, index) => (
              <tr key={index} className="even:bg-Gray-50">
                {Object.entries(line)
                  .filter(([key]) => !["status"].includes(key))
                  .map(([, value], valueIndex) => (
                    <td key={valueIndex}>{String(value)}</td>
                  ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className=" px-[60px] h-1/2  text-[8px]  text-justify  mt-12  font-medium ">
        <p>
          **Deliveries will not be accepted without a valid commercial invoice.
          The Purchase Order (PO) number must appear on your invoice and
          delivery note. Each invoice should correspond to only one PO. Partial
          deliveries will generally not be accepted unless explicitly agreed
          upon in writing beforehand. This order is placed subject to the goods
          being supplied in accordance with all applicable laws and regulations
          of Libya, including but not limited to, import/export regulations,
          customs laws, product safety standards, and any other relevant
          legislation. The supplier is responsible for obtaining all necessary
          permits and licenses required for the supply and delivery of the goods
          within Libya. Any delivery made against this PO confirms the
          supplier's acceptance of the purchase price quoted herein and the
          terms and conditions outlined in this agreement.
        </p>
        <p dir="rtl" className="mt-2">
          **لن يتم قبول التسليمات بدون فاتورة تجارية صالحة. يجب أن يظهر رقم أمر
          الشراء (PO) على فاتورتك وإشعار التسليم. يجب أن تتوافق كل فاتورة مع أمر
          شراء واحد فقط. لن يتم قبول التسليمات الجزئية بشكل عام ما لم يتم
          الاتفاق عليها كتابةً مسبقًا. يتم تقديم هذا الطلب بشرط أن يتم توريد
          البضائع وفقًا لجميع القوانين واللوائح المعمول بها في ليبيا، بما في ذلك
          على سبيل المثال لا الحصر، لوائح الاستيراد / التصدير وقوانين الجمارك
          ومعايير سلامة المنتجات وأي تشريعات أخرى ذات صلة. يتحمل المورد مسؤولية
          الحصول على جميع التصاريح والتراخيص اللازمة المطلوبة لتوريد وتسليم
          البضائع داخل ليبيا. أي تسليم يتم بموجب أمر الشراء هذا يؤكد قبول المورد
          لسعر الشراء المذكور هنا والشروط والأحكام المبينة في هذه الاتفاقية.
        </p>
      </div>
    </>
  );
};

export default POLayout;
