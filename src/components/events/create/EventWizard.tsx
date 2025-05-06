import React from 'react';
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, ChevronLeft, ChevronRight, Loader2, Save } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface Step {
  id: string;
  title: string;
  component: React.ReactNode;
  isComplete: (data: any) => boolean;
}

interface EventWizardProps {
  steps: Step[];
  onComplete: (data: any) => void;
  onSaveDraft?: (data: any) => void;
  initialData?: any;
  isProcessing?: boolean;
}

export const EventWizard = ({
  steps,
  onComplete,
  onSaveDraft,
  initialData = {},
  isProcessing = false
}: EventWizardProps) => {
  const { user } = useAuth();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formData, setFormData] = useState(initialData);
  const [savingDraft, setSavingDraft] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const [autoSaveTimer, setAutoSaveTimer] = useState<NodeJS.Timeout | null>(null);

  const currentStep = steps[currentStepIndex];
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === steps.length - 1;

  // Auto-save draft every 2 minutes
  useEffect(() => {
    if (!user || !onSaveDraft) return;
    
    // Clear existing timer if any
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer);
    }
    
    // Set new timer
    const timer = setTimeout(() => {
      handleSaveDraft(true);
    }, 2 * 60 * 1000); // 2 minutes
    
    setAutoSaveTimer(timer);
    
    // Cleanup on unmount
    return () => {
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
      }
    };
  }, [formData, user]);
  
  // Set draft saved indicator timeout
  useEffect(() => {
    if (draftSaved) {
      const timer = setTimeout(() => {
        setDraftSaved(false);
      }, 3000);
      
      return () => clearTimeout(timer);
    }
  }, [draftSaved]);

  const handleNext = () => {
    if (isLastStep) {
      onComplete(formData);
    } else {
      setCurrentStepIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handleBack = () => {
    setCurrentStepIndex((prevIndex) => prevIndex - 1);
  };

  const updateFormData = (newData: any) => {
    setFormData((prevData) => ({
      ...prevData,
      ...newData
    }));
  };

  const handleSaveDraft = async (isAutoSave = false) => {
    if (!user || !onSaveDraft) return;
    
    setSavingDraft(true);
    try {
      // Call the provided onSaveDraft handler
      await onSaveDraft(formData);
      
      setDraftSaved(true);
      if (!isAutoSave) {
        toast.success("Draft saved successfully");
      }
    } catch (error) {
      console.error("Error saving draft:", error);
      if (!isAutoSave) {
        toast.error("Failed to save draft");
      }
    } finally {
      setSavingDraft(false);
    }
  };

  const isStepComplete = currentStep.isComplete(formData);

  return (
    <div className="space-y-8">
      {/* Progress bar */}
      <div className="relative">
        <div className="overflow-hidden h-2 text-xs flex rounded-full bg-primary/10">
          <div 
            className="shadow-lg bg-primary transition-all duration-500 ease-in-out"
            style={{ width: `${((currentStepIndex + 1) / steps.length) * 100}%` }}
          />
        </div>
        
        <div className="flex justify-between mt-2">
          {steps.map((step, index) => (
            <div 
              key={step.id} 
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full transition-all",
                index < currentStepIndex ? "bg-primary text-primary-foreground" :
                index === currentStepIndex ? "bg-primary/10 border border-primary text-primary" :
                "bg-muted text-muted-foreground"
              )}
            >
              {index < currentStepIndex ? (
                <CheckCircle className="h-4 w-4" />
              ) : (
                <span className="text-xs font-medium">{index + 1}</span>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <Card className="shadow-lg border-primary/10">
        <CardContent className="pt-6">
          <motion.div
            key={currentStep.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {/* Render the current step component with form data */}
            {React.cloneElement(currentStep.component as React.ReactElement, {
              data: formData,
              updateData: updateFormData
            })}
          </motion.div>
        </CardContent>
      </Card>
      
      {/* Navigation buttons */}
      <div className="flex justify-between items-center">
        <div>
          {!isFirstStep && (
            <Button 
              onClick={handleBack} 
              variant="outline"
              disabled={isProcessing}
            >
              <ChevronLeft className="mr-1 h-4 w-4" />
              Back
            </Button>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          {onSaveDraft && (
            <Button 
              onClick={() => handleSaveDraft()}
              variant="outline" 
              disabled={isProcessing || savingDraft}
              className="relative"
            >
              {savingDraft ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
              ) : draftSaved ? (
                <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
              ) : (
                <Save className="h-4 w-4 mr-1" />
              )}
              Save Draft
            </Button>
          )}
          
          <Button 
            onClick={handleNext}
            disabled={!isStepComplete || isProcessing}
          >
            {isProcessing ? (
              <><Loader2 className="h-4 w-4 animate-spin mr-1" /> Processing...</>
            ) : isLastStep ? (
              "Complete"
            ) : (
              <>Next <ChevronRight className="ml-1 h-4 w-4" /></>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
