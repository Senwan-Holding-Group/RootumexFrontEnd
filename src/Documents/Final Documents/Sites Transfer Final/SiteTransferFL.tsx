import { Outlet, useOutletContext } from "react-router-dom";

const SiteTransferFL = () => {
  return (
    <div>
      <Outlet context={useOutletContext()} />
    </div>
  );
};

export default SiteTransferFL;
