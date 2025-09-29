
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

interface FileUploadProps {
  onFileSelect: (url: string) => void;
  currentFile?: string;
  accept?: string;
  maxSize?: number; // in MB
  className?: string;
  bucketName?: string;
  folder?: string;
  aspectRatio?: string;
  variant?: "button" | "dropzone";
}

export const FileUpload = ({
  onFileSelect,
  currentFile,
  accept = "image/*",
  maxSize = 5, // Default 5MB
  className,
  bucketName = "media",
  folder = "uploads",
  aspectRatio = "1:1",
  variant = "dropzone"
}: FileUploadProps) => {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentFile || null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size
    if (file.size > maxSize * 1024 * 1024) {
      toast.error(`File size exceeds ${maxSize}MB limit`);
      return;
    }
    
    try {
      setUploading(true);
      
      // Create a preview URL
      const previewUrl = URL.createObjectURL(file);
      setPreview(previewUrl);
      
      if (supabase.storage) {
        // Create unique file path
        const fileExt = file.name.split('.').pop();
        const fileName = `${user?.id || 'anonymous'}-${Date.now()}.${fileExt}`;
        const filePath = `${folder}/${fileName}`;
        
        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
          .from(bucketName)
          .upload(filePath, file);
          
        if (error) {
          throw error;
        }
        
        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from(bucketName)
          .getPublicUrl(filePath);
          
        // Pass the URL to parent component
        onFileSelect(publicUrl);
      } else {
        // If Supabase storage is not configured, just use the preview URL
        // In a real app, this should handle with server uploads
        onFileSelect(previewUrl);
        
        // File upload successful via Supabase storage
        toast.warning("Storage not configured. Using local preview only");
      }
    } catch (error: any) {
      console.error("Upload error:", error);
      toast.error(error.message || "Error uploading file");
      setPreview(null);
    } finally {
      setUploading(false);
    }
  };
  
  const handleRemove = () => {
    setPreview(null);
    onFileSelect("");
    
    // Reset input value so same file can be uploaded again if needed
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };
  
  // Button variant
  if (variant === "button") {
    return (
      <div className={className}>
        <input
          type="file"
          accept={accept}
          onChange={handleFileChange}
          ref={inputRef}
          className="hidden"
          disabled={uploading}
        />
        
        <div className="flex items-center gap-2">
          {preview ? (
            <>
              <div className="h-10 w-10 rounded-md overflow-hidden flex-shrink-0">
                <img 
                  src={preview} 
                  alt="Preview" 
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex gap-2 items-center">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => inputRef.current?.click()}
                  disabled={uploading}
                >
                  {uploading ? (
                    <><Loader2 className="h-4 w-4 animate-spin mr-1" /> Uploading...</>
                  ) : (
                    <><Upload className="h-4 w-4 mr-1" /> Change</>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  onClick={handleRemove}
                  disabled={uploading}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </>
          ) : (
            <Button 
              variant="outline"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? (
                <><Loader2 className="h-4 w-4 animate-spin mr-2" /> Uploading...</>
              ) : (
                <><Upload className="h-4 w-4 mr-2" /> Upload File</>
              )}
            </Button>
          )}
        </div>
      </div>
    );
  }
  
  // Dropzone variant (default)
  return (
    <div className={className}>
      <input
        type="file"
        accept={accept}
        onChange={handleFileChange}
        ref={inputRef}
        className="hidden"
        disabled={uploading}
      />
      
      {preview ? (
        <div className="relative">
          <div 
            className={cn(
              "border border-border rounded-lg overflow-hidden bg-background",
              aspectRatio === "1:1" && "aspect-square",
              aspectRatio === "16:9" && "aspect-video"
            )}
          >
            <img 
              src={preview} 
              alt="Preview" 
              className="h-full w-full object-cover"
            />
          </div>
          
          <div className="absolute top-2 right-2 flex gap-2">
            <Button 
              variant="outline" 
              size="icon"
              className="h-8 w-8 bg-background/80 backdrop-blur-sm"
              onClick={() => inputRef.current?.click()}
              disabled={uploading}
            >
              <Upload className="h-4 w-4" />
            </Button>
            <Button 
              variant="outline" 
              size="icon"
              className="h-8 w-8 bg-background/80 backdrop-blur-sm"
              onClick={handleRemove}
              disabled={uploading}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          )}
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          className={cn(
            "border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center p-4 transition-colors cursor-pointer hover:border-primary/50 hover:bg-primary/5",
            aspectRatio === "1:1" && "aspect-square",
            aspectRatio === "16:9" && "aspect-video",
            uploading && "pointer-events-none opacity-70"
          )}
        >
          {uploading ? (
            <div className="flex flex-col items-center justify-center py-4">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
              <p className="text-sm text-muted-foreground">Uploading...</p>
            </div>
          ) : (
            <>
              <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm font-medium">Click or drag file to upload</p>
              <p className="text-xs text-muted-foreground mt-1">
                {accept.replace("image/*", "Images")} up to {maxSize}MB
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
};
