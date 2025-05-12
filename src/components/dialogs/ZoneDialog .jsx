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

const ZoneDialog = ({ open, onClose, onSubmit }) => {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      zoneNumber: '',
      zoneName: '',
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
          <DialogTitle>Create New Zone</DialogTitle>
          <DialogDescription>
            Add a new zone to the TMF Reference Model structure
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit(submitForm)} className="space-y-4">
          <div className="grid gap-2">
            <Label htmlFor="zoneNumber">Zone Number <span className="text-red-500">*</span></Label>
            <Input
              id="zoneNumber"
              type="number"
              placeholder="e.g., 1"
              {...register('zoneNumber', { 
                required: 'Zone number is required',
                valueAsNumber: true
              })}
            />
            {errors.zoneNumber && (
              <p className="text-sm text-red-500">{errors.zoneNumber.message}</p>
            )}
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="zoneName">Zone Name <span className="text-red-500">*</span></Label>
            <Input
              id="zoneName"
              placeholder="e.g., Trial Management"
              {...register('zoneName', { required: 'Zone name is required' })}
            />
            {errors.zoneName && (
              <p className="text-sm text-red-500">{errors.zoneName.message}</p>
            )}
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
              {isSubmitting ? 'Creating...' : 'Create Zone'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ZoneDialog;