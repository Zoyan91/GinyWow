import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Home, Calculator, DollarSign, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Helmet } from "react-helmet-async";

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
  const [mortgageResult, setMortgageResult] = useState<MortgageResult | null>(null);
  const { toast } = useToast();

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
      description: `Your monthly EMI is ₹${emi.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`,
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
    return `₹${amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
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
      <Helmet>
        <title>Mortgage Calculator - Calculate Home Loan EMI | GinyWow</title>
        <meta name="description" content="Calculate your home loan EMI, total interest, and monthly payments with our free mortgage calculator. Plan your home purchase with accurate loan calculations." />
        <meta name="keywords" content="mortgage calculator, home loan calculator, EMI calculator, loan calculator, interest calculator, mortgage payment" />
        
        {/* Open Graph tags */}
        <meta property="og:title" content="Free Mortgage Calculator - Calculate Home Loan EMI" />
        <meta property="og:description" content="Calculate your home loan EMI, total interest, and monthly payments with our free mortgage calculator. Plan your home purchase with accurate loan calculations." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ginywow.com/mortgage-calculator" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Mortgage Calculator - Calculate Home Loan EMI" />
        <meta name="twitter:description" content="Calculate your home loan EMI, total interest, and monthly payments with our free mortgage calculator." />
        
        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Mortgage Calculator",
            "description": "Calculate home loan EMI, total interest, and mortgage payments",
            "url": "https://ginywow.com/mortgage-calculator",
            "applicationCategory": "FinanceApplication",
            "operatingSystem": "Any",
            "permissions": "No permissions required",
            "isAccessibleForFree": true,
            "creator": {
              "@type": "Organization",
              "name": "GinyWow"
            }
          })}
        </script>
      </Helmet>

      <Header currentPage="Mortgage Calculator" />
      
      {/* Hero Section with exact home page design pattern */}
      <section className="relative min-h-[40vh] bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center overflow-hidden">
        {/* Floating gradient shapes - exact same as home page */}
        <div className="absolute inset-0 hidden md:block">
          {/* Large gradient circles */}
          <div className="absolute top-10 left-10 w-32 h-32 rounded-full animate-float-1" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', opacity: 0.1 }}></div>
          <div className="absolute top-20 right-20 w-40 h-40 rounded-full animate-float-2" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', opacity: 0.08 }}></div>
          <div className="absolute bottom-20 left-20 w-36 h-36 rounded-full animate-float-3" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', opacity: 0.1 }}></div>
          <div className="absolute bottom-10 right-10 w-28 h-28 rounded-full animate-float-4" style={{ background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)', opacity: 0.12 }}></div>

          {/* Medium gradient shapes */}
          <div className="absolute top-40 left-1/4 w-20 h-20 animate-float-5" style={{ background: 'linear-gradient(45deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)', opacity: 0.15, clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}></div>
          <div className="absolute top-32 right-1/3 w-24 h-24 rounded-full animate-float-6" style={{ background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)', opacity: 0.1 }}></div>
          <div className="absolute bottom-40 right-1/4 w-18 h-18 animate-float-1" style={{ background: 'linear-gradient(45deg, #a8edea 0%, #fed6e3 100%)', opacity: 0.12, clipPath: 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)' }}></div>
          <div className="absolute bottom-32 left-1/3 w-22 h-22 animate-float-2" style={{ background: 'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)', opacity: 0.1, borderRadius: '0 50% 50% 50%' }}></div>

          {/* Small accent shapes */}
          <div className="absolute top-16 left-1/2 w-12 h-12 rounded-full animate-float-3" style={{ background: 'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)', opacity: 0.2 }}></div>
          <div className="absolute top-60 right-1/2 w-8 h-8 animate-float-4" style={{ background: 'linear-gradient(45deg, #fdbb2d 0%, #22c1c3 100%)', opacity: 0.25, clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}></div>
          <div className="absolute bottom-60 left-1/2 w-14 h-14 animate-float-5" style={{ background: 'linear-gradient(135deg, #ee9ca7 0%, #ffdde1 100%)', opacity: 0.18, borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%' }}></div>
          <div className="absolute bottom-48 right-1/2 w-10 h-10 rounded-full animate-float-6" style={{ background: 'linear-gradient(135deg, #ff9a9e 0%, #fad0c4 100%)', opacity: 0.2 }}></div>

          {/* Additional dots scattered */}
          <div className="absolute top-28 left-20 w-2 h-2 rounded-full animate-float-5" style={{ background: '#f472b6', opacity: 0.45 }}></div>
          <div className="absolute top-44 right-24 w-2 h-2 rounded-full animate-float-6" style={{ background: '#60a5fa', opacity: 0.4 }}></div>
          <div className="absolute bottom-40 left-24 w-2 h-2 rounded-full animate-float-1" style={{ background: '#fb923c', opacity: 0.5 }}></div>
          <div className="absolute bottom-36 right-20 w-2 h-2 rounded-full animate-float-2" style={{ background: '#34d399', opacity: 0.45 }}></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 max-w-4xl">
          <div className="text-center animate-fade-in">
            <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold lg:font-normal text-gray-900 mb-4 sm:mb-6 leading-tight">
              Mortgage Calculator Tool
            </h1>
            
            <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed max-w-2xl mx-auto px-4">
              Calculate your home loan EMI, total interest, and monthly payments. Plan your home purchase with accurate mortgage calculations.
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
                <div>
                  <Label htmlFor="loan-amount" className="text-base font-semibold text-gray-700 mb-3 block">Loan Amount (₹)</Label>
                  <Input
                    id="loan-amount"
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    placeholder="e.g., 5000000"
                    className="h-12 border-2 border-gray-200 focus:border-green-400 rounded-xl transition-all duration-300"
                    data-testid="loan-amount-input"
                  />
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

          {/* Results Section */}
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
                {mortgageResult ? (
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

                    {/* Affordability Tips */}
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
                      <h4 className="font-semibold text-blue-800 mb-2">💡 Mortgage Tips:</h4>
                      <ul className="text-sm text-blue-700 space-y-1">
                        <li>• Keep EMI below 40% of your monthly income</li>
                        <li>• Compare rates from multiple lenders</li>
                        <li>• Consider making prepayments to reduce interest</li>
                        <li>• Factor in additional costs like insurance and taxes</li>
                      </ul>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Home className="w-10 h-10 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-2">No Calculation Yet</h3>
                    <p className="text-gray-500 text-sm">Enter your loan details to calculate EMI</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Year-wise Breakdown */}
        {mortgageResult && (
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden mb-12">
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