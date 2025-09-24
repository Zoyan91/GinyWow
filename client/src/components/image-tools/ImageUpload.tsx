import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, X, FileImage } from "lucide-react";

interface ImageUploadProps {
  onImageSelect: (file: File, preview: string) => void;
  onImageRemove: () => void;
  selectedImage?: string;
  maxSize?: number; // in bytes
  acceptedTypes?: string[];
  className?: string;
}

export default function ImageUpload({ 
  onImageSelect, 
  onImageRemove, 
  selectedImage, 
  maxSize = 20 * 1024 * 1024, // 20MB default
  acceptedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/gif'],
  className = ""
}: ImageUploadProps) {
  const [uploadError, setUploadError] = useState<string>("");

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setUploadError("");
    
    if (rejectedFiles.length > 0) {
      const error = rejectedFiles[0].errors[0];
      if (error.code === 'file-too-large') {
        setUploadError(`File is too large. Maximum size is ${Math.round(maxSize / 1024 / 1024)}MB.`);
      } else if (error.code === 'file-invalid-type') {
        setUploadError('Invalid file type. Please upload an image file.');
      } else {
        setUploadError('Error uploading file. Please try again.');
      }
      return;
    }

    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      const reader = new FileReader();
      
      reader.onload = (e) => {
        const preview = e.target?.result as string;
        onImageSelect(file, preview);
      };
      
      reader.readAsDataURL(file);
    }
  }, [onImageSelect, maxSize]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: acceptedTypes.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxSize,
    multiple: false
  });

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {!selectedImage ? (
        <Card className="border-2 border-dashed border-gray-300 hover:border-blue-400 transition-colors">
          <CardContent className="p-0">
            <div
              {...getRootProps()}
              className={`p-8 text-center cursor-pointer transition-colors ${
                isDragActive ? 'bg-blue-50 border-blue-400' : 'hover:bg-gray-50'
              }`}
              data-testid="image-upload-dropzone"
            >
              <input {...getInputProps()} data-testid="image-upload-input" />
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                {isDragActive ? 'Drop your image here' : 'Upload Image'}
              </h3>
              <p className="text-gray-500 mb-4">
                Drag and drop an image file here, or click to select
              </p>
              <p className="text-sm text-gray-400">
                Supports: {acceptedTypes.map(type => type.split('/')[1].toUpperCase()).join(', ')}
                <br />
                Max size: {formatFileSize(maxSize)}
              </p>
              <Button type="button" variant="outline" className="mt-4" data-testid="select-file-button">
                Select File
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-4">
            <div className="relative">
              <img
                src={selectedImage}
                alt="Selected image"
                className="max-w-full max-h-96 mx-auto rounded-lg"
                data-testid="selected-image-preview"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2"
                onClick={onImageRemove}
                data-testid="remove-image-button"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div className="mt-4 text-center">
              <Button
                type="button"
                variant="outline"
                onClick={onImageRemove}
                className="mr-2"
                data-testid="change-image-button"
              >
                <FileImage className="h-4 w-4 mr-2" />
                Change Image
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {uploadError && (
        <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg" data-testid="upload-error">
          {uploadError}
        </div>
      )}
    </div>
  );
}