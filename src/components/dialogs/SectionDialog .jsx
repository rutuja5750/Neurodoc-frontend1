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

const SectionDialog = ({ open, parentId, onClose, onSubmit }) => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      sectionNumber: '',
      sectionName: '',
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
          <DialogTitle>Create New Section</DialogTitle>
          <DialogDescription>
            Add a new section to the selected zone
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(submitForm)} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="sectionNumber">Section Number <span className="text-red-500">*</span></Label>
            <Input
              id="sectionNumber"
              placeholder="e.g., 1.1"
              {...register('sectionNumber', { required: 'Section number is required' })}
            />
            {errors.sectionNumber && (
              <p className="text-sm text-red-500">{errors.sectionNumber.message}</p>
            )}
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="sectionName">Section Name <span className="text-red-500">*</span></Label>
            <Input
              id="sectionName"
              placeholder="e.g., Project Management"
              {...register('sectionName', { required: 'Section name is required' })}
            />
            {errors.sectionName && (
              <p className="text-sm text-red-500">{errors.sectionName.message}</p>
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
              {isSubmitting ? 'Creating...' : 'Create Section'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SectionDialog;