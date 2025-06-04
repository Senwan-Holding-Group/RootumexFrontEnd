import { Outlet, useOutletContext } from "react-router-dom";

const GRPO = () => {
  return (
    <div>
      <Outlet context={useOutletContext()} />
    </div>
  );
};

export default GRPO;
