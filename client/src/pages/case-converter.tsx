import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Copy, RotateCcw, Type, ArrowUpDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Helmet } from "react-helmet-async";

export default function CaseConverter() {
  const [inputText, setInputText] = useState("");
  const { toast } = useToast();

  // Text conversion functions
  const convertToUpperCase = () => inputText.toUpperCase();
  const convertToLowerCase = () => inputText.toLowerCase();
  const convertToTitleCase = () => {
    return inputText.replace(/\w\S*/g, (txt) => 
      txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
  };
  const convertToSentenceCase = () => {
    return inputText.charAt(0).toUpperCase() + inputText.slice(1).toLowerCase();
  };
  const convertToCamelCase = () => {
    return inputText
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => 
        index === 0 ? word.toLowerCase() : word.toUpperCase()
      )
      .replace(/\s+/g, '');
  };
  const convertToPascalCase = () => {
    return inputText
      .replace(/(?:^\w|[A-Z]|\b\w)/g, (word) => word.toUpperCase())
      .replace(/\s+/g, '');
  };
  const convertToSnakeCase = () => {
    return inputText
      .replace(/\W+/g, ' ')
      .split(/ |\B(?=[A-Z])/)
      .map(word => word.toLowerCase())
      .join('_');
  };
  const convertToKebabCase = () => {
    return inputText
      .replace(/\W+/g, ' ')
      .split(/ |\B(?=[A-Z])/)
      .map(word => word.toLowerCase())
      .join('-');
  };
  const convertToAlternatingCase = () => {
    return inputText
      .split('')
      .map((char, index) => 
        index % 2 === 0 ? char.toLowerCase() : char.toUpperCase()
      )
      .join('');
  };
  const convertToInverseCase = () => {
    return inputText
      .split('')
      .map(char => 
        char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase()
      )
      .join('');
  };

  const copyText = (text: string, caseName: string) => {
    if (!text) {
      toast({
        title: "No Text",
        description: "Enter some text first to convert and copy.",
        variant: "destructive"
      });
      return;
    }

    navigator.clipboard.writeText(text).then(() => {
      toast({
        title: "Text Copied",
        description: `${caseName} text copied to clipboard successfully.`,
      });
    }).catch(() => {
      toast({
        title: "Copy Failed",
        description: "Failed to copy text. Please try again.",
        variant: "destructive"
      });
    });
  };

  const clearText = () => {
    setInputText("");
    toast({
      title: "Text Cleared",
      description: "Input text has been cleared successfully.",
    });
  };

  const conversions = [
    { name: "UPPERCASE", func: convertToUpperCase, description: "ALL LETTERS IN CAPITAL" },
    { name: "lowercase", func: convertToLowerCase, description: "all letters in small" },
    { name: "Title Case", func: convertToTitleCase, description: "First Letter Of Each Word Capitalized" },
    { name: "Sentence case", func: convertToSentenceCase, description: "First letter capitalized, rest lowercase" },
    { name: "camelCase", func: convertToCamelCase, description: "firstWordLowerRestCapitalized" },
    { name: "PascalCase", func: convertToPascalCase, description: "AllWordsCapitalizedNoSpaces" },
    { name: "snake_case", func: convertToSnakeCase, description: "words_separated_by_underscores" },
    { name: "kebab-case", func: convertToKebabCase, description: "words-separated-by-hyphens" },
    { name: "aLtErNaTiNg CaSe", func: convertToAlternatingCase, description: "lEtTeRs AlTeRnAtE bEtWeEn CaSeS" },
    { name: "iNVERSE cASE", func: convertToInverseCase, description: "cAPITAL LETTERS BECOME SMALL AND VICE VERSA" },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Free Case Converter Tool - Change Text Case Online | GinyWow</title>
        <meta name="description" content="Convert text case instantly with GinyWow's free case converter. Transform text to uppercase, lowercase, title case, camelCase, snake_case, and more. Copy results easily." />
        <meta name="keywords" content="case converter, text converter, uppercase, lowercase, title case, camelCase, snake_case, kebab-case, text transformation, GinyWow" />
        <link rel="canonical" href="https://ginywow.com/case-converter" />
        
        {/* Open Graph tags */}
        <meta property="og:title" content="Free Case Converter Tool - Change Text Case Online | GinyWow" />
        <meta property="og:description" content="Convert text case instantly with GinyWow's free case converter. Transform text to uppercase, lowercase, title case, camelCase, snake_case, and more." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ginywow.com/case-converter" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Case Converter Tool - Change Text Case Online | GinyWow" />
        <meta name="twitter:description" content="Convert text case instantly with GinyWow's free case converter. Transform text to uppercase, lowercase, title case, camelCase, snake_case, and more." />
        
        {/* JSON-LD structured data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "GinyWow Case Converter",
            "description": "Free online tool to convert text between different cases like uppercase, lowercase, title case, camelCase, snake_case, and more",
            "url": "https://ginywow.com/case-converter",
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

      <Header currentPage="case-converter" />
      
      <main className="container mx-auto px-4 py-8 max-w-6xl relative">
        {/* Floating Background Shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none hidden md:block">
          <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-full opacity-10 animate-float"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-teal-400 to-teal-600 rotate-45 opacity-10 animate-float-2"></div>
          <div className="absolute bottom-40 left-1/4 w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full opacity-15 animate-float-3"></div>
          <div className="absolute top-60 right-1/3 w-16 h-16 bg-gradient-to-br from-cyan-400 to-cyan-600 transform rotate-12 opacity-10 animate-float-4"></div>
          <div className="absolute bottom-20 right-16 w-28 h-28 bg-gradient-to-br from-lime-400 to-lime-600 rounded-full opacity-10 animate-float-5"></div>
          <div className="absolute top-96 left-1/2 w-6 h-6 bg-gradient-to-br from-mint-400 to-mint-600 rounded-full opacity-20 animate-float-6"></div>
        </div>

        {/* Hero Section */}
        <section className="relative z-10 text-center mb-12">
          <div className="max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-3 bg-gradient-to-r from-emerald-100 to-teal-100 px-6 py-3 rounded-full text-emerald-700 text-sm font-medium mb-6">
              <Type className="w-4 h-4" />
              Smart Text Converter
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent mb-6 leading-tight">
              Case Converter
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed max-w-3xl mx-auto">
              Transform your text instantly with 10+ case styles. From camelCase to UPPERCASE, get perfect formatting every time.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                <span>10+ Case Styles</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                <span>Instant Copy</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                <span>100% Free</span>
              </div>
            </div>
          </div>
        </section>

        {/* Main Tool Section */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Input Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 p-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <Type className="w-5 h-5 text-white" />
                  </div>
                  Input Text
                </h2>
                <p className="text-emerald-100 mt-2">
                  Enter text to convert to different cases
                </p>
              </div>
              <div className="p-6">
                <Textarea
                  placeholder="Type or paste your text here..."
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  className="min-h-[250px] text-base leading-relaxed border-2 border-gray-200 focus:border-emerald-400 rounded-xl resize-none transition-all duration-300"
                  data-testid="case-converter-textarea"
                />
                <div className="flex gap-3 mt-6">
                  <Button
                    variant="outline"
                    onClick={clearText}
                    disabled={!inputText}
                    className="h-12 px-6 border-2 border-gray-200 hover:border-emerald-400 rounded-xl transition-all duration-300"
                    data-testid="clear-text-button"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Clear Text
                  </Button>
                  <div className="ml-auto bg-gradient-to-r from-emerald-100 to-teal-100 px-4 py-3 rounded-xl border border-emerald-200">
                    <span className="text-emerald-700 font-semibold text-sm">
                      📝 {inputText.length} characters
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Conversion Results */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-teal-500 to-cyan-600 p-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <ArrowUpDown className="w-5 h-5 text-white" />
                  </div>
                  Conversion Results
                </h2>
                <p className="text-teal-100 mt-2">
                  Click any result to copy it instantly
                </p>
              </div>
              <div className="p-6">
                {inputText ? (
                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                    {conversions.map((conversion, index) => {
                      const convertedText = conversion.func();
                      return (
                        <div
                          key={index}
                          className="group bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-xl p-5 hover:border-emerald-300 hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
                          onClick={() => copyText(convertedText, conversion.name)}
                          data-testid={`conversion-${conversion.name.toLowerCase().replace(/\s+/g, '-')}`}
                        >
                          <div className="flex items-center justify-between mb-3">
                            <h3 className="font-bold text-gray-900 text-lg">{conversion.name}</h3>
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-emerald-100 rounded-lg flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                                <Copy className="w-4 h-4 text-emerald-600 group-hover:text-emerald-700 transition-colors" />
                              </div>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-4 font-medium">{conversion.description}</p>
                          <div className="bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-lg p-4 font-mono text-sm break-all shadow-inner">
                            {convertedText ? (
                              <span className="text-gray-800">{convertedText}</span>
                            ) : (
                              <span className="text-gray-400 italic">No output</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-20 text-gray-500">
                    <div className="w-20 h-20 bg-gradient-to-br from-emerald-100 to-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                      <Type className="w-10 h-10 text-emerald-500" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Ready to Convert</h3>
                    <p className="text-gray-500">Enter some text in the input field to see conversion results</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Information Sections */}
        <div className="space-y-8">
          {/* What is GinyWow Case Converter */}
          <section className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What is GinyWow Case Converter?</h2>
            <p className="text-gray-700 leading-relaxed">
              GinyWow Case Converter is a free online tool that instantly transforms your text into different case formats. 
              Whether you're a programmer needing variable names in camelCase, a writer formatting titles, or anyone needing 
              to change text case quickly, our converter supports 10+ different case conversion types with one-click copying.
            </p>
          </section>

          {/* Supported Case Types */}
          <section className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Supported Case Conversion Types</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">UPPERCASE</h3>
                    <p className="text-gray-600 text-sm">Convert all letters to capital letters</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">lowercase</h3>
                    <p className="text-gray-600 text-sm">Convert all letters to small letters</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Title Case</h3>
                    <p className="text-gray-600 text-sm">Capitalize first letter of each word</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Sentence case</h3>
                    <p className="text-gray-600 text-sm">Capitalize only the first letter</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">camelCase</h3>
                    <p className="text-gray-600 text-sm">First word lowercase, rest capitalized (programming)</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">PascalCase</h3>
                    <p className="text-gray-600 text-sm">All words capitalized, no spaces (programming)</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">snake_case</h3>
                    <p className="text-gray-600 text-sm">Lowercase words separated by underscores</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">kebab-case</h3>
                    <p className="text-gray-600 text-sm">Lowercase words separated by hyphens</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">aLtErNaTiNg CaSe</h3>
                    <p className="text-gray-600 text-sm">Letters alternate between upper and lower case</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">iNVERSE cASE</h3>
                    <p className="text-gray-600 text-sm">Swap case of each letter (upper ↔ lower)</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* How to Use */}
          <section className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Use GinyWow Case Converter</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">1</div>
                <p className="text-gray-700">Type or paste your text in the input area</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">2</div>
                <p className="text-gray-700">View all conversion results instantly</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">3</div>
                <p className="text-gray-700">Click any result to copy it to your clipboard</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">4</div>
                <p className="text-gray-700">Use the copied text wherever you need it</p>
              </div>
            </div>
          </section>

          {/* Use Cases */}
          <section className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">When to Use Different Case Types</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Type className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Programming</h3>
                <p className="text-gray-600 text-sm">camelCase, PascalCase, snake_case for variables and functions</p>
              </div>
              <div className="text-center">
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Copy className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Writing</h3>
                <p className="text-gray-600 text-sm">Title Case for headings, Sentence case for regular text</p>
              </div>
              <div className="text-center">
                <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                  <ArrowUpDown className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">Web Development</h3>
                <p className="text-gray-600 text-sm">kebab-case for URLs and CSS classes</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}