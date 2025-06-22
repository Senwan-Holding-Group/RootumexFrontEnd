import { IconDefinition } from "@fortawesome/pro-regular-svg-icons";
import { createContext } from "react";
type DialogConfig = {
  title: string;
  description: string;
  icon: IconDefinition;
  iconColor: string;
  variant: "success" | "danger" | "info";
  type: string;
  confirm: undefined | (() => void);
  confirmText: string;
};
export type StateContextType = {
  error: string | undefined;
  setError: React.Dispatch<React.SetStateAction<string | undefined>>;
  dialogOpen: boolean;
  setDialogOpen: React.Dispatch<React.SetStateAction<boolean>>;
  dialogConfig: DialogConfig;
  setDialogConfig: React.Dispatch<React.SetStateAction<DialogConfig>>;
};

export const StateContext = createContext<StateContextType | undefined>(
  undefined
);
