import { useState } from "react";
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ArrowLeftRight, Calculator, Ruler, Scale, Timer } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Helmet } from "react-helmet-async";

interface ConversionCategory {
  name: string;
  icon: React.ReactNode;
  units: { [key: string]: { name: string; factor: number } };
}

export default function UnitConverter() {
  const [fromValue, setFromValue] = useState("");
  const [fromUnit, setFromUnit] = useState("");
  const [toUnit, setToUnit] = useState("");
  const [category, setCategory] = useState("length");
  const [result, setResult] = useState("");
  const { toast } = useToast();

  const conversionCategories: { [key: string]: ConversionCategory } = {
    length: {
      name: "Length",
      icon: <Ruler className="w-4 h-4" />,
      units: {
        millimeter: { name: "Millimeter (mm)", factor: 1 },
        centimeter: { name: "Centimeter (cm)", factor: 10 },
        meter: { name: "Meter (m)", factor: 1000 },
        kilometer: { name: "Kilometer (km)", factor: 1000000 },
        inch: { name: "Inch (in)", factor: 25.4 },
        foot: { name: "Foot (ft)", factor: 304.8 },
        yard: { name: "Yard (yd)", factor: 914.4 },
        mile: { name: "Mile (mi)", factor: 1609344 },
      }
    },
    weight: {
      name: "Weight",
      icon: <Scale className="w-4 h-4" />,
      units: {
        milligram: { name: "Milligram (mg)", factor: 1 },
        gram: { name: "Gram (g)", factor: 1000 },
        kilogram: { name: "Kilogram (kg)", factor: 1000000 },
        ounce: { name: "Ounce (oz)", factor: 28349.5 },
        pound: { name: "Pound (lb)", factor: 453592 },
        stone: { name: "Stone (st)", factor: 6350293 },
        ton: { name: "Ton (t)", factor: 1000000000 },
      }
    },
    temperature: {
      name: "Temperature",
      icon: <Timer className="w-4 h-4" />,
      units: {
        celsius: { name: "Celsius (°C)", factor: 1 },
        fahrenheit: { name: "Fahrenheit (°F)", factor: 1 },
        kelvin: { name: "Kelvin (K)", factor: 1 },
      }
    },
    area: {
      name: "Area",
      icon: <Calculator className="w-4 h-4" />,
      units: {
        squareMillimeter: { name: "Square Millimeter (mm²)", factor: 1 },
        squareCentimeter: { name: "Square Centimeter (cm²)", factor: 100 },
        squareMeter: { name: "Square Meter (m²)", factor: 1000000 },
        squareKilometer: { name: "Square Kilometer (km²)", factor: 1000000000000 },
        squareInch: { name: "Square Inch (in²)", factor: 645.16 },
        squareFoot: { name: "Square Foot (ft²)", factor: 92903.04 },
        squareYard: { name: "Square Yard (yd²)", factor: 836127.36 },
        acre: { name: "Acre", factor: 4046856422.4 },
      }
    },
    volume: {
      name: "Volume",
      icon: <ArrowLeftRight className="w-4 h-4" />,
      units: {
        milliliter: { name: "Milliliter (ml)", factor: 1 },
        liter: { name: "Liter (l)", factor: 1000 },
        gallon: { name: "Gallon (gal)", factor: 3785.41 },
        quart: { name: "Quart (qt)", factor: 946.353 },
        pint: { name: "Pint (pt)", factor: 473.176 },
        cup: { name: "Cup", factor: 236.588 },
        fluidOunce: { name: "Fluid Ounce (fl oz)", factor: 29.5735 },
        tablespoon: { name: "Tablespoon (tbsp)", factor: 14.7868 },
        teaspoon: { name: "Teaspoon (tsp)", factor: 4.92892 },
      }
    }
  };

  const convertUnits = () => {
    if (!fromValue || !fromUnit || !toUnit) {
      toast({
        title: "Missing Information",
        description: "Please enter a value and select both units.",
        variant: "destructive"
      });
      return;
    }

    const inputValue = parseFloat(fromValue);
    if (isNaN(inputValue)) {
      toast({
        title: "Invalid Number",
        description: "Please enter a valid number.",
        variant: "destructive"
      });
      return;
    }

    let convertedValue: number;

    if (category === "temperature") {
      // Special handling for temperature conversions
      convertedValue = convertTemperature(inputValue, fromUnit, toUnit);
    } else {
      // Standard conversions using factors
      const fromFactor = conversionCategories[category].units[fromUnit].factor;
      const toFactor = conversionCategories[category].units[toUnit].factor;
      convertedValue = (inputValue * fromFactor) / toFactor;
    }

    setResult(convertedValue.toFixed(6).replace(/\.?0+$/, ''));
    
    toast({
      title: "Conversion Complete",
      description: "Units converted successfully!",
    });
  };

  const convertTemperature = (value: number, from: string, to: string): number => {
    // Convert to Celsius first
    let celsius: number;
    switch (from) {
      case "fahrenheit":
        celsius = (value - 32) * 5/9;
        break;
      case "kelvin":
        celsius = value - 273.15;
        break;
      default:
        celsius = value;
    }

    // Convert from Celsius to target
    switch (to) {
      case "fahrenheit":
        return celsius * 9/5 + 32;
      case "kelvin":
        return celsius + 273.15;
      default:
        return celsius;
    }
  };

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    setFromUnit("");
    setToUnit("");
    setResult("");
  };

  const swapUnits = () => {
    if (fromUnit && toUnit) {
      const tempUnit = fromUnit;
      setFromUnit(toUnit);
      setToUnit(tempUnit);
      
      if (result && fromValue) {
        setFromValue(result);
        setResult(fromValue);
      }
    }
  };

  const clearAll = () => {
    setFromValue("");
    setResult("");
    toast({
      title: "Cleared",
      description: "All values have been cleared.",
    });
  };

  const currentCategory = conversionCategories[category];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Free Unit Converter Tool - Convert Length, Weight, Temperature & More | GinyWow</title>
        <meta name="description" content="Free online unit converter by GinyWow. Convert length, weight, temperature, area, and volume units instantly. Support for metric and imperial systems." />
        <meta name="keywords" content="unit converter, metric conversion, imperial conversion, length converter, weight converter, temperature converter, measurement tool, GinyWow" />
        <link rel="canonical" href="https://ginywow.com/unit-converter" />
        
        {/* Open Graph tags */}
        <meta property="og:title" content="Free Unit Converter Tool - Convert Length, Weight, Temperature & More | GinyWow" />
        <meta property="og:description" content="Free online unit converter by GinyWow. Convert length, weight, temperature, area, and volume units instantly." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ginywow.com/unit-converter" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Unit Converter Tool - Convert Length, Weight, Temperature & More | GinyWow" />
        <meta name="twitter:description" content="Free online unit converter by GinyWow. Convert length, weight, temperature, area, and volume units instantly." />
        
        {/* JSON-LD structured data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "GinyWow Unit Converter",
            "description": "Free online unit converter for length, weight, temperature, area, and volume measurements",
            "url": "https://ginywow.com/unit-converter",
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

      <Header currentPage="unit-converter" />
      
      {/* Hero Section - Mobile First - Matching Home Page */}
      <section className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8 sm:py-12 lg:py-20 overflow-hidden">

        <div className="relative z-10 container mx-auto px-4 max-w-4xl">
          <div className="text-center animate-fade-in">
            <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold lg:font-normal text-gray-900 mb-4 sm:mb-6 leading-tight">
              Unit Converter Tool
            </h1>
            
            <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed max-w-2xl mx-auto px-4">
              Convert any measurement instantly. Length, weight, temperature, area, and volume conversions with precision and ease.
            </p>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-8 max-w-5xl">

        {/* Main Tool Section */}
        <div className="space-y-6 mb-8">
          {/* Category Selection */}
          <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-3">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Calculator className="w-5 h-5 text-white" />
                </div>
                Select Category
              </h2>
              <p className="text-blue-100 mt-2">
                Choose the measurement type you want to convert
              </p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {Object.entries(conversionCategories).map(([key, cat]) => (
                  <Button
                    key={key}
                    variant={category === key ? "default" : "outline"}
                    onClick={() => handleCategoryChange(key)}
                    className={`flex flex-col items-center gap-3 h-auto py-4 px-4 rounded-xl transition-all duration-300 ${
                      category === key 
                        ? "bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-lg scale-105" 
                        : "border-2 border-gray-200 hover:border-blue-400 hover:shadow-md"
                    }`}
                    data-testid={`category-${key}`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      category === key ? "bg-white/20" : "bg-blue-100"
                    }`}>
                      {React.cloneElement(cat.icon as React.ReactElement, { 
                        className: `w-4 h-4 ${category === key ? "text-white" : "text-blue-600"}`
                      })}
                    </div>
                    <span className="text-sm font-medium">{cat.name}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Conversion Interface */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* From Section */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-indigo-500 to-violet-600 p-6">
                <h2 className="text-xl font-bold text-white">From</h2>
                <p className="text-indigo-100 mt-2">Enter value and select unit</p>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <Label htmlFor="from-value" className="text-base font-semibold text-gray-700 mb-3 block">Value</Label>
                  <Input
                    id="from-value"
                    type="number"
                    placeholder="Enter number"
                    value={fromValue}
                    onChange={(e) => setFromValue(e.target.value)}
                    className="h-14 text-xl border-2 border-gray-200 focus:border-indigo-400 rounded-xl transition-all duration-300"
                    data-testid="from-value-input"
                  />
                </div>
                <div>
                  <Label htmlFor="from-unit" className="text-base font-semibold text-gray-700 mb-3 block">Unit</Label>
                  <Select value={fromUnit} onValueChange={setFromUnit}>
                    <SelectTrigger className="h-14 border-2 border-gray-200 focus:border-indigo-400 rounded-xl" data-testid="from-unit-select">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(currentCategory.units).map(([key, unit]) => (
                        <SelectItem key={key} value={key}>
                          {unit.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* To Section */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-violet-500 to-purple-600 p-6">
                <h2 className="text-xl font-bold text-white">To</h2>
                <p className="text-violet-100 mt-2">Select target unit and view result</p>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <Label htmlFor="result" className="text-base font-semibold text-gray-700 mb-3 block">Result</Label>
                  <Input
                    id="result"
                    value={result}
                    readOnly
                    placeholder="Result will appear here"
                    className="h-14 text-xl font-bold border-2 border-gray-200 rounded-xl bg-gradient-to-r from-gray-50 to-white"
                    data-testid="result-display"
                  />
                </div>
                <div>
                  <Label htmlFor="to-unit" className="text-base font-semibold text-gray-700 mb-3 block">Unit</Label>
                  <Select value={toUnit} onValueChange={setToUnit}>
                    <SelectTrigger className="h-14 border-2 border-gray-200 focus:border-violet-400 rounded-xl" data-testid="to-unit-select">
                      <SelectValue placeholder="Select unit" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(currentCategory.units).map(([key, unit]) => (
                        <SelectItem key={key} value={key}>
                          {unit.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 justify-center">
            <Button
              onClick={convertUnits}
              className="h-14 px-8 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl min-w-[160px]"
              data-testid="convert-button"
            >
              <Calculator className="w-5 h-5 mr-3" />
              Convert ✨
            </Button>
            <Button
              onClick={swapUnits}
              variant="outline"
              disabled={!fromUnit || !toUnit}
              className="h-14 px-8 border-2 border-gray-200 hover:border-indigo-400 rounded-xl transition-all duration-300 min-w-[160px]"
              data-testid="swap-units-button"
            >
              <ArrowLeftRight className="w-5 h-5 mr-3" />
              Swap Units
            </Button>
            <Button
              onClick={clearAll}
              variant="outline"
              className="h-14 px-8 border-2 border-gray-200 hover:border-red-400 hover:text-red-600 rounded-xl transition-all duration-300 min-w-[160px]"
              data-testid="clear-all-button"
            >
              Clear All
            </Button>
          </div>

          {/* Quick Conversion Display */}
          {result && fromValue && fromUnit && toUnit && (
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="pt-6">
                <div className="text-center">
                  <Badge variant="secondary" className="mb-2">Conversion Result</Badge>
                  <p className="text-xl font-bold text-blue-900">
                    {fromValue} {currentCategory.units[fromUnit].name} = {result} {currentCategory.units[toUnit].name}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Information Sections */}
        <div className="space-y-8">
          {/* What is GinyWow Unit Converter */}
          <section className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What is GinyWow Unit Converter?</h2>
            <p className="text-gray-700 leading-relaxed">
              GinyWow Unit Converter is a comprehensive, free online tool that converts between different units of measurement. 
              Supporting 5 major categories with both metric and imperial systems, it's perfect for students, professionals, 
              travelers, and anyone needing quick and accurate unit conversions.
            </p>
          </section>

          {/* Supported Categories */}
          <section className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Supported Conversion Categories</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Ruler className="w-5 h-5 text-blue-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Length</h3>
                    <p className="text-gray-600 text-sm">mm, cm, m, km, in, ft, yd, mi</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Scale className="w-5 h-5 text-green-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Weight</h3>
                    <p className="text-gray-600 text-sm">mg, g, kg, oz, lb, st, ton</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Timer className="w-5 h-5 text-red-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Temperature</h3>
                    <p className="text-gray-600 text-sm">Celsius, Fahrenheit, Kelvin</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Calculator className="w-5 h-5 text-purple-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Area</h3>
                    <p className="text-gray-600 text-sm">mm², cm², m², km², in², ft², yd², acre</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ArrowLeftRight className="w-5 h-5 text-orange-600 mt-1" />
                  <div>
                    <h3 className="font-semibold text-gray-900">Volume</h3>
                    <p className="text-gray-600 text-sm">ml, l, gal, qt, pt, cup, fl oz, tbsp, tsp</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* How to Use */}
          <section className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Use GinyWow Unit Converter</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">1</div>
                <p className="text-gray-700">Select the category of units you want to convert (Length, Weight, etc.)</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">2</div>
                <p className="text-gray-700">Enter the value you want to convert in the "From" section</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">3</div>
                <p className="text-gray-700">Select the source unit and target unit from the dropdown menus</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">4</div>
                <p className="text-gray-700">Click "Convert" to see the result, or use "Swap Units" to reverse the conversion</p>
              </div>
            </div>
          </section>

          {/* Common Use Cases */}
          <section className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Common Use Cases</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Ruler className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Travel & Navigation</h3>
                <p className="text-gray-600 text-sm">Convert distances, speeds, and measurements while traveling</p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Calculator className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Cooking & Recipes</h3>
                <p className="text-gray-600 text-sm">Convert cooking measurements and ingredient quantities</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Scale className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Science & Engineering</h3>
                <p className="text-gray-600 text-sm">Convert units for scientific calculations and engineering projects</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}