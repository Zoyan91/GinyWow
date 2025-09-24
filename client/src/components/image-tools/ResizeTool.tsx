import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import BaseImageTool, { ProcessResult } from "./BaseImageTool";

export default function ResizeTool() {
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [maintainAspectRatio, setMaintainAspectRatio] = useState(true);

  const handleProcess = async (file: File, options: any): Promise<ProcessResult> => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('width', width);
    formData.append('height', height);
    formData.append('maintainAspectRatio', maintainAspectRatio.toString());

    try {
      const response = await fetch('/api/image-tools/resize', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.error || 'Failed to resize image'
        };
      }

      return {
        success: true,
        processedImage: data.processedImage,
        downloadName: data.downloadName,
        metadata: {
          originalSize: `${data.originalSize.width || 'Auto'} × ${data.originalSize.height || 'Auto'}`,
          newSize: `${data.newSize.width || 'Auto'} × ${data.newSize.height || 'Auto'}`,
          maintainAspectRatio: maintainAspectRatio ? 'Yes' : 'No'
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
      title="Resize Image"
      description="Change the dimensions of your image while maintaining quality. Enter new width and height values."
      onProcess={handleProcess}
      processButtonText="Resize Image"
    >
      <div className="space-y-4">
        <div>
          <Label htmlFor="width">Width (pixels)</Label>
          <Input
            id="width"
            type="number"
            placeholder="e.g. 800"
            value={width}
            onChange={(e) => setWidth(e.target.value)}
            className="mt-1"
            data-testid="width-input"
          />
        </div>
        
        <div>
          <Label htmlFor="height">Height (pixels)</Label>
          <Input
            id="height"
            type="number"
            placeholder="e.g. 600"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="mt-1"
            data-testid="height-input"
          />
        </div>

        <div className="flex items-center space-x-2">
          <Checkbox
            id="maintain-aspect-ratio"
            checked={maintainAspectRatio}
            onCheckedChange={(checked) => setMaintainAspectRatio(checked === true)}
            data-testid="maintain-aspect-ratio-checkbox"
          />
          <Label htmlFor="maintain-aspect-ratio" className="text-sm">
            Maintain aspect ratio
          </Label>
        </div>

        <div className="text-sm text-gray-500">
          <p>• Leave width or height empty to auto-calculate</p>
          <p>• Maintaining aspect ratio prevents distortion</p>
        </div>
      </div>
    </BaseImageTool>
  );
}