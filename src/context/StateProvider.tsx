import { useState } from "react";
import { StateContext } from "./stateContext";
import { faSquareCheck } from "@fortawesome/pro-regular-svg-icons";

type StateProviderProps = {
  children: React.ReactNode;
};
const StateProvider = ({ children }: StateProviderProps) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogConfig, setDialogConfig] = useState({
    title: "",
    description: "",
    icon: faSquareCheck,
    iconColor: "text-Success-600",
    variant: "success" as "success" | "danger" | "info",
    type: "Info",
    confirm: undefined as undefined | (() => void),
    confirmText: "",
  });

  return (
    <StateContext.Provider
      value={{
        dialogOpen,
        setDialogOpen,
        dialogConfig,
        setDialogConfig,
      }}>
      {children}
    </StateContext.Provider>
  );
};

export default StateProvider;
