import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import BaseImageTool, { ProcessResult } from "./BaseImageTool";

export default function ConvertTool() {
  const [format, setFormat] = useState("");

  const formatOptions = [
    { value: "png", label: "PNG", description: "Best for images with transparency" },
    { value: "jpeg", label: "JPEG", description: "Best for photos and detailed images" },
    { value: "webp", label: "WebP", description: "Modern format with excellent compression" },
  ];

  const comingSoonFormats = [
    { label: "SVG", description: "Coming soon - Vector graphics format" },
    { label: "GIF", description: "Coming soon - Animated images format" },
    { label: "HEIC", description: "Coming soon - High efficiency image format" },
    { label: "PDF", description: "Coming soon - Document format conversion" },
  ];

  const handleProcess = async (file: File, options: any): Promise<ProcessResult> => {
    if (!format) {
      return {
        success: false,
        error: 'Please select a target format'
      };
    }

    const formData = new FormData();
    formData.append('image', file);
    formData.append('format', format);

    try {
      const response = await fetch('/api/image-tools/convert', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Failed to convert image'
        };
      }

      return {
        success: true,
        processedImage: data.processedImage,
        downloadName: data.downloadName,
        metadata: {
          originalFormat: data.originalFormat.split('/')[1].toUpperCase(),
          newFormat: data.newFormat.split('/')[1].toUpperCase(),
          conversion: `${data.originalFormat.split('/')[1].toUpperCase()} → ${data.newFormat.split('/')[1].toUpperCase()}`
        }
      };
    } catch (error) {
      return {
        success: false,
        error: 'Network error. Please check your connection and try again.'
      };
    }
  };

  return (
    <BaseImageTool
      title="Convert Image Format"
      description="Convert your image between different formats like PNG, JPEG, and WebP. Each format has its own advantages for different use cases."
      onProcess={handleProcess}
      processButtonText="Convert Image"
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="format">Target Format</Label>
          <Select value={format} onValueChange={setFormat}>
            <SelectTrigger className="mt-1" data-testid="format-select">
              <SelectValue placeholder="Choose a format..." />
            </SelectTrigger>
            <SelectContent>
              {formatOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div>
                    <div className="font-medium">{option.label}</div>
                    <div className="text-xs text-gray-500">{option.description}</div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium mb-3">Available Formats</h4>
          <div className="text-sm text-gray-600 space-y-2 mb-3">
            <div>
              <strong>PNG:</strong> Lossless compression, supports transparency. Best for logos, icons, and images with text.
            </div>
            <div>
              <strong>JPEG:</strong> Lossy compression, smaller file sizes. Best for photos and complex images.
            </div>
            <div>
              <strong>WebP:</strong> Modern format with superior compression. Supported by most modern browsers.
            </div>
          </div>
          
          <h4 className="font-medium mb-2 text-orange-600">Coming Soon</h4>
          <div className="text-sm text-gray-500 space-y-1">
            {comingSoonFormats.map((fmt) => (
              <div key={fmt.label}>
                <strong>{fmt.label}:</strong> {fmt.description}
              </div>
            ))}
          </div>
        </div>
      </div>
    </BaseImageTool>
  );
}