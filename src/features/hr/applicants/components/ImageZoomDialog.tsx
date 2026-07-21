import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";

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
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[900px] p-0 overflow-hidden bg-background rounded-none shadow-28 border border-border">
        <div className="p-size200 flex items-center justify-center bg-black/5 max-h-[700px]">
          {imageSrc && (
            <img
              src={imageSrc}
              alt="Student ID"
              className="max-h-[600px] object-contain shadow-8"
            />
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageZoomDialog;
