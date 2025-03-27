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
      description: '',
      isRequired: true,
      isActive: true,
      'metadata.lifecycle': 'Draft',
      placeholders: ''
    }
  });

  const lifecycle = watch('metadata.lifecycle');

  const handleLifecycleChange = (value) => {
    setValue('metadata.lifecycle', value);
  };

  const submitForm = async (data) => {
    // Transform placeholders string to array
    const placeholders = data.placeholders.split(',')
      .map(item => item.trim())
      .filter(item => item.length > 0);
    
    const formattedData = {
      ...data,
      metadata: {
        lifecycle: data['metadata.lifecycle'],
        placeholders
      }
    };
    
    delete formattedData['metadata.lifecycle'];
    delete formattedData.placeholders;
    
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
          
          <div className="grid gap-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Describe the purpose of this sub-artifact..."
              {...register('description')}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="placeholders">Placeholders</Label>
            <Input
              id="placeholders"
              placeholder="e.g., SITE_ID,STUDY_ID,DATE (comma separated)"
              {...register('placeholders')}
            />
            <p className="text-xs text-muted-foreground">
              Enter placeholder variables separated by commas
            </p>
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="metadata.lifecycle">Lifecycle Stage</Label>
            <Select 
              value={lifecycle} 
              onValueChange={handleLifecycleChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select lifecycle stage" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Review">Review</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Archived">Archived</SelectItem>
              </SelectContent>
            </Select>
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