import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Thumbnail, TitleOptimization } from "@shared/schema";

interface AnalyticsDashboardProps {
  thumbnail?: Thumbnail | null;
  optimization?: TitleOptimization | null;
}

export default function AnalyticsDashboard({ thumbnail, optimization }: AnalyticsDashboardProps) {
  if (!thumbnail && !optimization) {
    return null;
  }

  const ctrImprovement = thumbnail?.enhancementMetrics?.ctrImprovement || 0;
  const bestTitleScore = optimization?.optimizedTitles?.[0]?.seoScore || 0;
  const avgEstimatedCtr = optimization?.optimizedTitles && optimization.optimizedTitles.length > 0 
    ? optimization.optimizedTitles.reduce((acc, curr) => acc + curr.estimatedCtr, 0) / optimization.optimizedTitles.length 
    : 0;

  // Extract trending keywords from title suggestions
  const trendingKeywords = (optimization?.optimizedTitles?.flatMap(title => title.tags) ?? []).slice(0, 10);
  const uniqueKeywords = Array.from(new Set(trendingKeywords));

  return (
    <Card className="shadow-lg" data-testid="analytics-dashboard">
      <CardContent className="p-8">
        <h3 className="text-2xl font-semibold mb-6 flex items-center">
          <i className="fas fa-chart-bar text-primary mr-3"></i>
          Performance Insights
        </h3>
        
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <motion.div 
            className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl"
            whileHover={{ scale: 1.05 }}
            data-testid="ctr-improvement-metric"
          >
            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
              <i className="fas fa-eye"></i>
            </div>
            <h4 className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
              +{Math.max(ctrImprovement, avgEstimatedCtr).toFixed(0)}%
            </h4>
            <p className="text-blue-700 dark:text-blue-300 font-medium">Expected CTR Increase</p>
          </motion.div>
          
          <motion.div 
            className="text-center p-6 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl"
            whileHover={{ scale: 1.05 }}
            data-testid="seo-score-metric"
          >
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
              <i className="fas fa-search"></i>
            </div>
            <h4 className="text-2xl font-bold text-green-600 dark:text-green-400 mb-1">
              {bestTitleScore.toFixed(1)}/10
            </h4>
            <p className="text-green-700 dark:text-green-300 font-medium">SEO Optimization Score</p>
          </motion.div>
          
          <motion.div 
            className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-xl"
            whileHover={{ scale: 1.05 }}
            data-testid="quality-metric"
          >
            <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
              <i className="fas fa-star"></i>
            </div>
            <h4 className="text-2xl font-bold text-purple-600 dark:text-purple-400 mb-1">Premium</h4>
            <p className="text-purple-700 dark:text-purple-300 font-medium">Quality Enhancement</p>
          </motion.div>
        </div>

        {/* Trending Keywords */}
        {uniqueKeywords.length > 0 && (
          <motion.div 
            className="bg-muted rounded-xl p-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            data-testid="trending-keywords"
          >
            <h4 className="text-lg font-medium mb-4 flex items-center">
              <i className="fas fa-fire text-orange-500 mr-2"></i>
              Trending Keywords in Your Niche
            </h4>
            <div className="flex flex-wrap gap-2">
              {uniqueKeywords.map((keyword, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Badge 
                    variant="outline" 
                    className="bg-background hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer"
                    data-testid={`keyword-${index}`}
                  >
                    {keyword}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Enhancement Summary */}
        {thumbnail?.enhancementMetrics && (
          <motion.div 
            className="mt-6 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border border-primary/20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            data-testid="enhancement-summary"
          >
            <h5 className="font-medium mb-2 flex items-center">
              <i className="fas fa-magic text-primary mr-2"></i>
              Enhancement Summary
            </h5>
            <p className="text-sm text-muted-foreground">
              Your thumbnail has been enhanced with {thumbnail.enhancementMetrics.contrast}% improved contrast, 
              {thumbnail.enhancementMetrics.saturation}% boosted saturation, and {thumbnail.enhancementMetrics.clarity}% 
              increased clarity for maximum visual impact.
            </p>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
}
