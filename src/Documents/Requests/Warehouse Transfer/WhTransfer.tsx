import { Outlet, useOutletContext } from "react-router-dom";

const WhTransfer = () => {
  return (
    <div >
      <Outlet context={useOutletContext()} />
    </div>
  );
};

export default WhTransfer;
