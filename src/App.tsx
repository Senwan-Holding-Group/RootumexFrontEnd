import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import { useAuth } from "./api/Auth/useAuth";
import { useQuery } from "@tanstack/react-query";
import { useStateContext } from "./context/useStateContext";
import { getDependencies } from "./api/client";
import ConfirmationDialog from "./components/ConfirmationDialog";
const App = () => {
  const { token } = useAuth();
  const { setError, dialogOpen, dialogConfig, setDialogOpen } =
    useStateContext();
  const { data: dependencies } = useQuery({
    queryKey: ["dependencies"],
    queryFn: () => getDependencies(`/dependency`, setError),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    retry: (failureCount) => {
      return failureCount < 10;
    },
    retryDelay: 1000,
    enabled: !!token,
  });
  return (
    <div className="font-Nunito bg-Secondary-50 h-dvh w-screen space-y-2">
      {token != null && <Navbar />}
      <div className="px-4 pb-4 h-[calc(100dvh-4rem)]  w-full ">
        <Outlet context={dependencies} />
        <ConfirmationDialog
          isOpen={dialogOpen}
          onClose={() => setDialogOpen(false)}
          title={dialogConfig.title}
          description={dialogConfig.description}
          icon={dialogConfig.icon}
          iconColor={dialogConfig.iconColor}
          confirmText={dialogConfig.confirmText}
          type={dialogConfig.type}
          onConfirm={() => {
            if (dialogConfig.confirm) {
              dialogConfig.confirm();
            }
            setDialogOpen(false);
          }}
          variant={dialogConfig.variant}
        />
      </div>
    </div>
  );
};

export default App;
