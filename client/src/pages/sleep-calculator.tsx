import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Moon, Sun, Clock, Bed, AlarmClock, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Helmet } from "react-helmet-async";

export default function SleepCalculator() {
  const [calculationType, setCalculationType] = useState("bedtime");
  const [wakeUpTime, setWakeUpTime] = useState("");
  const [bedTime, setBedTime] = useState("");
  const [sleepDuration, setSleepDuration] = useState("8");
  const [results, setResults] = useState<any>(null);
  const { toast } = useToast();

  const calculateSleepTimes = () => {
    if (calculationType === "bedtime" && !wakeUpTime) {
      toast({
        title: "Wake-up Time Required",
        description: "Please enter your desired wake-up time.",
        variant: "destructive"
      });
      return;
    }

    if (calculationType === "wakeup" && !bedTime) {
      toast({
        title: "Bedtime Required", 
        description: "Please enter your bedtime.",
        variant: "destructive"
      });
      return;
    }

    let baseTime: Date;
    let recommendations: { time: string; cycles: number; quality: string }[] = [];

    if (calculationType === "bedtime") {
      // Calculate bedtime based on wake-up time
      const [hours, minutes] = wakeUpTime.split(':').map(Number);
      const now = new Date();
      baseTime = new Date();
      baseTime.setHours(hours, minutes, 0, 0);

      // If wake-up time is earlier than current time, it means tomorrow
      if (baseTime.getTime() <= now.getTime()) {
        baseTime.setDate(baseTime.getDate() + 1);
      }

      // Generate bedtime recommendations (1-6 sleep cycles, 90 minutes each)
      for (let cycles = 1; cycles <= 6; cycles++) {
        const sleepMinutes = cycles * 90 + 15; // 15 minutes to fall asleep
        const bedtimeMs = baseTime.getTime() - (sleepMinutes * 60 * 1000);
        const bedtimeDate = new Date(bedtimeMs);

        const timeStr = bedtimeDate.toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        });
        
        let quality = "Poor";
        if (cycles >= 4 && cycles <= 6) quality = "Excellent";
        else if (cycles >= 3) quality = "Good";
        else if (cycles >= 2) quality = "Fair";

        recommendations.push({ time: timeStr, cycles, quality });
      }
    } else {
      // Calculate wake-up time based on bedtime
      const [hours, minutes] = bedTime.split(':').map(Number);
      baseTime = new Date();
      baseTime.setHours(hours, minutes, 0, 0);

      // Generate wake-up recommendations (1-6 sleep cycles)
      for (let cycles = 1; cycles <= 6; cycles++) {
        const sleepMinutes = cycles * 90 + 15; // 15 minutes to fall asleep
        const wakeupMs = baseTime.getTime() + (sleepMinutes * 60 * 1000);
        const wakeupDate = new Date(wakeupMs);
        
        // Wake-up times are naturally calculated correctly for next day when needed

        const timeStr = wakeupDate.toLocaleTimeString('en-US', { 
          hour: 'numeric', 
          minute: '2-digit',
          hour12: true 
        });
        
        let quality = "Poor";
        if (cycles >= 4 && cycles <= 6) quality = "Excellent";
        else if (cycles >= 3) quality = "Good";
        else if (cycles >= 2) quality = "Fair";

        recommendations.push({ time: timeStr, cycles, quality });
      }
    }

    setResults({
      type: calculationType,
      recommendations: recommendations.reverse() // Show longer sleep first
    });

    toast({
      title: "Sleep Times Calculated",
      description: "Your optimal sleep schedule has been calculated!",
    });
  };

  const clearResults = () => {
    setResults(null);
    setWakeUpTime("");
    setBedTime("");
    toast({
      title: "Results Cleared",
      description: "All sleep calculations have been cleared.",
    });
  };

  const getQualityColor = (quality: string) => {
    switch (quality) {
      case "Excellent": return "bg-green-500";
      case "Good": return "bg-blue-500";
      case "Fair": return "bg-yellow-500";
      default: return "bg-red-500";
    }
  };

  const getQualityIcon = (quality: string) => {
    switch (quality) {
      case "Excellent": return <Zap className="w-4 h-4" />;
      case "Good": return <Sun className="w-4 h-4" />;
      case "Fair": return <Clock className="w-4 h-4" />;
      default: return <Moon className="w-4 h-4" />;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Sleep Calculator - Optimize Your Sleep Schedule | GinyWow</title>
        <meta name="description" content="Calculate optimal bedtime and wake-up times with GinyWow's Sleep Calculator. Based on 90-minute sleep cycles for better sleep quality and natural wake-up times." />
        <meta name="keywords" content="sleep calculator, bedtime calculator, wake up time, sleep cycles, sleep schedule, sleep quality, optimal sleep, GinyWow" />
        <link rel="canonical" href="https://ginywow.com/sleep-calculator" />
        
        {/* Open Graph tags */}
        <meta property="og:title" content="Sleep Calculator - Optimize Your Sleep Schedule | GinyWow" />
        <meta property="og:description" content="Calculate optimal bedtime and wake-up times with GinyWow's Sleep Calculator. Based on 90-minute sleep cycles for better sleep quality." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ginywow.com/sleep-calculator" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Sleep Calculator - Optimize Your Sleep Schedule | GinyWow" />
        <meta name="twitter:description" content="Calculate optimal bedtime and wake-up times with GinyWow's Sleep Calculator. Based on 90-minute sleep cycles for better sleep quality." />
        
        {/* JSON-LD structured data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "GinyWow Sleep Calculator",
            "description": "Free online tool to calculate optimal sleep times based on natural sleep cycles for better rest and wake-up experience",
            "url": "https://ginywow.com/sleep-calculator",
            "applicationCategory": "Health",
            "operatingSystem": "Any",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            }
          })}
        </script>
      </Helmet>

      <Header currentPage="sleep-calculator" />
      
      {/* Hero Section - Mobile First - Matching Home Page */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 sm:py-12 lg:py-20 overflow-hidden">
        {/* Floating Shapes - Home Page Style - Hidden on Mobile */}
        <div className="absolute inset-0 z-0 pointer-events-none hidden sm:block">
          {/* Triangle Top Left - Pink */}
          <div 
            className="absolute top-16 left-12 w-6 h-6 animate-float-1"
            style={{
              background: '#f472b6',
              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
              transform: 'rotate(15deg)',
              opacity: 0.4
            }}
          ></div>

          {/* Circle Top Right - Blue */}
          <div 
            className="absolute top-20 right-20 w-5 h-5 rounded-full animate-float-2"
            style={{
              background: '#60a5fa',
              opacity: 0.45
            }}
          ></div>

          {/* Square Top Center - Orange */}
          <div 
            className="absolute top-24 left-1/3 w-4 h-4 animate-float-3"
            style={{
              background: '#fb923c',
              transform: 'rotate(45deg)',
              opacity: 0.4
            }}
          ></div>

          {/* Dot Top Right Corner - Purple */}
          <div 
            className="absolute top-8 right-8 w-3 h-3 rounded-full animate-float-4"
            style={{
              background: '#c084fc',
              opacity: 0.5
            }}
          ></div>

          {/* Triangle Center Left - Green */}
          <div 
            className="absolute top-40 left-8 w-5 h-5 animate-float-5"
            style={{
              background: '#34d399',
              clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
              transform: 'rotate(-30deg)',
              opacity: 0.45
            }}
          ></div>

          {/* Circle Center Right - Yellow */}
          <div 
            className="absolute top-36 right-16 w-4 h-4 rounded-full animate-float-6"
            style={{
              background: '#fbbf24',
              opacity: 0.4
            }}
          ></div>

          {/* Additional dots scattered */}
          <div className="absolute top-28 left-20 w-2 h-2 rounded-full animate-float-5" style={{ background: '#f472b6', opacity: 0.45 }}></div>
          <div className="absolute top-44 right-24 w-2 h-2 rounded-full animate-float-6" style={{ background: '#60a5fa', opacity: 0.4 }}></div>
          <div className="absolute bottom-40 left-24 w-2 h-2 rounded-full animate-float-1" style={{ background: '#fb923c', opacity: 0.5 }}></div>
          <div className="absolute bottom-36 right-20 w-2 h-2 rounded-full animate-float-2" style={{ background: '#34d399', opacity: 0.45 }}></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 max-w-4xl">
          <div className="text-center animate-fade-in">
            <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold lg:font-normal text-gray-900 mb-4 sm:mb-6 leading-tight">
              Sleep Calculator Tool
            </h1>
            
            <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed max-w-2xl mx-auto px-4">
              Calculate optimal bedtime and wake-up times based on 90-minute sleep cycles for better sleep quality and natural awakening.
            </p>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Main Tool Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Input Section */}
          <div>
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500 to-purple-600 p-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <Moon className="w-5 h-5 text-white" />
                  </div>
                  Sleep Settings
                </h2>
                <p className="text-indigo-100 mt-2">
                  Calculate your optimal sleep schedule
                </p>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <Label htmlFor="calculation-type" className="text-base font-semibold text-gray-700 mb-3 block">Calculation Type</Label>
                  <Select value={calculationType} onValueChange={setCalculationType}>
                    <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-indigo-400 rounded-xl" data-testid="calculation-type-select">
                      <SelectValue placeholder="Select calculation type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bedtime">🛏️ Calculate Bedtime</SelectItem>
                      <SelectItem value="wakeup">⏰ Calculate Wake-up Time</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {calculationType === "bedtime" && (
                  <div>
                    <Label htmlFor="wake-time" className="text-base font-semibold text-gray-700 mb-3 block">Wake-up Time</Label>
                    <Input
                      id="wake-time"
                      type="time"
                      value={wakeUpTime}
                      onChange={(e) => setWakeUpTime(e.target.value)}
                      className="h-12 border-2 border-gray-200 focus:border-indigo-400 rounded-xl transition-all duration-300"
                      data-testid="wake-time-input"
                    />
                  </div>
                )}

                {calculationType === "wakeup" && (
                  <div>
                    <Label htmlFor="bed-time" className="text-base font-semibold text-gray-700 mb-3 block">Bedtime</Label>
                    <Input
                      id="bed-time"
                      type="time"
                      value={bedTime}
                      onChange={(e) => setBedTime(e.target.value)}
                      className="h-12 border-2 border-gray-200 focus:border-indigo-400 rounded-xl transition-all duration-300"
                      data-testid="bed-time-input"
                    />
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    onClick={calculateSleepTimes}
                    className="flex-1 h-14 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
                    data-testid="calculate-sleep-button"
                  >
                    <Bed className="w-5 h-5 mr-2" />
                    Calculate
                  </Button>
                  <Button
                    variant="outline"
                    onClick={clearResults}
                    className="h-14 px-6 border-2 border-gray-200 hover:border-indigo-400 rounded-xl transition-all duration-300"
                    data-testid="clear-sleep-button"
                  >
                    Clear
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div>
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <AlarmClock className="w-5 h-5 text-white" />
                  </div>
                  Sleep Schedule
                </h2>
                <p className="text-purple-100 mt-2">
                  Optimal times based on sleep cycles
                </p>
              </div>
              <div className="p-6">
                {results ? (
                  <div className="space-y-4">
                    <div className="text-center mb-6">
                      <h3 className="text-lg font-bold text-gray-800 mb-2">
                        {results.type === "bedtime" ? "Recommended Bedtimes" : "Recommended Wake-up Times"}
                      </h3>
                      <p className="text-sm text-gray-600">
                        Based on 90-minute sleep cycles + 15 minutes to fall asleep
                      </p>
                    </div>
                    {results.recommendations.map((rec: any, index: number) => (
                      <div key={index} className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl border border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                              {getQualityIcon(rec.quality)}
                            </div>
                            <div>
                              <div className="text-xl font-bold text-gray-800">{rec.time}</div>
                              <div className="text-sm text-gray-600">{rec.cycles} sleep cycles ({rec.cycles * 1.5}h sleep)</div>
                            </div>
                          </div>
                          <Badge className={`${getQualityColor(rec.quality)} text-white`}>
                            {rec.quality}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Moon className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No Sleep Schedule Yet</h3>
                    <p className="text-gray-500">
                      Enter your {calculationType === "bedtime" ? "wake-up time" : "bedtime"} to get personalized sleep recommendations
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sleep Info Section */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Understanding Sleep Cycles</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">90-Minute Cycles</h3>
              <p className="text-gray-600 text-sm">Each sleep cycle lasts about 90 minutes, including all sleep stages from light to deep sleep.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Bed className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">4-6 Cycles Ideal</h3>
              <p className="text-gray-600 text-sm">Most adults need 4-6 complete sleep cycles (6-9 hours) for optimal rest and recovery.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sun className="w-8 h-8 text-white" />
              </div>
              <h3 className="font-bold text-gray-800 mb-2">Natural Wake-up</h3>
              <p className="text-gray-600 text-sm">Waking up at the end of a sleep cycle helps you feel more refreshed and energized.</p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Sleep Calculator FAQ</h2>
          <div className="space-y-4">
            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-semibold text-gray-800 mb-2">How does the sleep calculator work?</h3>
              <p className="text-gray-600 text-sm">Our calculator is based on the natural 90-minute sleep cycles. It calculates optimal bedtimes and wake-up times to help you wake up feeling refreshed rather than groggy.</p>
            </div>
            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-semibold text-gray-800 mb-2">Why 90-minute cycles?</h3>
              <p className="text-gray-600 text-sm">Sleep occurs in cycles of approximately 90 minutes, progressing through light sleep, deep sleep, and REM sleep. Waking up at the end of a cycle feels more natural.</p>
            </div>
            <div className="border-b border-gray-200 pb-4">
              <h3 className="font-semibold text-gray-800 mb-2">How much sleep do I need?</h3>
              <p className="text-gray-600 text-sm">Most adults need 4-6 complete sleep cycles (6-9 hours). The calculator shows options from 1-6 cycles so you can choose what works best for your schedule.</p>
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 mb-2">What if I can't follow the exact times?</h3>
              <p className="text-gray-600 text-sm">The calculator provides guidelines. Try to get as close as possible to the recommended times, and consistency in your sleep schedule is more important than perfect timing.</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}