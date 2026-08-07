import React, { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { EditRegular } from "@fluentui/react-icons";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Applicant } from "@/features/hr/shared/types";
import { useUpdateApplicantDetails } from "@/features/hr/shared/hooks/useUpdateApplicantDetails";
import { editApplicantSchema, EditApplicantFormValues } from "../schemas/editApplicantSchema";

interface EditApplicantDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  applicant: Applicant | null;
}

export const EditApplicantDialog: React.FC<EditApplicantDialogProps> = ({
  isOpen,
  onOpenChange,
  applicant,
}) => {
  const updateDetails = useUpdateApplicantDetails();

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<EditApplicantFormValues>({
    resolver: zodResolver(editApplicantSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      middleInitial: "",
      email: "",
      studentId: "",
      college: "",
      program: "",
      section: "",
      campus: "SAN_BARTOLOME_MAIN",
      department: "MANAGEMENT_AND_DEVELOPMENT_OFFICE",
      cellphone: "",
      houseAddress: "",
      interests: "",
    },
  });

  // Reset form when applicant changes or dialog opens
  useEffect(() => {
    if (applicant && isOpen) {
      reset({
        firstName: applicant.rawFirstName || "",
        lastName: applicant.rawLastName || "",
        middleInitial: applicant.rawMiddleInitial?.replace(/\./g, "") || "",
        email: applicant.email,
        studentId: applicant.studentId || "",
        college: applicant.college,
        program: applicant.program,
        section: applicant.section,
        campus: (applicant.campus as any) || "SAN_BARTOLOME_MAIN",
        department: (applicant.department as any) || "MANAGEMENT_AND_DEVELOPMENT_OFFICE",
        cellphone: applicant.cellphone,
        houseAddress: applicant.houseAddress,
        interests: applicant.interests,
      });
    }
  }, [applicant, isOpen, reset]);

  const onSubmit = async (data: EditApplicantFormValues) => {
    if (!applicant) return;
    try {
      await updateDetails.mutateAsync({
        applicantId: applicant.id,
        data,
      });
      toast.success("Applicant details updated successfully");
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to update applicant details", {
        description: error instanceof Error ? error.message : "Unknown error occurred",
      });
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md overflow-y-auto">
        <SheetHeader className="mb-4">
          <SheetTitle className="flex items-center gap-2">
            <EditRegular className="w-5 h-5" />
            Edit Applicant Details
          </SheetTitle>
          <SheetDescription>
            Make corrections to the applicant's submitted information.
          </SheetDescription>
        </SheetHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-size160 px-4 pb-4">
          <div className="space-y-size80">
            <Label>First Name</Label>
            <Input {...register("firstName")} />
            {errors.firstName && (
              <span className="text-xs text-destructive">{errors.firstName.message}</span>
            )}
          </div>

          <div className="space-y-size80">
            <Label>Middle Initial</Label>
            <Input {...register("middleInitial")} />
          </div>

          <div className="space-y-size80">
            <Label>Last Name</Label>
            <Input {...register("lastName")} />
            {errors.lastName && (
              <span className="text-xs text-destructive">{errors.lastName.message}</span>
            )}
          </div>

          <div className="space-y-size80">
            <Label>Email</Label>
            <Input {...register("email")} type="email" />
            {errors.email && (
              <span className="text-xs text-destructive">{errors.email.message}</span>
            )}
          </div>

          {/* Student ID & Cellphone: 2-column grid */}
          <div className="grid grid-cols-2 gap-size160">
            <div className="space-y-size80">
              <Label>Student ID</Label>
              <Input {...register("studentId")} />
            </div>
            <div className="space-y-size80">
              <Label>Cellphone</Label>
              <Input {...register("cellphone")} />
              {errors.cellphone && (
                <span className="text-xs text-destructive">{errors.cellphone.message}</span>
              )}
            </div>
          </div>

          <div className="space-y-size80">
            <Label>Department / Office</Label>
            <Controller
              control={control}
              name="department"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Department/Office">
                      {{
                        SECRETARIAT_OFFICE: "Secretariat Office",
                        RELATIONS_OFFICE: "Relations Office",
                        FINANCE_OFFICE: "Finance Office",
                        LOGISTICS_OFFICE: "Logistics Office",
                        CREATIVES_OFFICE: "Creatives Office",
                        MANAGEMENT_AND_DEVELOPMENT_OFFICE: "Management & Dev. Office",
                        STARTUP_DEVELOPERS_OFFICE: "Startup Developers Office",
                      }[field.value as string] ?? field.value}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SECRETARIAT_OFFICE">Secretariat Office</SelectItem>
                    <SelectItem value="RELATIONS_OFFICE">Relations Office</SelectItem>
                    <SelectItem value="FINANCE_OFFICE">Finance Office</SelectItem>
                    <SelectItem value="LOGISTICS_OFFICE">Logistics Office</SelectItem>
                    <SelectItem value="CREATIVES_OFFICE">Creatives Office</SelectItem>
                    <SelectItem value="MANAGEMENT_AND_DEVELOPMENT_OFFICE">
                      Management & Dev. Office
                    </SelectItem>
                    <SelectItem value="STARTUP_DEVELOPERS_OFFICE">
                      Startup Developers Office
                    </SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.department && (
              <span className="text-xs text-destructive">{errors.department.message}</span>
            )}
          </div>

          <div className="space-y-size80">
            <Label>College</Label>
            <Input {...register("college")} />
            {errors.college && (
              <span className="text-xs text-destructive">{errors.college.message}</span>
            )}
          </div>

          {/* Program & Section: 4-column unequal grid */}
          <div className="grid grid-cols-4 gap-size160">
            <div className="col-span-3 space-y-size80">
              <Label>Program</Label>
              <Input {...register("program")} />
              {errors.program && (
                <span className="text-xs text-destructive">{errors.program.message}</span>
              )}
            </div>
            <div className="col-span-1 space-y-size80">
              <Label>Section</Label>
              <Input {...register("section")} />
              {errors.section && (
                <span className="text-xs text-destructive">{errors.section.message}</span>
              )}
            </div>
          </div>

          <div className="space-y-size80">
            <Label>Campus</Label>
            <Controller
              control={control}
              name="campus"
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Campus">
                      {{
                        SAN_BARTOLOME_MAIN: "San Bartolome (Main)",
                        SAN_FRANCISCO: "San Francisco",
                        BATASAN: "Batasan",
                      }[field.value as string] ?? field.value}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SAN_BARTOLOME_MAIN">San Bartolome (Main)</SelectItem>
                    <SelectItem value="SAN_FRANCISCO">San Francisco</SelectItem>
                    <SelectItem value="BATASAN">Batasan</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
            {errors.campus && (
              <span className="text-xs text-destructive">{errors.campus.message}</span>
            )}
          </div>

          <div className="space-y-size80">
            <Label>House Address</Label>
            <Textarea {...register("houseAddress")} rows={3} />
            {errors.houseAddress && (
              <span className="text-xs text-destructive">{errors.houseAddress.message}</span>
            )}
          </div>

          <SheetFooter className="mt-size240 -mx-4 -mb-4 px-4 pb-4 border-t border-border pt-size160 flex flex-col gap-size80">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-full cursor-pointer"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="w-full cursor-pointer">
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
};
