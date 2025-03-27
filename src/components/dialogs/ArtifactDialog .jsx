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

const ArtifactDialog = ({ open, parentId, onClose, onSubmit }) => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      artifactNumber: '',
      artifactName: '',
      ichCode: '',
      artifactSubcategory: '',
      description: '',
      isRequired: true,
      isActive: true
    }
  });

  const submitForm = async (data) => {
    await onSubmit(data);
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
          <DialogTitle>Create New Artifact</DialogTitle>
          <DialogDescription>
            Add a new artifact to the selected section
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(submitForm)} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="artifactNumber">Artifact Number <span className="text-red-500">*</span></Label>
            <Input
              id="artifactNumber"
              placeholder="e.g., 1.1.1"
              {...register('artifactNumber', { required: 'Artifact number is required' })}
            />
            {errors.artifactNumber && (
              <p className="text-sm text-red-500">{errors.artifactNumber.message}</p>
            )}
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="artifactName">Artifact Name <span className="text-red-500">*</span></Label>
            <Input
              id="artifactName"
              placeholder="e.g., Trial Master Plan"
              {...register('artifactName', { required: 'Artifact name is required' })}
            />
            {errors.artifactName && (
              <p className="text-sm text-red-500">{errors.artifactName.message}</p>
            )}
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="ichCode">ICH Code</Label>
            <Input
              id="ichCode"
              placeholder="e.g., E6"
              {...register('ichCode')}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="artifactSubcategory">Subcategory</Label>
            <Input
              id="artifactSubcategory"
              placeholder="e.g., Management"
              {...register('artifactSubcategory')}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the purpose of this artifact..."
              {...register('description')}
            />
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
              {isSubmitting ? 'Creating...' : 'Create Artifact'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ArtifactDialog;