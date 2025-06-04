import { NavLink, Outlet, useOutletContext } from "react-router-dom";
const taps = [
  {
    label: "Requests",
    path: "/rootumex/documents/requests",
  },
  {
    label: "Final Documents",
    path: "/rootumex/documents/final-docs",
  },
];
const Documents = () => {
  return (
    <div className="overflow-hidden w-full flex   flex-col gap-y-4 ">
      <div className="  flex flex-col gap-y-1 ">
      <h1 className="ml-2 w-full  text-Gray-500 font-bold text-lg leading-CS ">
      Documents
        </h1>
        <div className="flex  leading-CS border-b  border-Primary-15 overflow-x-scroll overflow-y-hidden text-nowrap  h-[1.6875rem]">
          {taps.map((tap) => (
            <NavLink
              key={tap.label}
              to={tap.path}
              style={({ isActive }) => ({
                color: isActive ? "#1E201E" : "#545456",
                fontWeight: isActive ? "700" : "600",
                borderBottomWidth: isActive ? "3px" : "",
                borderColor: isActive ? "#143D60" : "",
              })}
              className={`flex items-center h-[1.6875rem]   px-4 py-1`}>
              <h1>{tap.label}</h1>
            </NavLink>
          ))}
        </div>
      </div>
      <Outlet context={useOutletContext()} />
    </div>
  );
};

export default Documents;
