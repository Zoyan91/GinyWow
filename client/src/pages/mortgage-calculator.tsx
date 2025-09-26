import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Home, Calculator, DollarSign, TrendingUp, Globe } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { SEOHead } from "@/components/seo-head";
import { 
  mortgageCalculatorSEO,
  generateWebApplicationSchema,
  generateBreadcrumbSchema,
  generateFAQSchema,
  mortgageCalculatorBreadcrumbs,
  mortgageCalculatorFAQs
} from "@/lib/seo";

// Global currency list with major world currencies
const GLOBAL_CURRENCIES = [
  { code: 'USD', symbol: '$', name: 'US Dollar', locale: 'en-US' },
  { code: 'EUR', symbol: '€', name: 'Euro', locale: 'de-DE' },
  { code: 'GBP', symbol: '£', name: 'British Pound', locale: 'en-GB' },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', locale: 'ja-JP' },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', locale: 'en-AU' },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', locale: 'en-CA' },
  { code: 'CHF', symbol: 'Fr', name: 'Swiss Franc', locale: 'de-CH' },
  { code: 'CNY', symbol: '¥', name: 'Chinese Yuan', locale: 'zh-CN' },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', locale: 'en-IN' },
  { code: 'KRW', symbol: '₩', name: 'South Korean Won', locale: 'ko-KR' },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', locale: 'en-SG' },
  { code: 'HKD', symbol: 'HK$', name: 'Hong Kong Dollar', locale: 'en-HK' },
  { code: 'NOK', symbol: 'kr', name: 'Norwegian Krone', locale: 'nb-NO' },
  { code: 'SEK', symbol: 'kr', name: 'Swedish Krona', locale: 'sv-SE' },
  { code: 'DKK', symbol: 'kr', name: 'Danish Krone', locale: 'da-DK' },
  { code: 'PLN', symbol: 'zł', name: 'Polish Zloty', locale: 'pl-PL' },
  { code: 'CZK', symbol: 'Kč', name: 'Czech Koruna', locale: 'cs-CZ' },
  { code: 'HUF', symbol: 'Ft', name: 'Hungarian Forint', locale: 'hu-HU' },
  { code: 'RUB', symbol: '₽', name: 'Russian Ruble', locale: 'ru-RU' },
  { code: 'BRL', symbol: 'R$', name: 'Brazilian Real', locale: 'pt-BR' },
  { code: 'MXN', symbol: '$', name: 'Mexican Peso', locale: 'es-MX' },
  { code: 'ARS', symbol: '$', name: 'Argentine Peso', locale: 'es-AR' },
  { code: 'CLP', symbol: '$', name: 'Chilean Peso', locale: 'es-CL' },
  { code: 'ZAR', symbol: 'R', name: 'South African Rand', locale: 'en-ZA' },
  { code: 'TRY', symbol: '₺', name: 'Turkish Lira', locale: 'tr-TR' },
  { code: 'NZD', symbol: 'NZ$', name: 'New Zealand Dollar', locale: 'en-NZ' },
  { code: 'THB', symbol: '฿', name: 'Thai Baht', locale: 'th-TH' },
  { code: 'MYR', symbol: 'RM', name: 'Malaysian Ringgit', locale: 'ms-MY' },
  { code: 'IDR', symbol: 'Rp', name: 'Indonesian Rupiah', locale: 'id-ID' },
  { code: 'PHP', symbol: '₱', name: 'Philippine Peso', locale: 'en-PH' },
  { code: 'VND', symbol: '₫', name: 'Vietnamese Dong', locale: 'vi-VN' },
  { code: 'ILS', symbol: '₪', name: 'Israeli Shekel', locale: 'he-IL' },
  { code: 'AED', symbol: 'د.إ', name: 'UAE Dirham', locale: 'ar-AE' },
  { code: 'SAR', symbol: '﷼', name: 'Saudi Riyal', locale: 'ar-SA' },
  { code: 'EGP', symbol: '£', name: 'Egyptian Pound', locale: 'ar-EG' },
];

