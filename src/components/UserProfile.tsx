import { useAuth } from "@/api/Auth/useAuth";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { faUser, faSignOut } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const UserProfile = () => {
  const { user, logout } = useAuth();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="w-8 h-8 bg-white text-Primary-500 border-[0.05rem] hover:cursor-pointer p-[0.4rem] rounded-[0.7rem] border-Secondary-500 flex items-center justify-center shadow-sm">
          <FontAwesomeIcon icon={faUser} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-4 absolute -right-4 top-4 rounded-2xl">
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold text-RT-Black">{user?.name}</h3>
            <p className="text-sm text-Gray-500">ID: {user?.id}</p>
            <p className="text-sm text-Gray-500">Warehouse: {user?.warehouse_code}</p>
          </div>
          <Button
            onClick={logout}
            className="w-full bg-Error-600 hover:bg-Error-500 text-white rounded-2xl flex items-center gap-2"
          >
            <FontAwesomeIcon icon={faSignOut} />
            Logout
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default UserProfile;