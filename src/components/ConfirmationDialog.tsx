import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description: string;
  icon?: IconDefinition;
  iconColor?: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  type: string;
  variant?: "danger" | "warning" | "info" | "success";
}

const ConfirmationDialog = ({
  isOpen,
  onClose,
  title,
  description,
  icon,
  iconColor = "text-Primary-500",
  confirmText = "Confirm",
  cancelText = "Cancel",
  onConfirm,
  type,
  variant = "info",
}: ConfirmationDialogProps) => {
  const buttonStyles = {
    danger: "bg-Error-600 hover:bg-Error-700",
    warning: "bg-Warning-600 hover:bg-Warning-700",
    info: "bg-Primary-500 hover:bg-Primary-600",
    success: "bg-Success-600 hover:bg-Success-700",
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[28rem] rounded-2xl px-6 py-10">
        <DialogHeader className="flex flex-col  h-[6.563rem] items-center gap-4">
          {icon && (
            <div className="flex justify-center h-16 w-14">
              <FontAwesomeIcon
                icon={icon}
                className={`text-[3.5rem] ${iconColor}`}
              />
            </div>
          )}
          <DialogTitle className={`text-center h-[1.563rem] ${iconColor}`}>
            {title}
          </DialogTitle>
        </DialogHeader>
        <div className="text-center text-Gray-500">{description}</div>

        <DialogFooter className="flex gap-2 flex-row justify-center">
          {type !== "Info" && (
            <Button
              variant="outline"
              onClick={onClose}
              className="rounded-2xl w-[10rem] border-Secondary-500">
              {cancelText}
            </Button>
          )}
          <Button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`rounded-2xl w-[10rem] ${buttonStyles[variant]}`}>
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationDialog;
