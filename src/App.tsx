import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import { useAuth } from "./api/Auth/useAuth";
import {  useQuery } from "@tanstack/react-query";
import { useStateContext } from "./context/useStateContext";
import { getDependencies } from "./api/client";
const App = () => {
  const { token } = useAuth();
    const { setError } = useStateContext();
    const { data: dependencies } = useQuery({
    queryKey: ["dependencies"],
    queryFn: () => getDependencies(`/dependency`, setError),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: 300000,
  });  
  return (
    <div className="font-Nunito bg-Secondary-50 h-dvh w-screen space-y-2">
      {token === null && <Navbar />}

      <div className="px-4 pb-4 h-[calc(100dvh-4rem)]  w-full ">
          <Outlet context={dependencies}/>
      </div>
    </div>
  );
};

export default App;
