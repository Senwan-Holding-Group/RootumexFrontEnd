import { NavLink, Outlet, useOutletContext } from "react-router-dom";

const Requests = () => {
  const taps = [
    {
      label: "Purchase",
      path: "/rootumex/documents/requests/purchase",
    },
    {
      label: "Warehouse transfer",
      path: "/rootumex/documents/requests/Wh-transfer",
    },
    {
      label: "Site transfer",
      path: "/rootumex/documents/requests/sites-transfer",
    },
    {
      label: "Return",
      path: "/rootumex/documents/requests/return",
    },
    {
      label: "Waste",
      path: "/rootumex/documents/requests/waste",
    },
  ];
  return (
    <div className="space-y-2">
        <div className="flex   overflow-x-scroll overflow-y-hidden text-nowrap  h-[2.375rem]">
          {taps.map((tap) => (
            <NavLink
              key={tap.label}
              to={tap.path}
              style={({ isActive }) => ({
                color: isActive ? "#143D60" : "#717172",
                backgroundColor:isActive?"#E0E5EA":"",
                
              })}
              className={`flex items-center rounded-2xl font-bold text-base leading-CS  h-[2.375rem]   px-6 py-2`}>
              <h1>{tap.label}</h1>
            </NavLink>
          ))}
        </div>
      <Outlet context={useOutletContext()} />
    </div>
  );
};

export default Requests;
