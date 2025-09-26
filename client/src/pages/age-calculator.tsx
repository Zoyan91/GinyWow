import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar, Gift, Heart, Calculator } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Helmet } from "react-helmet-async";

interface AgeResult {
  years: number;
  months: number;
  days: number;
  totalDays: number;
  totalHours: number;
  totalMinutes: number;
  totalSeconds: number;
  nextBirthday: {
    daysLeft: number;
    date: string;
  };
}

export default function AgeCalculator() {
  const [birthDate, setBirthDate] = useState("");
  const [targetDate, setTargetDate] = useState(new Date().toISOString().split('T')[0]);
  const [ageResult, setAgeResult] = useState<AgeResult | null>(null);
  const { toast } = useToast();

  const calculateAge = () => {
    if (!birthDate) {
      toast({
        title: "Birth Date Required",
        description: "Please enter your birth date.",
        variant: "destructive"
      });
      return;
    }

    const birth = new Date(birthDate);
    const target = new Date(targetDate);

    if (birth > target) {
      toast({
        title: "Invalid Date",
        description: "Birth date cannot be in the future.",
        variant: "destructive"
      });
      return;
    }

    // Calculate precise age
    let years = target.getFullYear() - birth.getFullYear();
    let months = target.getMonth() - birth.getMonth();
    let days = target.getDate() - birth.getDate();

    // Adjust for negative days
    if (days < 0) {
      months--;
      const lastMonth = new Date(target.getFullYear(), target.getMonth(), 0);
      days += lastMonth.getDate();
    }

    // Adjust for negative months
    if (months < 0) {
      years--;
      months += 12;
    }

    // Calculate total values
    const totalDays = Math.floor((target.getTime() - birth.getTime()) / (1000 * 60 * 60 * 24));
    const totalHours = totalDays * 24;
    const totalMinutes = totalHours * 60;
    const totalSeconds = totalMinutes * 60;

    // Calculate next birthday
    const nextBirthday = new Date(target.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthday <= target) {
      nextBirthday.setFullYear(target.getFullYear() + 1);
    }
    const daysLeft = Math.ceil((nextBirthday.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));

    const result: AgeResult = {
      years,
      months,
      days,
      totalDays,
      totalHours,
      totalMinutes,
      totalSeconds,
      nextBirthday: {
        daysLeft,
        date: nextBirthday.toLocaleDateString()
      }
    };

    setAgeResult(result);
    
    toast({
      title: "Age Calculated",
      description: `You are ${years} years, ${months} months, and ${days} days old!`,
    });
  };

  const clearCalculation = () => {
    setBirthDate("");
    setTargetDate(new Date().toISOString().split('T')[0]);
    setAgeResult(null);
    toast({
      title: "Cleared",
      description: "All values have been cleared.",
    });
  };

  const getZodiacSign = (birthDate: string) => {
    if (!birthDate) return null;
    
    const date = new Date(birthDate);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    
    const zodiacSigns = [
      { name: "Capricorn", emoji: "♑", dates: "Dec 22 - Jan 19" },
      { name: "Aquarius", emoji: "♒", dates: "Jan 20 - Feb 18" },
      { name: "Pisces", emoji: "♓", dates: "Feb 19 - Mar 20" },
      { name: "Aries", emoji: "♈", dates: "Mar 21 - Apr 19" },
      { name: "Taurus", emoji: "♉", dates: "Apr 20 - May 20" },
      { name: "Gemini", emoji: "♊", dates: "May 21 - Jun 20" },
      { name: "Cancer", emoji: "♋", dates: "Jun 21 - Jul 22" },
      { name: "Leo", emoji: "♌", dates: "Jul 23 - Aug 22" },
      { name: "Virgo", emoji: "♍", dates: "Aug 23 - Sep 22" },
      { name: "Libra", emoji: "♎", dates: "Sep 23 - Oct 22" },
      { name: "Scorpio", emoji: "♏", dates: "Oct 23 - Nov 21" },
      { name: "Sagittarius", emoji: "♐", dates: "Nov 22 - Dec 21" }
    ];

    if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return zodiacSigns[1];
    if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return zodiacSigns[2];
    if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return zodiacSigns[3];
    if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return zodiacSigns[4];
    if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return zodiacSigns[5];
    if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return zodiacSigns[6];
    if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return zodiacSigns[7];
    if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return zodiacSigns[8];
    if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return zodiacSigns[9];
    if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return zodiacSigns[10];
    if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return zodiacSigns[11];
    return zodiacSigns[0]; // Capricorn
  };

  const zodiacSign = getZodiacSign(birthDate);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Free Age Calculator - Calculate Your Exact Age Online | GinyWow</title>
        <meta name="description" content="Calculate your exact age with GinyWow's free age calculator. Get your age in years, months, days, hours, minutes, and seconds. Find days until next birthday." />
        <meta name="keywords" content="age calculator, birth date calculator, exact age, days calculator, birthday calculator, zodiac sign, GinyWow" />
        <link rel="canonical" href="https://ginywow.com/age-calculator" />
        
        {/* Open Graph tags */}
        <meta property="og:title" content="Free Age Calculator - Calculate Your Exact Age Online | GinyWow" />
        <meta property="og:description" content="Calculate your exact age with GinyWow's free age calculator. Get your age in years, months, days, hours, minutes, and seconds." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ginywow.com/age-calculator" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Age Calculator - Calculate Your Exact Age Online | GinyWow" />
        <meta name="twitter:description" content="Calculate your exact age with GinyWow's free age calculator. Get your age in years, months, days, hours, minutes, and seconds." />
        
        {/* JSON-LD structured data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "GinyWow Age Calculator",
            "description": "Free online age calculator to determine exact age in years, months, days, and more",
            "url": "https://ginywow.com/age-calculator",
            "applicationCategory": "Utility",
            "operatingSystem": "Any",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            }
          })}
        </script>
      </Helmet>

      <Header currentPage="age-calculator" />
      
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
              Age Calculator Tool
            </h1>
            
            <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed max-w-2xl mx-auto px-4">
              Discover your exact age down to the second. Calculate years, months, days, and find your zodiac sign instantly.
            </p>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-8 max-w-5xl">

        {/* Main Tool Section */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Input Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-pink-500 to-rose-600 p-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-white" />
                  </div>
                  Enter Dates
                </h2>
                <p className="text-pink-100 mt-2">
                  Choose your birth date and calculation date
                </p>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <Label htmlFor="birth-date" className="text-base font-semibold text-gray-700 mb-3 block">Birth Date</Label>
                  <Input
                    id="birth-date"
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    className="h-14 text-lg border-2 border-gray-200 focus:border-pink-400 rounded-xl transition-all duration-300"
                    data-testid="birth-date-input"
                  />
                </div>
                <div>
                  <Label htmlFor="target-date" className="text-base font-semibold text-gray-700 mb-3 block">Calculate Age On</Label>
                  <Input
                    id="target-date"
                    type="date"
                    value={targetDate}
                    onChange={(e) => setTargetDate(e.target.value)}
                    className="h-14 text-lg border-2 border-gray-200 focus:border-pink-400 rounded-xl transition-all duration-300"
                    data-testid="target-date-input"
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={calculateAge}
                    className="flex-1 h-14 bg-gradient-to-r from-pink-500 to-rose-600 hover:from-pink-600 hover:to-rose-700 text-white text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
                    data-testid="calculate-age-button"
                  >
                    <Calculator className="w-5 h-5 mr-3" />
                    Calculate ✨
                  </Button>
                  <Button
                    variant="outline"
                    onClick={clearCalculation}
                    className="h-14 px-6 border-2 border-gray-200 hover:border-red-400 hover:text-red-600 rounded-xl transition-all duration-300"
                    data-testid="clear-calculation-button"
                  >
                    Clear
                  </Button>
                </div>
              </div>
            </div>

            {/* Zodiac Sign */}
            {zodiacSign && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <span className="text-2xl">{zodiacSign.emoji}</span>
                    Zodiac Sign
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">{zodiacSign.name}</h3>
                    <p className="text-sm text-gray-600">{zodiacSign.dates}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Results Section */}
          <div className="lg:col-span-2">
            {ageResult ? (
              <div className="space-y-4">
                {/* Main Age Display */}
                <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <Gift className="w-6 h-6 text-blue-600" />
                      Your Age
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-4xl font-bold text-blue-900 mb-2">
                        {ageResult.years} Years
                      </div>
                      <div className="text-xl text-blue-700 mb-4">
                        {ageResult.months} Months, {ageResult.days} Days
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900">{ageResult.totalDays.toLocaleString()}</div>
                          <div className="text-sm text-gray-600">Total Days</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900">{ageResult.totalHours.toLocaleString()}</div>
                          <div className="text-sm text-gray-600">Total Hours</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900">{ageResult.totalMinutes.toLocaleString()}</div>
                          <div className="text-sm text-gray-600">Total Minutes</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-900">{ageResult.totalSeconds.toLocaleString()}</div>
                          <div className="text-sm text-gray-600">Total Seconds</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Next Birthday */}
                <Card className="bg-gradient-to-r from-pink-50 to-rose-50 border-pink-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Heart className="w-5 h-5 text-pink-600" />
                      Next Birthday
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-pink-900 mb-2">
                        {ageResult.nextBirthday.daysLeft} Days
                      </div>
                      <div className="text-pink-700">
                        Until your birthday on {ageResult.nextBirthday.date}
                      </div>
                      {ageResult.nextBirthday.daysLeft === 0 && (
                        <Badge variant="secondary" className="mt-2 bg-pink-100 text-pink-800">
                          🎉 Happy Birthday! 🎉
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Age Breakdown */}
                <Card>
                  <CardHeader>
                    <CardTitle>Detailed Age Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Years:</span>
                          <Badge variant="outline" data-testid="years-result">{ageResult.years}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Months:</span>
                          <Badge variant="outline" data-testid="months-result">{ageResult.months}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Days:</span>
                          <Badge variant="outline" data-testid="days-result">{ageResult.days}</Badge>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Days:</span>
                          <Badge variant="secondary" data-testid="total-days-result">{ageResult.totalDays.toLocaleString()}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Hours:</span>
                          <Badge variant="secondary">{ageResult.totalHours.toLocaleString()}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Minutes:</span>
                          <Badge variant="secondary">{ageResult.totalMinutes.toLocaleString()}</Badge>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="h-full">
                <CardContent className="flex items-center justify-center h-full py-16">
                  <div className="text-center text-gray-500">
                    <Calendar className="w-16 h-16 mx-auto mb-4 opacity-30" />
                    <p>Enter your birth date and click "Calculate Age" to see detailed results</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Information Sections */}
        <div className="space-y-8">
          {/* What is GinyWow Age Calculator */}
          <section className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What is GinyWow Age Calculator?</h2>
            <p className="text-gray-700 leading-relaxed">
              GinyWow Age Calculator is a comprehensive, free online tool that calculates your exact age in multiple formats. 
              From years and months to seconds lived, plus zodiac signs and birthday countdowns, it provides complete age-related 
              information with precision and additional fun facts about your birth date.
            </p>
          </section>

          {/* Features */}
          <section className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Age Calculator Features</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Precise Age Calculation</h3>
                    <p className="text-gray-600 text-sm">Exact age in years, months, and days</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Multiple Time Units</h3>
                    <p className="text-gray-600 text-sm">Total days, hours, minutes, and seconds lived</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Next Birthday Countdown</h3>
                    <p className="text-gray-600 text-sm">Days remaining until your next birthday</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Zodiac Sign Detection</h3>
                    <p className="text-gray-600 text-sm">Automatic zodiac sign based on birth date</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Custom Date Calculation</h3>
                    <p className="text-gray-600 text-sm">Calculate age on any specific date</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Detailed Breakdown</h3>
                    <p className="text-gray-600 text-sm">Complete age analysis with visual displays</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* How to Use */}
          <section className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Calculate Your Age</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">1</div>
                <p className="text-gray-700">Select your birth date using the date picker</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">2</div>
                <p className="text-gray-700">Choose the date you want to calculate your age on (default is today)</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">3</div>
                <p className="text-gray-700">Click "Calculate Age" to see detailed results</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">4</div>
                <p className="text-gray-700">View your age breakdown, zodiac sign, and birthday countdown</p>
              </div>
            </div>
          </section>

          {/* Common Uses */}
          <section className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Common Uses for Age Calculator</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Personal Milestones</h3>
                <p className="text-gray-600 text-sm">Track life milestones and anniversaries</p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Gift className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Event Planning</h3>
                <p className="text-gray-600 text-sm">Plan birthday parties and celebrations</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Heart className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Relationship Milestones</h3>
                <p className="text-gray-600 text-sm">Calculate relationship anniversaries and ages</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}