interface MortgageResult {
  monthlyEMI: number;
  totalAmount: number;
  totalInterest: number;
  loanAmount: number;
  interestRate: number;
  tenure: number;
  breakdown: {
    principal: number;
    interest: number;
  }[];
}

export default function MortgageCalculator() {
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [tenure, setTenure] = useState("");
  const [selectedCurrency, setSelectedCurrency] = useState("USD"); // Default to USD
  const [mortgageResult, setMortgageResult] = useState<MortgageResult | null>(null);
  const { toast } = useToast();

  // Get current currency info
  const currentCurrency = GLOBAL_CURRENCIES.find(c => c.code === selectedCurrency) || GLOBAL_CURRENCIES[0];

  // Generate structured data for SEO (memoized for performance)
  const structuredData = useMemo(() => [
    generateWebApplicationSchema("https://ginywow.replit.app/mortgage-calculator"),
    generateBreadcrumbSchema(mortgageCalculatorBreadcrumbs),
    generateFAQSchema(mortgageCalculatorFAQs)
  ], []);

  const calculateMortgage = () => {
    if (!loanAmount || !interestRate || !tenure) {
      toast({
        title: "All Fields Required",
        description: "Please fill in loan amount, interest rate, and tenure.",
        variant: "destructive"
      });
      return;
    }

    const principal = parseFloat(loanAmount);
    const rate = parseFloat(interestRate) / 100 / 12; // Monthly interest rate
    const time = parseInt(tenure) * 12; // Total months

    if (principal <= 0 || rate < 0 || time <= 0) {
      toast({
        title: "Invalid Values",
        description: "Please enter valid positive numbers.",
        variant: "destructive"
      });
      return;
    }

    // Calculate EMI using standard formula with zero-interest handling
    let emi: number;
    let totalAmount: number;
    let totalInterest: number;
    
    if (rate === 0) {
      // Handle zero interest rate case
      emi = principal / time;
      totalAmount = principal;
      totalInterest = 0;
    } else {
      // Standard EMI formula for positive interest rates
      emi = (principal * rate * Math.pow(1 + rate, time)) / (Math.pow(1 + rate, time) - 1);
      totalAmount = emi * time;
      totalInterest = totalAmount - principal;
    }

    // Generate year-wise breakdown
    const breakdown = [];
    let remainingPrincipal = principal;
    
    if (rate === 0) {
      // For zero interest, distribute principal equally across years
      const yearlyPrincipal = principal / parseInt(tenure);
      for (let year = 1; year <= parseInt(tenure); year++) {
        breakdown.push({
          principal: yearlyPrincipal,
          interest: 0
        });
      }
    } else {
      // Standard amortization calculation for positive interest rates
      for (let year = 1; year <= parseInt(tenure); year++) {
        let yearlyInterest = 0;
        let yearlyPrincipal = 0;
        
        for (let month = 1; month <= 12; month++) {
          const monthlyInterest = remainingPrincipal * rate;
          const monthlyPrincipal = emi - monthlyInterest;
          
          yearlyInterest += monthlyInterest;
          yearlyPrincipal += monthlyPrincipal;
          remainingPrincipal -= monthlyPrincipal;
          
          if (remainingPrincipal <= 0) break;
        }
        
        breakdown.push({
          principal: yearlyPrincipal,
          interest: yearlyInterest
        });
      }
    }

    const result: MortgageResult = {
      monthlyEMI: emi,
      totalAmount,
      totalInterest,
      loanAmount: principal,
      interestRate: parseFloat(interestRate),
      tenure: parseInt(tenure),
      breakdown
    };

    setMortgageResult(result);
    
    toast({
      title: "Mortgage Calculated",
      description: `Your monthly EMI is ${currentCurrency.symbol}${emi.toLocaleString(currentCurrency.locale, { maximumFractionDigits: 0 })}`,
    });
  };

  const clearResults = () => {
    setMortgageResult(null);
    setLoanAmount("");
    setInterestRate("");
    setTenure("");
    toast({
      title: "Results Cleared",
      description: "All mortgage calculations have been cleared.",
    });
  };

  const formatCurrency = (amount: number) => {
    // Use Intl.NumberFormat for better currency formatting as suggested by architect
    try {
      return new Intl.NumberFormat(currentCurrency.locale, {
        style: 'currency',
        currency: currentCurrency.code,
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(amount);
    } catch (error) {
      // Fallback to symbol + number if currency code not supported
      return `${currentCurrency.symbol}${amount.toLocaleString(currentCurrency.locale, { maximumFractionDigits: 0 })}`;
    }
  };

  const getAffordabilityBadge = (emi: number, income?: number) => {
    if (!income) return { text: "Calculate", color: "bg-gray-500" };
    const ratio = (emi * 12) / income;
    if (ratio <= 0.28) return { text: "Excellent", color: "bg-green-500" };
    if (ratio <= 0.36) return { text: "Good", color: "bg-blue-500" };
    if (ratio <= 0.43) return { text: "Moderate", color: "bg-yellow-500" };
    return { text: "High Risk", color: "bg-red-500" };
  };

  return (
    <>
      {/* SEO Head with comprehensive optimization */}
      <SEOHead seoData={mortgageCalculatorSEO} structuredData={structuredData} />

      <Header currentPage="Mortgage Calculator" />
      
      {/* Hero Section with exact home page design pattern */}
      <section className="relative min-h-[40vh] bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center overflow-hidden pt-12 sm:pt-16 lg:pt-20">

        <div className="relative z-10 container mx-auto px-4 max-w-4xl">
          <div className="text-center animate-fade-in">
            <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold lg:font-normal text-gray-900 mb-4 sm:mb-6 leading-tight">
              Free Mortgage Calculator – Estimate Monthly Payments Instantly
            </h1>
            
            <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed max-w-2xl mx-auto px-4">
              Use our free online Mortgage Calculator to calculate monthly payments, interest rates, and loan amortization schedules. Perfect for home buyers in the USA, UK, Canada, and worldwide.
            </p>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Input Section - Full Width */}
        <div className="mb-8">
          <div>
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-blue-600 p-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <Home className="w-5 h-5 text-white" />
                  </div>
                  Loan Details
                </h2>
                <p className="text-green-100 mt-2">
                  Enter your home loan information
                </p>
              </div>
              <div className="p-6 space-y-6">
                {/* Currency Selection */}
                <div>
                  <Label className="text-base font-semibold text-gray-700 mb-3 block flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    Currency
                  </Label>
                  <Select value={selectedCurrency} onValueChange={setSelectedCurrency}>
                    <SelectTrigger className="h-12 border-2 border-gray-200 focus:border-green-400 rounded-xl transition-all duration-300" data-testid="currency-selector">
                      <SelectValue placeholder="Select Currency" />
                    </SelectTrigger>
                    <SelectContent className="max-h-80">
                      {GLOBAL_CURRENCIES.map((currency) => (
                        <SelectItem key={currency.code} value={currency.code}>
                          <div className="flex items-center gap-3">
                            <span className="text-lg">{currency.symbol}</span>
                            <div>
                              <div className="font-medium">{currency.code}</div>
                              <div className="text-sm text-gray-500">{currency.name}</div>
                            </div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="loan-amount" className="text-base font-semibold text-gray-700 mb-3 block">Loan Amount ({currentCurrency.symbol})</Label>
                  <Input
                    id="loan-amount"
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    placeholder={`e.g., ${currentCurrency.code === 'USD' ? '500000' : currentCurrency.code === 'EUR' ? '400000' : currentCurrency.code === 'INR' ? '5000000' : '500000'}`}
                    className="h-12 border-2 border-gray-200 focus:border-green-400 rounded-xl transition-all duration-300"
                    data-testid="loan-amount-input"
                  />
                  <p className="text-sm text-gray-500 mt-2">Enter amount in {currentCurrency.name} ({currentCurrency.code})</p>
                </div>

                <div>
                  <Label htmlFor="interest-rate" className="text-base font-semibold text-gray-700 mb-3 block">Interest Rate (% per annum)</Label>
                  <Input
                    id="interest-rate"
                    type="number"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    placeholder="e.g., 8.5"
                    className="h-12 border-2 border-gray-200 focus:border-green-400 rounded-xl transition-all duration-300"
                    data-testid="interest-rate-input"
                  />
                </div>

                <div>
                  <Label htmlFor="tenure" className="text-base font-semibold text-gray-700 mb-3 block">Loan Tenure (Years)</Label>
                  <Input
                    id="tenure"
                    type="number"
                    value={tenure}
                    onChange={(e) => setTenure(e.target.value)}
                    placeholder="e.g., 20"
                    className="h-12 border-2 border-gray-200 focus:border-green-400 rounded-xl transition-all duration-300"
                    data-testid="tenure-input"
                  />
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={calculateMortgage}
                    className="flex-1 h-14 bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
                    data-testid="calculate-mortgage-button"
                  >
                    <Calculator className="w-5 h-5 mr-2" />
                    Calculate EMI
                  </Button>
                  <Button
                    variant="outline"
                    onClick={clearResults}
                    className="h-14 px-6 border-2 border-gray-200 hover:border-green-400 rounded-xl transition-all duration-300"
                    data-testid="clear-mortgage-button"
                  >
                    Clear
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section - Only show after calculation */}
        {mortgageResult && (
          <div className="mb-8">
            <div>
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
                  <h2 className="text-xl font-bold text-white flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <DollarSign className="w-5 h-5 text-white" />
                    </div>
                    Mortgage Results
                  </h2>
                  <p className="text-blue-100 mt-2">
                    Your loan calculation summary
                  </p>
                </div>
                <div className="p-6">
                  <div className="space-y-6">
                    {/* Key Metrics */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gradient-to-r from-green-50 to-green-100 p-4 rounded-xl border border-green-200">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-800">{formatCurrency(mortgageResult.monthlyEMI)}</div>
                          <div className="text-sm text-green-600">Monthly EMI</div>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-4 rounded-xl border border-blue-200">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-blue-800">{formatCurrency(mortgageResult.totalInterest)}</div>
                          <div className="text-sm text-blue-600">Total Interest</div>
                        </div>
                      </div>
                    </div>

                    {/* Summary */}
                    <div className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl border border-gray-200">
                      <h3 className="text-lg font-bold text-gray-800 mb-3">Loan Summary</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Loan Amount:</span>
                          <span className="font-semibold">{formatCurrency(mortgageResult.loanAmount)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Amount:</span>
                          <span className="font-semibold">{formatCurrency(mortgageResult.totalAmount)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Interest Rate:</span>
                          <span className="font-semibold">{mortgageResult.interestRate}% p.a.</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tenure:</span>
                          <span className="font-semibold">{mortgageResult.tenure} years</span>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Year-wise Breakdown */}
        {mortgageResult && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-purple-500 to-pink-600 p-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                Year-wise Payment Breakdown
              </h2>
              <p className="text-purple-100 mt-2">
                Principal vs Interest breakdown by year
              </p>
            </div>
            <div className="p-6">
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {mortgageResult.breakdown.map((year, index) => (
                  <div key={index} className="bg-gradient-to-r from-gray-50 to-white p-4 rounded-xl border border-gray-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <span className="text-purple-800 font-bold text-sm">Y{index + 1}</span>
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-gray-800">Year {index + 1}</div>
                          <div className="text-xs text-gray-600">Principal: {formatCurrency(year.principal)} | Interest: {formatCurrency(year.interest)}</div>
                        </div>
                      </div>
                      <Badge className="bg-purple-500 text-white">
                        {formatCurrency(year.principal + year.interest)}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* What is Section */}
        <section className="pt-8 sm:pt-12 lg:pt-16 pb-12 sm:pb-16 lg:pb-20 bg-white">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-6">
                What is GinyWow Mortgage Calculator?
              </h2>
            </div>
            
            <div className="prose prose-lg mx-auto text-gray-600">
              <p className="text-base sm:text-lg leading-relaxed mb-4 sm:mb-6">
                <strong>GinyWow Mortgage Calculator</strong> is a powerful free tool that helps home buyers, refinancers, and property investors calculate monthly payments, total interest, and loan costs instantly. Perfect for <strong>first-time buyers in the USA</strong>, refinancing in the <strong>UK</strong>, or exploring loans in <strong>Canada and worldwide</strong>.
              </p>
              
              <p className="text-base sm:text-lg leading-relaxed">
                Simply enter your loan amount, interest rate, and term to get instant results. Whether you're buying your first home or your tenth investment property, our calculator makes mortgage planning <strong>fast, accurate, and easy</strong>.
              </p>
            </div>
          </div>
        </section>

        {/* Why Use Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-gray-50">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-8">
                Why Choose Our Mortgage Calculator?
              </h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
              {[
                {
                  icon: <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>,
                  title: "Lightning Fast Results",
                  description: "Get accurate monthly payments in seconds, not minutes",
                  color: "blue"
                },
                {
                  icon: <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>,
                  title: "Worldwide Compatibility",
                  description: "Works for USA, UK, Canada, Australia and global markets",
                  color: "green"
                },
                {
                  icon: <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>,
                  title: "Detailed Breakdown",
                  description: "See exactly how much goes to principal vs interest",
                  color: "purple"
                },
                {
                  icon: <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" /></svg>,
                  title: "Smart Financial Planning", 
                  description: "Compare loan terms to save thousands on interest",
                  color: "orange"
                }
              ].map((benefit, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-4 sm:p-6 shadow-lg border border-gray-100"
                >
                  <div className="flex items-start space-x-3 sm:space-x-4">
                    <div className={`w-10 h-10 bg-${benefit.color}-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1`}>
                      {benefit.icon}
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
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section className="py-12 sm:py-16 lg:py-20 bg-white">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center mb-8 sm:mb-12">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4 sm:mb-8">
                How to Use Our Mortgage Calculator?
              </h2>
              <p className="text-base sm:text-lg text-gray-600">Simple 3-step process to calculate your mortgage:</p>
            </div>
            
            <div className="space-y-6 sm:space-y-8">
              {[
                {
                  number: 1,
                  title: "Enter Loan Details",
                  description: "Add your loan amount, interest rate, and loan term (15-30 years)",
                  bgColor: "bg-blue-600"
                },
                {
                  number: 2,
                  title: "Get Instant Results",
                  description: "See monthly payments, total interest, and full cost breakdown immediately",
                  bgColor: "bg-green-600"
                },
                {
                  number: 3,
                  title: "Plan & Compare",
                  description: "Compare different loan terms and make informed decisions for your home purchase",
                  bgColor: "bg-purple-600"
                }
              ].map((step, index) => (
                <div
                  key={index}
                  className="bg-gray-50 rounded-xl p-4 sm:p-6 border border-gray-200"
                >
                  <div className="flex items-start space-x-4">
                    <div className={`w-10 h-10 sm:w-12 sm:h-12 ${step.bgColor} text-white rounded-full flex items-center justify-center text-sm sm:text-base font-bold flex-shrink-0`}>
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
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 p-6">
            <h2 className="text-xl font-bold text-white">Frequently Asked Questions</h2>
            <p className="text-gray-300 mt-2">Everything you need to know about mortgage calculations</p>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">What is EMI?</h3>
                <p className="text-gray-600">EMI (Equated Monthly Installment) is the fixed amount you pay every month towards your home loan, consisting of both principal and interest components.</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">How is EMI calculated?</h3>
                <p className="text-gray-600">EMI is calculated using the formula: EMI = [P x R x (1+R)^N] / [(1+R)^N-1], where P is principal, R is monthly interest rate, and N is number of months.</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">What factors affect my EMI?</h3>
                <p className="text-gray-600">Your EMI depends on three main factors: loan amount (principal), interest rate, and loan tenure. Higher loan amount or interest rate increases EMI, while longer tenure reduces it.</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Should I choose longer or shorter tenure?</h3>
                <p className="text-gray-600">Shorter tenure means higher EMI but lower total interest. Longer tenure means lower EMI but higher total interest. Choose based on your monthly income and financial goals.</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}