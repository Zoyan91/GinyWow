import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, CheckCircle2, ArrowRight, Sparkles, Users, Zap, Shield, Target, TrendingUp } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ImageUpload from "@/components/image-upload";
import TitleOptimizer from "@/components/title-optimizer";
import ThumbnailComparison from "@/components/thumbnail-comparison";
import type { Thumbnail, TitleOptimization } from "@shared/schema";

export default function Home() {
  const [title, setTitle] = useState("");
  const [uploadedThumbnail, setUploadedThumbnail] = useState<Thumbnail | null>(null);
  const [optimizationResult, setOptimizationResult] = useState<any>(null);
  const [isOptimizing, setIsOptimizing] = useState(false);

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

  const handleOptimize = async () => {
    if (!uploadedThumbnail || !title.trim()) return;
    
    setIsOptimizing(true);
    // This would trigger the optimization process
    // The actual optimization logic would be handled by TitleOptimizer component
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
            {optimizationResult && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="space-y-6 sm:space-y-8"
              >
                {/* CTR Score */}
                <div className="card-mobile p-4 sm:p-6 text-center">
                  <h4 className="text-responsive-sm font-semibold text-gray-900 mb-3">
                    Predicted CTR Score
                  </h4>
                  <div className="text-3xl sm:text-4xl font-bold text-blue-600 mb-2">
                    {optimizationResult.ctrScore}%
                  </div>
                  <p className="text-sm text-gray-600">
                    {optimizationResult.ctrFeedback}
                  </p>
                </div>

                {/* Title Suggestions */}
                {optimizationResult.titleSuggestions && (
                  <div className="card-mobile p-4 sm:p-6">
                    <h4 className="text-responsive-sm font-semibold text-gray-900 mb-4">
                      Optimized Title Suggestions
                    </h4>
                    <div className="space-y-3">
                      {optimizationResult.titleSuggestions.map((suggestion: any, index: number) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm sm:text-base text-gray-800">{suggestion.title}</p>
                          {suggestion.score && (
                            <p className="text-xs text-gray-600 mt-1">Score: {suggestion.score}/100</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Thumbnail Comparison */}
                {optimizationResult.thumbnailComparison && (
                  <div className="card-mobile p-4 sm:p-6">
                    <h4 className="text-responsive-sm font-semibold text-gray-900 mb-4">
                      Thumbnail Enhancement
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Before</h5>
                        <img 
                          src={optimizationResult.thumbnailComparison.before} 
                          alt="Original thumbnail" 
                          className="w-full rounded-lg"
                        />
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-2">After</h5>
                        <img 
                          src={optimizationResult.thumbnailComparison.after} 
                          alt="Enhanced thumbnail" 
                          className="w-full rounded-lg"
                        />
                      </div>
                    </div>
                    {optimizationResult.thumbnailComparison.enhancementMetrics && (
                      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                        <h6 className="text-sm font-medium text-blue-900 mb-2">Enhancement Metrics</h6>
                        <div className="text-xs text-blue-800 space-y-1">
                          <p>Contrast: +{optimizationResult.thumbnailComparison.enhancementMetrics.contrast}%</p>
                          <p>Saturation: +{optimizationResult.thumbnailComparison.enhancementMetrics.saturation}%</p>
                          <p>Clarity: +{optimizationResult.thumbnailComparison.enhancementMetrics.clarity}%</p>
                        </div>
                      </div>
                    )}
                  </div>
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