import React from 'react';
import { useForm } from 'react-hook-form';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const SubArtifactDialog = ({ open, parentId, onClose, onSubmit }) => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting }, setValue, watch } = useForm({
    defaultValues: {
      subArtifactNumber: '',
      subArtifactName: '',
      isRequired: true,
      isActive: true,
    }
  });

  const submitForm = async (data) => {
    // Transform placeholders string to array
    
    const formattedData = {
      ...data,
      
    };
   
    await onSubmit(formattedData);
    reset();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Sub-Artifact</DialogTitle>
          <DialogDescription>
            Add a new sub-artifact to the selected artifact
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(submitForm)} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="subArtifactNumber">Sub-Artifact Number <span className="text-red-500">*</span></Label>
            <Input
              id="subArtifactNumber"
              placeholder="e.g., 1.1.1.1"
              {...register('subArtifactNumber', { required: 'Sub-artifact number is required' })}
            />
            {errors.subArtifactNumber && (
              <p className="text-sm text-red-500">{errors.subArtifactNumber.message}</p>
            )}
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="subArtifactName">Sub-Artifact Name <span className="text-red-500">*</span></Label>
            <Input
              id="subArtifactName"
              placeholder="e.g., Site Management Plan"
              {...register('subArtifactName', { required: 'Sub-artifact name is required' })}
            />
            {errors.subArtifactName && (
              <p className="text-sm text-red-500">{errors.subArtifactName.message}</p>
            )}
          </div>
           
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="isRequired" 
              defaultChecked={true}
              {...register('isRequired')}
            />
            <Label htmlFor="isRequired">Required</Label>
          </div>
          
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="isActive" 
              defaultChecked={true}
              {...register('isActive')}
            />
            <Label htmlFor="isActive">Active</Label>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Creating...' : 'Create Sub-Artifact'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SubArtifactDialog;