import {
  faBoxesStacked,
  faCog,
  faDiamonds4,
  faFileInvoice,
  faGridHorizontal,
  faSitemap,
  faUsers,
} from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NavLink } from "react-router-dom";
import NavMenu from "./NavMenu";
import UserProfile from "./UserProfile";

const navItems = [
  {
    title: "nav",
    items: [
      {
        icon: <FontAwesomeIcon icon={faDiamonds4} />,
        label: "Dashboard",
        path: "/rootumex/dashboard",
      },
      {
        icon: <FontAwesomeIcon icon={faSitemap} />,
        label: "Items ",
        path: "/rootumex/items",
      },
      {
        icon: <FontAwesomeIcon icon={faFileInvoice} />,
        label: "Documents",
        path: "/rootumex/documents",
      },
      {
        icon: <FontAwesomeIcon icon={faUsers} />,
        label: "Vendors",
        path: "/rootumex/vendors",
      },
      {
        icon: <FontAwesomeIcon icon={faGridHorizontal} />,
        label: "Zones",
        path: "/rootumex/zones",
      },
      {
        icon: <FontAwesomeIcon icon={faBoxesStacked} />,
        label: "Stock count",
        path: "/rootumex/stock-count",
      },
    ],
  },
];
const Navbar = () => {
  return (
    <div className="bg-Primary-50 px-4 py-[12px] h-14 flex items-center justify-between w-screen border-b-2 border-Secondary-50">
      <span className="font-[900] leading-CS text-Primary-500 text-[1.325rem] inline-flex items-center h-8">
        ROOTUMEX
      </span>
      <div className=" hidden lg:flex  h-14  ">
        {navItems.map((i) => (
          <nav key={i.title} className="flex  ">
            {i.items.map((item) => (
              <NavLink
                to={item.path}
                key={item.label}
                style={({ isActive }) => ({
                  background: isActive ? "#FDFCFA " : "",
                  borderRadius: isActive ? "0.5rem 0.5rem 0 0" : "",
                  color: isActive ? "#163657" : "#545456",
                  boxShadow: isActive ? "#8D8D8E40" : "",
                })}
                className={
                  "flex items-center gap-x-2 mt-[12px] transition-all ease-in-out w-[100px]  justify-center text-base leading-CS px-4 py-2 font-semibold  "
                }>
                {/* {item.icon} */}
                <span className=" text-nowrap">{item.label}</span>
              </NavLink>
            ))}
          </nav>
        ))}
      </div>
      <div className=" flex items-center space-x-2">
        <button className="w-8 h-8 bg-white  border-[0.05rem] drop-shadow-[#8D8D8E40] hover:cursor-pointer p-[0.4rem] rounded-[0.7rem] border-Secondary-500 flex items-center justify-center shadow-sm">
          <FontAwesomeIcon icon={faCog} />
        </button>
        <UserProfile />

        <NavMenu>
          {navItems.map((i) => (
            <nav key={i.title} className="flex flex-col w-full">
              {i.items.map((item) => (
                <NavLink
                  to={item.path}
                  key={item.label}
                  style={({ isActive }) => ({
                    background: isActive ? "#E0E5EA" : "",
                    borderRadius: isActive ? "0.5rem" : "",
                    color: isActive ? "#143D60" : "#545456",
                  })}
                  className={
                    "transition-all ease-in-out   text-base leading-CS px-4 py-2 font-semibold  "
                  }>
                  {/* {item.icon} */}
                  <span className=" text-nowrap">{item.label}</span>
                </NavLink>
              ))}
            </nav>
          ))}
        </NavMenu>
      </div>
    </div>
  );
};

export default Navbar;
