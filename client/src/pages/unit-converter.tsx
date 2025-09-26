import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeftRight, Ruler, Scale } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Helmet } from "react-helmet-async";

export default function UnitConverter() {
  const [fromValue, setFromValue] = useState("");
  const [fromUnit, setFromUnit] = useState("");
  const [toUnit, setToUnit] = useState("");
  const [category, setCategory] = useState<"length" | "weight">("length");
  const [result, setResult] = useState("");

  const conversions = {
    length: {
      name: "Length",
      icon: <Ruler className="w-4 h-4" />,
      units: {
        mm: { name: "Millimeters", factor: 1 },
        cm: { name: "Centimeters", factor: 10 },
        m: { name: "Meters", factor: 1000 },
        km: { name: "Kilometers", factor: 1000000 },
        in: { name: "Inches", factor: 25.4 },
        ft: { name: "Feet", factor: 304.8 },
        yd: { name: "Yards", factor: 914.4 },
        mi: { name: "Miles", factor: 1609344 },
      }
    },
    weight: {
      name: "Weight",
      icon: <Scale className="w-4 h-4" />,
      units: {
        mg: { name: "Milligrams", factor: 1 },
        g: { name: "Grams", factor: 1000 },
        kg: { name: "Kilograms", factor: 1000000 },
        oz: { name: "Ounces", factor: 28349.5 },
        lb: { name: "Pounds", factor: 453592 },
        t: { name: "Tons", factor: 1000000000 },
      }
    }
  };

  const convert = () => {
    if (!fromValue || !fromUnit || !toUnit) return;

    const inputValue = parseFloat(fromValue);
    if (isNaN(inputValue)) return;

    const fromFactor = (conversions[category].units as any)[fromUnit].factor;
    const toFactor = (conversions[category].units as any)[toUnit].factor;
    const convertedValue = (inputValue * fromFactor) / toFactor;

    setResult(convertedValue.toFixed(6).replace(/\.?0+$/, ''));
  };

  const swap = () => {
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

  const clear = () => {
    setFromValue("");
    setResult("");
  };

  const handleCategoryChange = (newCategory: "length" | "weight") => {
    setCategory(newCategory);
    setFromUnit("");
    setToUnit("");
    setResult("");
  };

  const currentCategory = conversions[category as keyof typeof conversions];

  return (
    <>
      <Helmet>
        <title>Unit Converter - Convert Length & Weight | GinyWow</title>
        <meta name="description" content="Free unit converter tool for length and weight measurements. Convert between metric and imperial units instantly." />
      </Helmet>
      
      <Header currentPage="Unit Converter" />
      
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="text-center mb-8">
            <h1 className="text-2xl md:text-4xl font-bold text-gray-900 mb-4">
              Unit Converter
            </h1>
            <p className="text-gray-600">
              Convert between different units of length and weight
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-center gap-2">
                  {currentCategory.icon}
                  {currentCategory.name} Converter
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Category Selection */}
                <div>
                  <label className="block text-sm font-medium mb-2">Category</label>
                  <Select value={category} onValueChange={handleCategoryChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="length">Length</SelectItem>
                      <SelectItem value="weight">Weight</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* From Section */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">From</label>
                    <div className="space-y-2">
                      <Input
                        type="number"
                        value={fromValue}
                        onChange={(e) => setFromValue(e.target.value)}
                        placeholder="Enter value"
                      />
                      <Select value={fromUnit} onValueChange={setFromUnit}>
                        <SelectTrigger>
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

                  <div>
                    <label className="block text-sm font-medium mb-2">To</label>
                    <div className="space-y-2">
                      <Input
                        type="text"
                        value={result}
                        readOnly
                        placeholder="Result"
                        className="bg-gray-100"
                      />
                      <Select value={toUnit} onValueChange={setToUnit}>
                        <SelectTrigger>
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

                {/* Buttons */}
                <div className="flex gap-2">
                  <Button onClick={convert} className="flex-1">
                    Convert
                  </Button>
                  <Button variant="outline" onClick={swap} disabled={!fromUnit || !toUnit}>
                    <ArrowLeftRight className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" onClick={clear}>
                    Clear
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}