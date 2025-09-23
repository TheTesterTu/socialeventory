
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, X, Loader2, ImageIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { useFileUpload } from "@/hooks/useFileUpload";

interface ImageUploadProps {
  onImageSelect: (url: string) => void;
  currentImage?: string;
  className?: string;
  aspectRatio?: "square" | "video" | "auto";
  placeholder?: string;
  bucket?: string;
  folder?: string;
}

export const ImageUpload = ({
  onImageSelect,
  currentImage,
  className,
  aspectRatio = "video",
  placeholder = "Click to upload image",
  bucket = "events",
  folder = "images"
}: ImageUploadProps) => {
  const [preview, setPreview] = useState<string | null>(currentImage || null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { uploadFile, uploading, progress } = useFileUpload({
    bucket,
    folder,
    maxSizeMB: 10,
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
    onProgress: (prog) => {} // Silent progress
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create preview immediately
    const previewUrl = URL.createObjectURL(file);
    setPreview(previewUrl);

    // Upload file
    const uploadedUrl = await uploadFile(file);
    if (uploadedUrl) {
      onImageSelect(uploadedUrl);
      // Clean up preview URL
      URL.revokeObjectURL(previewUrl);
      setPreview(uploadedUrl);
    } else {
      // Reset preview on error
      setPreview(currentImage || null);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onImageSelect("");
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const getAspectRatioClass = () => {
    switch (aspectRatio) {
      case "square": return "aspect-square";
      case "video": return "aspect-video";
      default: return "";
    }
  };

  return (
    <div className={className}>
      <input
        type="file"
        accept="image/*"
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
              getAspectRatioClass()
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
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
                <p className="text-sm">{progress}%</p>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div
          onClick={() => inputRef.current?.click()}
          className={cn(
            "border-2 border-dashed border-border rounded-lg flex flex-col items-center justify-center p-6 transition-colors cursor-pointer hover:border-primary/50 hover:bg-primary/5",
            getAspectRatioClass(),
            uploading && "pointer-events-none opacity-70"
          )}
        >
          {uploading ? (
            <div className="flex flex-col items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
              <p className="text-sm text-muted-foreground">Uploading... {progress}%</p>
            </div>
          ) : (
            <>
              <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
              <p className="text-sm font-medium">{placeholder}</p>
              <p className="text-xs text-muted-foreground mt-1">
                PNG, JPG, WebP up to 10MB
              </p>
            </>
          )}
        </div>
      )}
    </div>
  );
};
