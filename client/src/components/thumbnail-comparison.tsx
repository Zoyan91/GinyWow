import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Thumbnail } from "@shared/schema";

interface ThumbnailComparisonProps {
  thumbnail: Thumbnail;
}

export default function ThumbnailComparison({ thumbnail }: ThumbnailComparisonProps) {
  const [showEnhanced, setShowEnhanced] = useState(false);

  const downloadThumbnail = (imageData: string, filename: string) => {
    const link = document.createElement('a');
    link.href = `data:image/jpeg;base64,${imageData}`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (!thumbnail.enhancedImageData || !thumbnail.enhancementMetrics) {
    return null;
  }

  const metrics = thumbnail.enhancementMetrics;

  return (
    <Card className="shadow-lg" data-testid="thumbnail-comparison">
      <CardContent className="p-8">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-semibold flex items-center">
            <i className="fas fa-magic text-primary mr-3"></i>
            Thumbnail Enhancement
          </h3>
          <Badge variant="secondary" className="bg-gradient-to-r from-accent to-green-500 text-white">
            <i className="fas fa-chart-line mr-1"></i>
            +{metrics.ctrImprovement}% CTR
          </Badge>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Before */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium">Before</h4>
              <Badge variant="outline">Original</Badge>
            </div>
            <motion.div 
              className="relative rounded-xl overflow-hidden bg-muted aspect-video cursor-pointer"
              whileHover={{ scale: 1.02 }}
              onClick={() => setShowEnhanced(false)}
              data-testid="original-thumbnail"
            >
              <img 
                src={`data:image/jpeg;base64,${thumbnail.originalImageData}`}
                alt="Original thumbnail" 
                className="w-full h-full object-cover"
              />
              {!showEnhanced && (
                <motion.div 
                  className="absolute inset-0 border-2 border-primary"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
              )}
            </motion.div>
          </div>

          {/* After */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-medium">After</h4>
              <Badge className="bg-accent text-accent-foreground">AI Enhanced</Badge>
            </div>
            <motion.div 
              className="relative rounded-xl overflow-hidden bg-muted aspect-video cursor-pointer"
              whileHover={{ scale: 1.02 }}
              onClick={() => setShowEnhanced(true)}
              data-testid="enhanced-thumbnail"
            >
              <img 
                src={`data:image/jpeg;base64,${thumbnail.enhancedImageData}`}
                alt="AI enhanced thumbnail" 
                className="w-full h-full object-cover"
              />
              {showEnhanced && (
                <motion.div 
                  className="absolute inset-0 border-2 border-accent"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                />
              )}
            </motion.div>
          </div>
        </div>

        {/* Enhancement Details */}
        <div className="grid md:grid-cols-3 gap-4 mb-6">
          <motion.div 
            className="bg-muted rounded-lg p-4 text-center"
            whileHover={{ y: -2 }}
            data-testid="contrast-metric"
          >
            <i className="fas fa-adjust text-primary text-2xl mb-2"></i>
            <h5 className="font-medium mb-1">Contrast</h5>
            <p className="text-sm text-muted-foreground">+{metrics.contrast}% Enhanced</p>
          </motion.div>
          
          <motion.div 
            className="bg-muted rounded-lg p-4 text-center"
            whileHover={{ y: -2 }}
            data-testid="saturation-metric"
          >
            <i className="fas fa-palette text-primary text-2xl mb-2"></i>
            <h5 className="font-medium mb-1">Saturation</h5>
            <p className="text-sm text-muted-foreground">+{metrics.saturation}% Boosted</p>
          </motion.div>
          
          <motion.div 
            className="bg-muted rounded-lg p-4 text-center"
            whileHover={{ y: -2 }}
            data-testid="clarity-metric"
          >
            <i className="fas fa-eye text-primary text-2xl mb-2"></i>
            <h5 className="font-medium mb-1">Clarity</h5>
            <p className="text-sm text-muted-foreground">+{metrics.clarity}% Sharper</p>
          </motion.div>
        </div>

        <div className="flex justify-center">
          <Button 
            onClick={() => downloadThumbnail(thumbnail.enhancedImageData!, `enhanced-${thumbnail.fileName}`)}
            className="px-8 py-3 bg-gradient-to-r from-primary to-secondary text-primary-foreground"
            data-testid="download-enhanced-button"
          >
            <i className="fas fa-download mr-2"></i>
            Download Enhanced Thumbnail
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
