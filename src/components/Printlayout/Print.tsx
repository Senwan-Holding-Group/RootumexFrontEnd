import { ReactNode, useRef } from "react";
import { Button } from "../ui/button";
import { useReactToPrint } from "react-to-print";
type props = {
  children: ReactNode;
  btnText: string;
};
const Print = ({ children, btnText }: props) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const reactToPrintFn = useReactToPrint({ contentRef });
  return (
    <div>
      <Button
        className="rounded-2xl w-[10rem]"
        onClick={() => reactToPrintFn()}>
        Print {btnText}
      </Button>
      <div
        ref={contentRef}
        id="prt"
        className="print:flex flex-col hidden  h-screen justify-between">
        {children}
      </div>
    </div>
  );
};

export default Print;
