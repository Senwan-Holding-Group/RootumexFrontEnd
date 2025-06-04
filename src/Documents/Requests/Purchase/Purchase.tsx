import { Outlet, useOutletContext } from "react-router-dom";

const Purchase = () => {
  return (
    <div>
      <Outlet context={useOutletContext()} />
    </div>
  );
};

export default Purchase;
