import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Gift } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Helmet } from "react-helmet-async";

export default function AgeCalculator() {
  const [birthDate, setBirthDate] = useState("");
  const [result, setResult] = useState<{years: number, months: number, days: number, nextBirthday: number} | null>(null);

  const calculateAge = () => {
    if (!birthDate) return;

    const birth = new Date(birthDate);
    const today = new Date();

    if (birth > today) return;

    let years = today.getFullYear() - birth.getFullYear();
    let months = today.getMonth() - birth.getMonth();
    let days = today.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
      days += lastMonth.getDate();
    }

    if (months < 0) {
      years--;
      months += 12;
    }

    // Calculate next birthday
    const nextBirthday = new Date(today.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBirthday <= today) {
      nextBirthday.setFullYear(today.getFullYear() + 1);
    }
    const daysToNext = Math.ceil((nextBirthday.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

    setResult({ years, months, days, nextBirthday: daysToNext });
  };

  const clear = () => {
    setBirthDate("");
    setResult(null);
  };

  return (
    <>
      <Helmet>
        <title>Age Calculator - Calculate Your Age | GinyWow</title>
        <meta name="description" content="Free age calculator to calculate your exact age in years, months, and days. Find out when your next birthday is." />
      </Helmet>
      
      <Header currentPage="Age Calculator" />
      
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
              Age Calculator
            </h1>
            <p className="text-gray-600">
              Calculate your exact age and find out when your next birthday is
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Input Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Enter Your Birth Date
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Birth Date</label>
                  <Input
                    type="date"
                    value={birthDate}
                    onChange={(e) => setBirthDate(e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div className="flex gap-2">
                  <Button onClick={calculateAge} className="flex-1" disabled={!birthDate}>
                    Calculate Age
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
                <CardTitle className="flex items-center gap-2">
                  <Gift className="w-5 h-5" />
                  Your Age
                </CardTitle>
              </CardHeader>
              <CardContent>
                {result ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-blue-800">{result.years}</div>
                        <div className="text-blue-600 text-sm">Years</div>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-green-800">{result.months}</div>
                        <div className="text-green-600 text-sm">Months</div>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-purple-800">{result.days}</div>
                        <div className="text-purple-600 text-sm">Days</div>
                      </div>
                    </div>
                    
                    <div className="bg-orange-50 p-4 rounded-lg text-center">
                      <div className="text-lg font-semibold text-orange-800">
                        Next Birthday in {result.nextBirthday} days 🎂
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    Enter your birth date to see your age
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