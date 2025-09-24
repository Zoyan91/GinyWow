import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import BaseImageTool, { ProcessResult } from "./BaseImageTool";

export default function CompressTool() {
  const [quality, setQuality] = useState([80]);

  const handleProcess = async (file: File, options: any): Promise<ProcessResult> => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('quality', quality[0].toString());

    try {
      const response = await fetch('/api/image-tools/compress', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Failed to compress image'
        };
      }

      return {
        success: true,
        processedImage: data.processedImage,
        downloadName: data.downloadName,
        metadata: {
          quality: `${quality[0]}%`,
          originalSize: `${Math.round(data.originalSize / 1024)} KB`,
          compressedSize: `${Math.round(data.compressedSize / 1024)} KB`,
          compressionRatio: data.compressionRatio,
          spaceSaved: `${Math.round((data.originalSize - data.compressedSize) / 1024)} KB`
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
      title="Compress Image"
      description="Reduce file size while maintaining visual quality. Adjust the quality slider to control compression level."
      onProcess={handleProcess}
      processButtonText="Compress Image"
    >
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label>Quality Level</Label>
            <span className="text-sm font-medium bg-blue-50 px-2 py-1 rounded">
              {quality[0]}%
            </span>
          </div>
          <Slider
            value={quality}
            onValueChange={setQuality}
            min={10}
            max={95}
            step={5}
            className="w-full"
            data-testid="quality-slider"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Smaller file</span>
            <span>Better quality</span>
          </div>
        </div>

        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Quality Guide</h4>
          <div className="text-sm text-gray-600 space-y-1">
            <div className="flex justify-between">
              <span>• 10-30%:</span>
              <span>Maximum compression, lower quality</span>
            </div>
            <div className="flex justify-between">
              <span>• 50-70%:</span>
              <span>Good balance of size and quality</span>
            </div>
            <div className="flex justify-between">
              <span>• 80-95%:</span>
              <span>High quality, larger file size</span>
            </div>
          </div>
        </div>
      </div>
    </BaseImageTool>
  );
}