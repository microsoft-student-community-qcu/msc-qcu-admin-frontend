import React from "react";
import { EyeRegular } from "@fluentui/react-icons";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ImageZoomDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  imageSrc: string;
  title: string;
}

export const ImageZoomDialog: React.FC<ImageZoomDialogProps> = ({
  isOpen,
  onOpenChange,
  imageSrc,
  title,
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[700px] p-0 overflow-hidden bg-background rounded-none shadow-28 border border-border">
        <DialogHeader className="p-size160 border-b border-border bg-muted/10">
          <DialogTitle className="text-sm font-bold flex items-center gap-2">
            <EyeRegular className="w-4 h-4 text-primary" />
            <span>{title || "Verification Document View"}</span>
          </DialogTitle>
          <DialogDescription className="text-xs">
            Verify the uploaded document details against candidate credentials.
          </DialogDescription>
        </DialogHeader>
        <div className="p-size200 flex items-center justify-center bg-black/5 max-h-[500px]">
          {imageSrc && (
            <img
              src={imageSrc}
              alt={title || "Verification document zoom"}
              className="max-h-[400px] object-contain shadow-8"
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageZoomDialog;
