import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import type { TitleOptimization } from "@shared/schema";

interface TitleOptimizerProps {
  thumbnailId?: string;
  onOptimizationComplete: (optimization: TitleOptimization) => void;
}

interface TitleSuggestion {
  title: string;
  score: number;
  estimatedCtr: number;
  seoScore: number;
  tags: string[];
  reasoning: string;
}

export default function TitleOptimizer({ thumbnailId, onOptimizationComplete }: TitleOptimizerProps) {
  const [originalTitle, setOriginalTitle] = useState("");
  const [suggestions, setSuggestions] = useState<TitleSuggestion[]>([]);
  const { toast } = useToast();

  const optimizeMutation = useMutation({
    mutationFn: async (title: string) => {
      const response = await apiRequest('POST', '/api/titles/optimize', {
        originalTitle: title,
        thumbnailId,
      });
      return response.json();
    },
    onSuccess: (data) => {
      setSuggestions(data.suggestions);
      onOptimizationComplete(data.optimization);
      toast({
        title: "Titles optimized!",
        description: "Check out the AI-generated suggestions below.",
      });
    },
    onError: (error) => {
      toast({
        title: "Optimization failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleOptimize = () => {
    if (!originalTitle.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a title to optimize.",
        variant: "destructive",
      });
      return;
    }
    optimizeMutation.mutate(originalTitle);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard!",
      description: "Title has been copied to your clipboard.",
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 9) return "bg-green-500";
    if (score >= 8) return "bg-orange-500";
    if (score >= 7) return "bg-yellow-500";
    if (score >= 6) return "bg-blue-500";
    return "bg-purple-500";
  };

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300" data-testid="title-optimizer">
      <CardContent className="p-8">
        <h3 className="text-2xl font-semibold mb-6 flex items-center">
          <i className="fas fa-heading text-primary mr-3"></i>
          Title Optimization
        </h3>
        
        {/* Title Input */}
        <div className="mb-8">
          <Label className="block text-sm font-medium mb-3">Your Current Title</Label>
          <div className="relative">
            <Input
              type="text"
              placeholder="Enter your YouTube video title..."
              value={originalTitle}
              onChange={(e) => setOriginalTitle(e.target.value)}
              className="pr-24 py-4 text-lg"
              data-testid="title-input"
            />
            <Button
              onClick={handleOptimize}
              disabled={optimizeMutation.isPending || !originalTitle.trim()}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-gradient-to-r from-primary to-secondary"
              data-testid="optimize-button"
            >
              {optimizeMutation.isPending ? (
                <i className="fas fa-spinner fa-spin mr-1"></i>
              ) : (
                <i className="fas fa-magic mr-1"></i>
              )}
              Optimize
            </Button>
          </div>
          <p className="text-sm text-muted-foreground mt-2 flex items-center">
            <i className="fas fa-info-circle mr-1"></i>
            Current title: {originalTitle.length} characters • SEO Score: {originalTitle.length > 0 ? Math.min(10, Math.floor(originalTitle.length / 6)) : 0}/10
          </p>
        </div>

        {/* Title Suggestions */}
        <AnimatePresence>
          {suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              data-testid="title-suggestions"
            >
              <div className="flex items-center justify-between mb-6">
                <h4 className="text-lg font-medium">AI-Generated Suggestions</h4>
                <span className="text-sm text-muted-foreground">Ranked by potential performance</span>
              </div>
              
              <div className="space-y-4">
                {suggestions.map((suggestion, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="group p-4 border border-border rounded-lg hover:border-primary/50 hover:bg-muted/30 transition-all duration-200 cursor-pointer"
                    onClick={() => copyToClipboard(suggestion.title)}
                    data-testid={`title-suggestion-${index}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h5 className="font-medium text-lg flex-1 mr-4 group-hover:text-primary transition-colors">
                        {suggestion.title}
                      </h5>
                      <div className="flex items-center space-x-2">
                        <Badge className={`${getScoreColor(suggestion.score)} text-white`}>
                          {suggestion.score.toFixed(1)}/10
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            copyToClipboard(suggestion.title);
                          }}
                          data-testid={`copy-button-${index}`}
                        >
                          <i className="fas fa-copy"></i>
                        </Button>
                      </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 text-xs mb-2">
                      {suggestion.tags.slice(0, 3).map((tag, tagIndex) => (
                        <Badge key={tagIndex} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <p className="text-sm text-muted-foreground">
                      {suggestion.title.length} characters • Est. CTR: +{suggestion.estimatedCtr}% • SEO Score: {suggestion.seoScore}/10
                    </p>
                    
                    {suggestion.reasoning && (
                      <p className="text-xs text-muted-foreground mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {suggestion.reasoning}
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
