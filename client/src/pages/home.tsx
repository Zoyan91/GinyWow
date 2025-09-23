import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, CheckCircle2, ArrowRight, Sparkles, Users, Zap, Shield, Target, TrendingUp, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ImageUpload from "@/components/image-upload";
import ThumbnailComparison from "@/components/thumbnail-comparison";
import type { Thumbnail, TitleOptimization } from "@shared/schema";

export default function Home() {
  const [title, setTitle] = useState("");
  const [uploadedThumbnail, setUploadedThumbnail] = useState<Thumbnail | null>(null);
  const [optimizationResult, setOptimizationResult] = useState<any>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [titleSuggestions, setTitleSuggestions] = useState<any[]>([]);
  const { toast } = useToast();

  // Newsletter subscription functionality
  const NewsletterSection = () => {
    const [email, setEmail] = useState("");
    const [isSubscribing, setIsSubscribing] = useState(false);
    const [subscriptionStatus, setSubscriptionStatus] = useState<{
      type: 'idle' | 'success' | 'error';
      message: string;
    }>({ type: 'idle', message: '' });

    const handleNewsletterSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!email || !email.includes('@')) {
        setSubscriptionStatus({
          type: 'error',
          message: 'Please enter a valid email address'
        });
        return;
      }

      setIsSubscribing(true);
      setSubscriptionStatus({ type: 'idle', message: '' });

      try {
        const response = await fetch('/api/newsletter/subscribe', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
          setSubscriptionStatus({
            type: 'success',
            message: data.message || 'Successfully subscribed to newsletter!'
          });
          setEmail('');
        } else {
          setSubscriptionStatus({
            type: 'error',
            message: data.error || 'Failed to subscribe. Please try again.'
          });
        }
      } catch (error) {
        console.error('Newsletter subscription error:', error);
        setSubscriptionStatus({
          type: 'error',
          message: 'Network error. Please check your connection and try again.'
        });
      } finally {
        setIsSubscribing(false);
      }
    };

    return (
      <section className="relative py-8 sm:py-12 lg:py-16 mt-12 bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-32 h-32 sm:w-64 sm:h-64 bg-blue-200 rounded-full opacity-10 blur-2xl sm:blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 sm:w-64 sm:h-64 bg-indigo-200 rounded-full opacity-10 blur-2xl sm:blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="relative container-mobile max-w-4xl">
          <div className="text-center mb-6 sm:mb-8">
            <div className="inline-flex items-center px-3 py-2 sm:px-4 bg-blue-600 text-white text-xs sm:text-sm font-semibold rounded-full mb-3 sm:mb-4">
              <span className="mr-2">📧</span>
              Newsletter
            </div>
            <h2 className="text-responsive-lg font-bold text-gray-900 mb-3 sm:mb-4">
              Subscribe for Our Latest Updates
            </h2>
            <p className="text-sm sm:text-base text-gray-600 max-w-xl mx-auto leading-relaxed px-4">
              Get the latest tools, tips, and tutorials delivered to your inbox. Join thousands of creators who trust us.
            </p>
          </div>

          <div className="max-w-md mx-auto px-4">
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <div className="flex flex-col gap-3">
                <div className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="input-mobile w-full bg-white shadow-sm placeholder-gray-500"
                    disabled={isSubscribing}
                    data-testid="newsletter-email-input"
                  />
                  {subscriptionStatus.type === 'success' && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <CheckCircle2 className="w-5 h-5 text-green-500" />
                    </div>
                  )}
                </div>
                <Button
                  type="submit"
                  disabled={isSubscribing || !email}
                  className={`btn-mobile w-full shadow-md hover:shadow-lg ${
                    isSubscribing 
                      ? 'bg-gray-400 cursor-not-allowed' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                  data-testid="subscribe-now-btn"
                >
                  {isSubscribing ? (
                    <div className="flex items-center justify-center">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Subscribing...
                    </div>
                  ) : (
                    'Subscribe Now'
                  )}
                </Button>
              </div>
              
              {subscriptionStatus.message && (
                <div className={`text-center text-sm mt-3 font-medium ${
                  subscriptionStatus.type === 'success' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {subscriptionStatus.message}
                </div>
              )}
            </form>
          </div>
        </div>
      </section>
    );
  };

  const handleThumbnailUploaded = (thumbnail: Thumbnail) => {
    setUploadedThumbnail(thumbnail);
  };

  const handleOptimizationComplete = (result: any) => {
    setOptimizationResult(result);
    setIsOptimizing(false);
  };

  // Optimization API call
  const optimizeMutation = useMutation({
    mutationFn: async () => {
      if (!uploadedThumbnail || !title.trim()) {
        throw new Error('Please upload a thumbnail and enter a title');
      }

      const response = await apiRequest('POST', '/api/titles/optimize', {
        originalTitle: title.trim(),
        thumbnailId: uploadedThumbnail.id,
      });
      return response.json();
    },
    onSuccess: (data) => {
      setTitleSuggestions(data.suggestions || []);
      setOptimizationResult(data);
      setIsOptimizing(false);
      toast({
        title: "Optimization Complete!",
        description: "Your title suggestions are ready below.",
      });
    },
    onError: (error: any) => {
      setIsOptimizing(false);
      toast({
        title: "Optimization Failed",
        description: error.message || "Please try again with a valid title and thumbnail.",
        variant: "destructive",
      });
    },
  });

  const handleOptimize = async () => {
    if (!title.trim()) {
      toast({
        title: "Title Required",
        description: "Please enter a video title to optimize.",
        variant: "destructive",
      });
      return;
    }
    
    if (!uploadedThumbnail) {
      toast({
        title: "Thumbnail Required", 
        description: "Please upload a thumbnail image first.",
        variant: "destructive",
      });
      return;
    }
    
    setIsOptimizing(true);
    optimizeMutation.mutate();
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Title copied to clipboard.",
    });
  };

  return (
    <div className="min-h-screen bg-background relative w-full overflow-x-hidden">
      <Header currentPage="home" />

      {/* Hero Section - Mobile First */}
      <section className="bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 sm:py-12 lg:py-20">
        <div className="container-mobile max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-responsive-xl font-bold text-gray-900 mb-4 sm:mb-6 leading-tight">
              YouTube Thumbnail & Title Optimizer
            </h1>
            
            <p className="text-responsive-sm text-gray-600 mb-6 sm:mb-8 leading-relaxed max-w-2xl mx-auto px-4">
              Boost your YouTube CTR with AI-powered thumbnail analysis and title optimization. 
              Get professional results in seconds.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-8 sm:mb-12 px-4">
              <div className="flex items-center text-sm text-gray-600">
                <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
                AI-Powered Analysis
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
                Instant Results
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
                Higher CTR
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Tool Section - Mobile Optimized */}
      <section className="py-8 sm:py-12 lg:py-16 bg-white">
        <div className="container-mobile max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-responsive-md"
          >
            {/* Image Upload */}
            <div className="mb-6 sm:mb-8">
              <ImageUpload onThumbnailUploaded={handleThumbnailUploaded} />
              
              {/* Thumbnail Preview */}
              {uploadedThumbnail && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="mt-6"
                >
                  <div className="card-mobile p-4 sm:p-6">
                    <h4 className="text-responsive-sm font-semibold text-gray-900 mb-4 flex items-center">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mr-2" />
                      Thumbnail Preview
                    </h4>
                    <div className="flex justify-center">
                      <div className="relative max-w-sm w-full">
                        <img
                          src={`data:image/jpeg;base64,${uploadedThumbnail.originalImageData}`}
                          alt="Uploaded thumbnail"
                          className="w-full aspect-video object-cover rounded-lg shadow-md"
                          data-testid="thumbnail-preview"
                        />
                        <div className="absolute top-2 right-2 bg-green-500 text-white text-xs px-2 py-1 rounded-full">
                          ✓ Ready
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>

            {/* Title Input */}
            <div className="mb-6 sm:mb-8">
              <div className="card-mobile p-4 sm:p-6 lg:p-8">
                <h3 className="text-responsive-lg font-semibold mb-4 flex items-center">
                  <Sparkles className="text-blue-600 mr-2 sm:mr-3 w-5 h-5 sm:w-6 sm:h-6" />
                  Enter Your Video Title
                </h3>
                
                <div className="space-y-4">
                  <Input
                    type="text"
                    placeholder="Enter your video title or idea..."
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="input-mobile"
                    data-testid="title-input"
                  />
                  
                  <Button
                    onClick={handleOptimize}
                    disabled={!uploadedThumbnail || !title.trim() || isOptimizing}
                    className={`btn-mobile w-full sm:w-auto ${
                      !uploadedThumbnail || !title.trim() || isOptimizing
                        ? 'bg-gray-300 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                    data-testid="optimize-button"
                  >
                    {isOptimizing ? (
                      <div className="flex items-center justify-center">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                        Optimizing...
                      </div>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        Optimize Now
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Results */}
            {(titleSuggestions.length > 0 || (uploadedThumbnail && uploadedThumbnail.enhancedImageData)) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6 sm:space-y-8"
              >
                {/* Before & After Title */}
                {titleSuggestions.length > 0 && (
                  <div className="card-mobile p-4 sm:p-6">
                    <h4 className="text-responsive-sm font-semibold text-gray-900 mb-4 flex items-center">
                      <Sparkles className="w-5 h-5 text-blue-600 mr-2" />
                      Title Optimization: Before & After
                    </h4>
                    
                    <div className="space-y-4">
                      {/* Original Title */}
                      <div className="p-4 bg-red-50 border-l-4 border-red-400 rounded-lg">
                        <div className="flex items-center mb-2">
                          <span className="text-sm font-medium text-red-700">BEFORE (Original)</span>
                        </div>
                        <p className="text-gray-800 font-medium">{title}</p>
                        <p className="text-xs text-gray-600 mt-1">{title.length} characters</p>
                      </div>
                      
                      {/* Best Optimized Title */}
                      <div className="p-4 bg-green-50 border-l-4 border-green-400 rounded-lg">
                        <div className="flex items-center mb-2">
                          <span className="text-sm font-medium text-green-700">AFTER (AI Optimized)</span>
                          <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                            Score: {titleSuggestions[0]?.score || 'N/A'}/10
                          </span>
                        </div>
                        <p className="text-gray-800 font-medium">{titleSuggestions[0]?.title}</p>
                        <p className="text-xs text-gray-600 mt-1">
                          {titleSuggestions[0]?.title?.length || 0} characters • Est. CTR: +{titleSuggestions[0]?.estimatedCtr || 0}%
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* SEO Optimized Title Suggestions */}
                {titleSuggestions.length > 0 && (
                  <div className="card-mobile p-4 sm:p-6">
                    <h4 className="text-responsive-sm font-semibold text-gray-900 mb-4 flex items-center">
                      <Target className="w-5 h-5 text-purple-600 mr-2" />
                      5 SEO-Optimized Title Suggestions
                    </h4>
                    <p className="text-sm text-gray-600 mb-4">Click any title to copy it to your clipboard</p>
                    
                    <div className="space-y-3">
                      {titleSuggestions.map((suggestion: any, index: number) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="group p-4 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
                          onClick={() => copyToClipboard(suggestion.title)}
                          data-testid={`title-suggestion-${index}`}
                        >
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center mb-1">
                                <span className="text-sm font-medium text-blue-600">#{index + 1}</span>
                                <div className="ml-2 flex items-center space-x-2">
                                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                    suggestion.score >= 8 ? 'bg-green-100 text-green-800' :
                                    suggestion.score >= 6 ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                  }`}>
                                    Score: {suggestion.score}/10
                                  </span>
                                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                    +{suggestion.estimatedCtr}% CTR
                                  </span>
                                </div>
                              </div>
                              <p className="text-gray-800 font-medium text-sm sm:text-base leading-relaxed">
                                {suggestion.title}
                              </p>
                              <p className="text-xs text-gray-500 mt-2">
                                {suggestion.title.length} characters • SEO Score: {suggestion.seoScore}/10
                              </p>
                              {suggestion.reasoning && (
                                <p className="text-xs text-gray-600 mt-1 italic">
                                  💡 {suggestion.reasoning}
                                </p>
                              )}
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="opacity-0 group-hover:opacity-100 transition-opacity ml-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                copyToClipboard(suggestion.title);
                              }}
                            >
                              <Copy className="w-4 h-4" />
                            </Button>
                          </div>
                          
                          {suggestion.tags && suggestion.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {suggestion.tags.slice(0, 3).map((tag: string, tagIndex: number) => (
                                <span key={tagIndex} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Thumbnail Comparison */}
                {uploadedThumbnail && uploadedThumbnail.enhancedImageData && (
                  <ThumbnailComparison thumbnail={uploadedThumbnail} />
                )}
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      {/* What is Section - Mobile Optimized */}
      <section className="pt-16 sm:pt-24 lg:pt-32 pb-12 sm:pb-16 lg:pb-20 bg-white">
        <div className="container-mobile max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-responsive-xl font-bold text-gray-900 mb-4 sm:mb-6">
                YouTube Thumbnail & Title Optimizer
              </h2>
            </div>
            
            <div className="prose prose-lg mx-auto text-gray-600">
              <p className="text-responsive-sm leading-relaxed mb-4 sm:mb-6">
                <strong>GinyWow YouTube Thumbnail & Title Optimizer</strong> is a smart tool designed for creators who want to grow their YouTube channel faster. It helps YouTubers, digital marketers, and businesses create <strong>eye-catching thumbnails</strong> and <strong>click-worthy titles</strong> that attract more viewers and boost video performance.
              </p>
              
              <p className="text-responsive-sm leading-relaxed">
                Normally, creators struggle with low CTR (Click Through Rate) because their thumbnails don't stand out, or their titles aren't appealing enough. That's why we built this tool – to give every creator a simple way to make their videos more engaging and clickable.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Use Section - Mobile Grid */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="container-mobile max-w-5xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-responsive-xl font-bold text-gray-900 mb-4 sm:mb-8">
                Why Use GinyWow YouTube Thumbnail & Title Optimizer?
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              {[
                {
                  icon: Target,
                  title: "Higher Click-Through Rate",
                  description: "Attractive titles and thumbnails that encourage users to click",
                  color: "blue"
                },
                {
                  icon: TrendingUp,
                  title: "Boost Engagement",
                  description: "Thumbnails and titles optimized for maximum visibility",
                  color: "purple"
                },
                {
                  icon: Zap,
                  title: "Save Time & Effort",
                  description: "AI does the hard work so you can focus on creating content",
                  color: "green"
                },
                {
                  icon: Users,
                  title: "Perfect for All Creators",
                  description: "Whether you're a vlogger, educator, gamer, or business channel",
                  color: "orange"
                },
                {
                  icon: Shield,
                  title: "Data-Driven Results",
                  description: "Based on proven YouTube optimization strategies",
                  color: "red"
                }
              ].map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="card-mobile p-4 sm:p-6"
                >
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className={`w-8 h-8 sm:w-10 sm:h-10 bg-${benefit.color}-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1`}>
                      <benefit.icon className={`w-4 h-4 sm:w-5 sm:h-5 text-${benefit.color}-600`} />
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
                        {benefit.title}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600">
                        {benefit.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* How It Works Section - Mobile Steps */}
      <section className="py-12 sm:py-16 lg:py-20 bg-white">
        <div className="container-mobile max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-responsive-xl font-bold text-gray-900 mb-4 sm:mb-8">
                How Does GinyWow YouTube Thumbnail & Title Optimizer Work?
              </h2>
              <p className="text-responsive-sm text-gray-600">Using the tool is quick and simple:</p>
            </div>
            
            <div className="space-y-6 sm:space-y-8">
              {[
                {
                  number: 1,
                  title: "Upload & Enter",
                  description: "Upload your thumbnail and enter your video title or idea",
                  color: "blue"
                },
                {
                  number: 2,
                  title: "Get AI Suggestions",
                  description: "Get 5 AI-powered optimized title suggestions",
                  color: "green"
                },
                {
                  number: 3,
                  title: "See Enhancement",
                  description: "View your enhanced thumbnail with improved visual appeal",
                  color: "purple"
                },
                {
                  number: 4,
                  title: "Download & Use",
                  description: "Download optimized assets and boost your video performance",
                  color: "orange"
                }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="card-mobile p-4 sm:p-6"
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 bg-${step.color}-600 text-white rounded-full flex items-center justify-center text-sm sm:text-base font-bold flex-shrink-0`}>
                      {step.number}
                    </div>
                    <div>
                      <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-2">
                        {step.title}
                      </h3>
                      <p className="text-sm sm:text-base text-gray-600">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section - Mobile Optimized */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
        <div className="container-mobile max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-responsive-xl font-bold text-gray-900 mb-4 sm:mb-8">
                Frequently Asked Questions
              </h2>
            </div>
            
            <div className="space-y-4 sm:space-y-6">
              {[
                {
                  question: "Is the GinyWow YouTube Thumbnail & Title Optimizer free to use?",
                  answer: "Yes, GinyWow offers free access to basic optimization features. We also provide premium features for advanced users who want more detailed analysis and additional optimization options."
                },
                {
                  question: "How does the AI analyze and optimize my thumbnails?",
                  answer: "Our AI uses computer vision and machine learning algorithms trained on millions of high-performing YouTube thumbnails. It analyzes visual elements like contrast, text placement, faces, colors, and composition to suggest improvements that typically increase click-through rates."
                },
                {
                  question: "Can I use the optimized thumbnails and titles commercially?",
                  answer: "Absolutely! All thumbnails and titles generated or optimized through GinyWow are yours to use commercially. There are no restrictions on using them for your YouTube videos, whether for personal or business channels."
                },
                {
                  question: "What file formats are supported for thumbnail uploads?",
                  answer: "We support the most common image formats: JPEG, PNG, and WebP. Files can be up to 10MB in size. For best results, we recommend uploading high-resolution images (1920x1080 pixels or higher)."
                },
                {
                  question: "How accurate are the CTR predictions?",
                  answer: "Our CTR predictions are based on analysis of thousands of successful YouTube videos and industry benchmarks. While we can't guarantee exact results (as many factors affect CTR), our predictions help you understand the relative performance potential of your thumbnails and titles."
                }
              ].map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="card-mobile p-4 sm:p-6"
                >
                  <h3 className="text-base sm:text-lg font-bold text-gray-900 mb-3">
                    {faq.question}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                    {faq.answer}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Newsletter Section */}
      <NewsletterSection />

      <Footer />
    </div>
  );
}