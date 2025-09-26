import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calculator } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Helmet } from "react-helmet-async";

export default function MortgageCalculator() {
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [tenure, setTenure] = useState("");
  const [result, setResult] = useState<{emi: number, total: number, interest: number} | null>(null);

  const calculateMortgage = () => {
    if (!loanAmount || !interestRate || !tenure) return;

    const principal = parseFloat(loanAmount);
    const rate = parseFloat(interestRate) / 100 / 12;
    const time = parseInt(tenure) * 12;

    if (principal <= 0 || rate < 0 || time <= 0) return;

    const emi = rate === 0 
      ? principal / time 
      : (principal * rate * Math.pow(1 + rate, time)) / (Math.pow(1 + rate, time) - 1);
    
    const total = emi * time;
    const interest = total - principal;

    setResult({ emi, total, interest });
  };

  const clear = () => {
    setResult(null);
    setLoanAmount("");
    setInterestRate("");
    setTenure("");
  };

  const formatCurrency = (amount: number) => {
    return `₹${amount.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`;
  };

  return (
    <>
      <Helmet>
        <title>Mortgage Calculator - Calculate EMI | GinyWow</title>
        <meta name="description" content="Free mortgage calculator to calculate monthly EMI, interest and loan payments. Fast and accurate home loan calculator for India." />
      </Helmet>
      
      <Header currentPage="Mortgage Calculator" />
      
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
              Mortgage Calculator
            </h1>
            <p className="text-gray-600">
              Calculate your monthly EMI, total interest, and loan payments instantly
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Input Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5" />
                  Loan Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Loan Amount (₹)</label>
                  <Input
                    type="number"
                    value={loanAmount}
                    onChange={(e) => setLoanAmount(e.target.value)}
                    placeholder="e.g., 5000000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Interest Rate (% per year)</label>
                  <Input
                    type="number"
                    step="0.1"
                    value={interestRate}
                    onChange={(e) => setInterestRate(e.target.value)}
                    placeholder="e.g., 8.5"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Loan Tenure (Years)</label>
                  <Input
                    type="number"
                    value={tenure}
                    onChange={(e) => setTenure(e.target.value)}
                    placeholder="e.g., 20"
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={calculateMortgage} className="flex-1">
                    Calculate
                  </Button>
                  <Button variant="outline" onClick={clear}>
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Results Card */}
            <Card>
              <CardHeader>
                <CardTitle>Results</CardTitle>
              </CardHeader>
              <CardContent>
                {result ? (
                  <div className="space-y-4">
                    <div className="bg-green-50 p-4 rounded-lg text-center">
                      <div className="text-2xl font-bold text-green-800">
                        {formatCurrency(result.emi)}
                      </div>
                      <div className="text-green-600">Monthly EMI</div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Total Amount:</span>
                        <span className="font-semibold">{formatCurrency(result.total)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Total Interest:</span>
                        <span className="font-semibold">{formatCurrency(result.interest)}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Enter loan details to see results
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}