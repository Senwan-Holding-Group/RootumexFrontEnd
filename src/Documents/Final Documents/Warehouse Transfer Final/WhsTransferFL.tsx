import { Outlet, useOutletContext } from "react-router-dom";

const WhsTransferFL = () => {
  return (
    <div>
      <Outlet context={useOutletContext()} />
    </div>
  );
};

export default WhsTransferFL;
