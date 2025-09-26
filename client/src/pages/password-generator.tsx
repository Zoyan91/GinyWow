import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Copy, RefreshCw, Shield, Eye, EyeOff, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Helmet } from "react-helmet-async";

export default function PasswordGenerator() {
  const [password, setPassword] = useState("");
  const [length, setLength] = useState([12]);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [excludeSimilar, setExcludeSimilar] = useState(false);
  const [showPassword, setShowPassword] = useState(true);
  const { toast } = useToast();

  const generatePassword = useCallback(() => {
    let charset = "";
    if (includeUppercase) charset += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    if (includeLowercase) charset += "abcdefghijklmnopqrstuvwxyz";
    if (includeNumbers) charset += "0123456789";
    if (includeSymbols) charset += "!@#$%^&*()_+-=[]{}|;:,.<>?";

    if (excludeSimilar) {
      charset = charset.replace(/[0O1lI]/g, "");
    }

    if (!charset) {
      toast({
        title: "No Character Set Selected",
        description: "Please select at least one character type.",
        variant: "destructive"
      });
      return;
    }

    let generatedPassword = "";
    for (let i = 0; i < length[0]; i++) {
      generatedPassword += charset.charAt(Math.floor(Math.random() * charset.length));
    }

    setPassword(generatedPassword);
    toast({
      title: "Password Generated",
      description: "New secure password has been generated successfully!",
    });
  }, [length, includeUppercase, includeLowercase, includeNumbers, includeSymbols, excludeSimilar]);

  const copyPassword = () => {
    if (!password) {
      toast({
        title: "No Password",
        description: "Generate a password first to copy it.",
        variant: "destructive"
      });
      return;
    }

    navigator.clipboard.writeText(password).then(() => {
      toast({
        title: "Password Copied",
        description: "Password copied to clipboard successfully.",
      });
    }).catch(() => {
      toast({
        title: "Copy Failed",
        description: "Failed to copy password. Please try again.",
        variant: "destructive"
      });
    });
  };

  const getPasswordStrength = () => {
    if (!password) return { level: "none", color: "gray", text: "No Password" };
    
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    if (score <= 2) return { level: "weak", color: "red", text: "Weak" };
    if (score <= 4) return { level: "medium", color: "yellow", text: "Medium" };
    return { level: "strong", color: "green", text: "Strong" };
  };

  const strength = getPasswordStrength();

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Free Strong Password Generator – Create Secure Random Passwords Online | GinyWow</title>
        <meta name="description" content="Generate strong, secure, and random passwords instantly with GinyWow Password Generator. Protect your online accounts with custom length, symbols, and numbers. 100% free and safe." />
        <meta name="keywords" content="password generator, strong password, secure password, random password, password creator, cybersecurity, GinyWow" />
        <link rel="canonical" href="https://ginywow.com/password-generator" />
        
        {/* Open Graph tags */}
        <meta property="og:title" content="Strong Password Generator - Create Secure Passwords Online | GinyWow" />
        <meta property="og:description" content="Generate strong, secure passwords with GinyWow's free password generator. Customize length, characters, and complexity for maximum security." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ginywow.com/password-generator" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Strong Password Generator - Create Secure Passwords Online | GinyWow" />
        <meta name="twitter:description" content="Generate strong, secure passwords with GinyWow's free password generator. Customize length, characters, and complexity for maximum security." />
        
        {/* JSON-LD structured data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "GinyWow Password Generator",
            "description": "Free online tool to generate strong and secure passwords with customizable options",
            "url": "https://ginywow.com/password-generator",
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

      <Header currentPage="password-generator" />
      
      {/* Hero Section - Mobile First - Matching Home Page */}
      <section className="relative bg-purple-50 py-8 sm:py-12 lg:py-20 overflow-hidden">

        <div className="relative z-10 container mx-auto px-4 max-w-4xl">
          <div className="text-center animate-fade-in">
            <h1 className="text-xl sm:text-2xl lg:text-4xl font-bold lg:font-normal text-gray-900 mb-4 sm:mb-6 leading-tight">
              Free Strong Password Generator – Create Secure Random Passwords Online
            </h1>
            
            <p className="text-base sm:text-lg text-gray-600 mb-6 sm:mb-8 leading-relaxed max-w-2xl mx-auto px-4">
              Generate strong, secure, and random passwords instantly with GinyWow Password Generator. Protect your online accounts with custom length, symbols, and numbers. 100% free and safe.
            </p>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-8 max-w-5xl">

        {/* Input Section - Full Width */}
        <div className="mb-8">
          <div>
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="bg-purple-600 p-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                  <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  Password Settings
                </h2>
                <p className="text-purple-100 mt-2">
                  Customize strength and character types for your password
                </p>
              </div>
              <div className="p-6 space-y-6">
                {/* Password Length */}
                <div className="bg-purple-50 p-5 rounded-xl border border-purple-200">
                  <Label className="text-base font-semibold text-gray-700 mb-3 block">
                    Password Length: <span className="text-purple-600 font-bold">{length[0]} characters</span>
                  </Label>
                  <Slider
                    value={length}
                    onValueChange={setLength}
                    max={50}
                    min={4}
                    step={1}
                    className="mt-3"
                    data-testid="password-length-slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <span className="bg-gray-100 px-2 py-1 rounded">4</span>
                    <span className="bg-gray-100 px-2 py-1 rounded">50</span>
                  </div>
                </div>

                {/* Character Types */}
                <div className="bg-purple-50 p-5 rounded-xl border border-purple-200">
                  <Label className="text-base font-semibold text-gray-700 mb-4 block">Include Characters</Label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-3 bg-white p-3 rounded-lg border border-gray-200">
                      <Checkbox
                        id="uppercase"
                        checked={includeUppercase}
                        onCheckedChange={(checked: boolean) => setIncludeUppercase(checked)}
                        data-testid="uppercase-checkbox"
                      />
                      <Label htmlFor="uppercase" className="text-sm font-medium text-gray-700">
                        🔤 Uppercase (A-Z)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 bg-white p-3 rounded-lg border border-gray-200">
                      <Checkbox
                        id="lowercase"
                        checked={includeLowercase}
                        onCheckedChange={(checked: boolean) => setIncludeLowercase(checked)}
                        data-testid="lowercase-checkbox"
                      />
                      <Label htmlFor="lowercase" className="text-sm font-medium text-gray-700">
                        🔡 Lowercase (a-z)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 bg-white p-3 rounded-lg border border-gray-200">
                      <Checkbox
                        id="numbers"
                        checked={includeNumbers}
                        onCheckedChange={(checked: boolean) => setIncludeNumbers(checked)}
                        data-testid="numbers-checkbox"
                      />
                      <Label htmlFor="numbers" className="text-sm font-medium text-gray-700">
                        🔢 Numbers (0-9)
                      </Label>
                    </div>
                    <div className="flex items-center space-x-3 bg-white p-3 rounded-lg border border-gray-200">
                      <Checkbox
                        id="symbols"
                        checked={includeSymbols}
                        onCheckedChange={(checked: boolean) => setIncludeSymbols(checked)}
                        data-testid="symbols-checkbox"
                      />
                      <Label htmlFor="symbols" className="text-sm font-medium text-gray-700">
                        🔣 Symbols (!@#$%^&*)
                      </Label>
                    </div>
                  </div>
                </div>

                {/* Advanced Options */}
                <div className="bg-purple-50 p-5 rounded-xl border border-purple-200">
                  <Label className="text-base font-semibold text-gray-700 mb-3 block">Advanced Options</Label>
                  <div className="flex items-center space-x-3 bg-white p-3 rounded-lg border border-gray-200">
                    <Checkbox
                      id="exclude-similar"
                      checked={excludeSimilar}
                      onCheckedChange={(checked: boolean) => setExcludeSimilar(checked)}
                      data-testid="exclude-similar-checkbox"
                    />
                    <Label htmlFor="exclude-similar" className="text-sm font-medium text-gray-700">
                      ⚠️ Exclude Similar Characters (0, O, 1, l, I)
                    </Label>
                  </div>
                </div>

                {/* Generate Button */}
                <Button
                  onClick={generatePassword}
                  className="w-full h-14 bg-purple-600 hover:bg-purple-700 text-white text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl"
                  data-testid="generate-password-button"
                >
                  <RefreshCw className="w-5 h-5 mr-3" />
                  Generate Secure Password ✨
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Results Section - Only show after generation */}
        {password && (
          <div className="mb-8">
            <div>
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6">
                  <h2 className="text-xl font-bold text-white flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                      <Eye className="w-5 h-5 text-white" />
                    </div>
                    Generated Password
                  </h2>
                  <p className="text-blue-100 mt-2">
                    Your secure password is ready to use
                  </p>
                </div>
                <div className="p-6 space-y-6">
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      readOnly
                      className="pr-20 font-mono h-14 text-lg border-2 border-gray-200 focus:border-purple-400 rounded-xl bg-white"
                      data-testid="generated-password"
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPassword(!showPassword)}
                        className="h-10 w-10 p-0 bg-white shadow-md hover:shadow-lg rounded-lg border border-gray-200"
                        data-testid="toggle-password-visibility"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={copyPassword}
                        className="h-10 w-10 p-0 bg-white shadow-md hover:shadow-lg rounded-lg border border-gray-200"
                        data-testid="copy-password-button"
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Password Strength */}
                  <div className="bg-purple-50 p-5 rounded-xl border border-purple-200">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-base font-semibold text-gray-700">Password Strength:</span>
                      <Badge
                        className={`px-3 py-1 text-sm font-medium ${
                          strength.color === "green" ? "bg-green-100 text-green-700 border-green-200" : 
                          strength.color === "yellow" ? "bg-yellow-100 text-yellow-700 border-yellow-200" : 
                          "bg-red-100 text-red-700 border-red-200"
                        }`}
                        data-testid="password-strength"
                      >
                        {strength.level === "strong" ? "🛡️ Strong" : strength.level === "medium" ? "⚠️ Medium" : "❌ Weak"}
                      </Badge>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div 
                        className={`h-3 rounded-full transition-all duration-500 ${
                          strength.color === "green" ? "bg-green-500" : 
                          strength.color === "yellow" ? "bg-yellow-500" : 
                          "bg-red-500"
                        }`}
                        style={{ 
                          width: strength.level === "strong" ? "100%" : 
                                 strength.level === "medium" ? "60%" : 
                                 strength.level === "weak" ? "30%" : "0%" 
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Security Tip */}
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <AlertTriangle className="w-4 h-4 text-green-600" />
                      </div>
                      <div className="text-sm text-green-700">
                        <p className="font-semibold mb-1">🔐 Security Tip:</p>
                        <p>Never share your password and use unique passwords for each account. Store them in a password manager.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Information Sections */}
        <div className="space-y-8">
          {/* What is a Password Generator */}
          <section className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What is a Password Generator?</h2>
            <p className="text-gray-700 leading-relaxed">
              A <strong>Password Generator</strong> is a free online tool that instantly creates strong, random, and secure passwords. In today's digital world, weak passwords can put your personal data, banking accounts, and social media profiles at risk. Using a password generator ensures your online identity stays protected from hackers and cyber threats.
            </p>
          </section>

          {/* Why Use GinyWow Password Generator */}
          <section className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Use GinyWow Password Generator?</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-green-600 text-lg">✅</span>
                <div>
                  <strong className="text-gray-900">Strong Security</strong>
                  <span className="text-gray-700"> – Generates random combinations of letters, numbers, and symbols.</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-600 text-lg">✅</span>
                <div>
                  <strong className="text-gray-900">Customizable</strong>
                  <span className="text-gray-700"> – Choose password length, uppercase, lowercase, and special characters.</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-600 text-lg">✅</span>
                <div>
                  <strong className="text-gray-900">Instant & Free</strong>
                  <span className="text-gray-700"> – Get secure passwords in one click.</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-600 text-lg">✅</span>
                <div>
                  <strong className="text-gray-900">Worldwide Use</strong>
                  <span className="text-gray-700"> – Trusted by users across the USA, UK, Canada, Australia, and beyond.</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-green-600 text-lg">✅</span>
                <div>
                  <strong className="text-gray-900">No Data Stored</strong>
                  <span className="text-gray-700"> – Your generated passwords are never saved for maximum privacy.</span>
                </div>
              </div>
            </div>
          </section>

          {/* How to Use the Password Generator */}
          <section className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Use the Password Generator?</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="bg-purple-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">1</div>
                <p className="text-gray-700">Select your <strong>desired password length</strong> (8–32 characters recommended).</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-purple-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">2</div>
                <div className="text-gray-700">
                  <p className="mb-2">Choose character types:</p>
                  <div className="ml-4 space-y-1">
                    <p>🔡 Lowercase letters</p>
                    <p>🔠 Uppercase letters</p>
                    <p>🔢 Numbers</p>
                    <p>🔣 Special symbols (@, #, $, %, &)</p>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-purple-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">3</div>
                <p className="text-gray-700">Click <strong>Generate Password</strong>.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-purple-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">4</div>
                <p className="text-gray-700">Copy and use it instantly for your online accounts.</p>
              </div>
            </div>
          </section>

          {/* Benefits of Using a Strong Password */}
          <section className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Benefits of Using a Strong Password</h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <span className="text-xl">🔒</span>
                <div>
                  <strong className="text-gray-900">Protects against hacking & brute force attacks</strong>
                  <span className="text-gray-700">.</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl">📧</span>
                <div>
                  <strong className="text-gray-900">Secures your email and social media</strong>
                  <span className="text-gray-700"> accounts.</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl">🏦</span>
                <div>
                  <strong className="text-gray-900">Keeps your banking & financial details</strong>
                  <span className="text-gray-700"> safe.</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-xl">💻</span>
                <div>
                  <strong className="text-gray-900">Perfect for developers, IT professionals, and businesses</strong>
                  <span className="text-gray-700">.</span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}