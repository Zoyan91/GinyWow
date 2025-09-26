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
        <title>Strong Password Generator - Create Secure Passwords Online | GinyWow</title>
        <meta name="description" content="Generate strong, secure passwords with GinyWow's free password generator. Customize length, characters, and complexity for maximum security. Copy and use instantly." />
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
      
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            GinyWow Password Generator
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Create strong, secure passwords with customizable options. Generate random passwords with uppercase, lowercase, numbers, and symbols for maximum security.
          </p>
        </div>

        {/* Main Tool Section */}
        <div className="grid lg:grid-cols-3 gap-6 mb-8">
          {/* Settings Panel */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="w-5 h-5 text-blue-600" />
                  Password Settings
                </CardTitle>
                <CardDescription>
                  Customize your password generation preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Password Length */}
                <div>
                  <Label className="text-base font-medium">Password Length: {length[0]}</Label>
                  <Slider
                    value={length}
                    onValueChange={setLength}
                    max={50}
                    min={4}
                    step={1}
                    className="mt-2"
                    data-testid="password-length-slider"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>4</span>
                    <span>50</span>
                  </div>
                </div>

                {/* Character Types */}
                <div className="space-y-4">
                  <Label className="text-base font-medium">Include Characters</Label>
                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="uppercase"
                        checked={includeUppercase}
                        onCheckedChange={(checked: boolean) => setIncludeUppercase(checked)}
                        data-testid="uppercase-checkbox"
                      />
                      <Label htmlFor="uppercase" className="text-sm">Uppercase Letters (A-Z)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="lowercase"
                        checked={includeLowercase}
                        onCheckedChange={(checked: boolean) => setIncludeLowercase(checked)}
                        data-testid="lowercase-checkbox"
                      />
                      <Label htmlFor="lowercase" className="text-sm">Lowercase Letters (a-z)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="numbers"
                        checked={includeNumbers}
                        onCheckedChange={(checked: boolean) => setIncludeNumbers(checked)}
                        data-testid="numbers-checkbox"
                      />
                      <Label htmlFor="numbers" className="text-sm">Numbers (0-9)</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="symbols"
                        checked={includeSymbols}
                        onCheckedChange={(checked: boolean) => setIncludeSymbols(checked)}
                        data-testid="symbols-checkbox"
                      />
                      <Label htmlFor="symbols" className="text-sm">Symbols (!@#$%^&*)</Label>
                    </div>
                  </div>
                </div>

                {/* Advanced Options */}
                <div className="space-y-3 pt-4 border-t">
                  <Label className="text-base font-medium">Advanced Options</Label>
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="exclude-similar"
                      checked={excludeSimilar}
                      onCheckedChange={(checked: boolean) => setExcludeSimilar(checked)}
                      data-testid="exclude-similar-checkbox"
                    />
                    <Label htmlFor="exclude-similar" className="text-sm">Exclude Similar Characters (0, O, 1, l, I)</Label>
                  </div>
                </div>

                {/* Generate Button */}
                <Button
                  onClick={generatePassword}
                  className="w-full"
                  data-testid="generate-password-button"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Generate Password
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Password Display */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Generated Password</CardTitle>
                <CardDescription>
                  Your secure password
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    readOnly
                    placeholder="Click generate to create password"
                    className="pr-20 font-mono"
                    data-testid="generated-password"
                  />
                  <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                      className="h-6 w-6 p-0"
                      data-testid="toggle-password-visibility"
                    >
                      {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={copyPassword}
                      className="h-6 w-6 p-0"
                      disabled={!password}
                      data-testid="copy-password-button"
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>

                {/* Password Strength */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Strength:</span>
                    <Badge
                      variant={strength.color === "green" ? "default" : strength.color === "yellow" ? "secondary" : "destructive"}
                      data-testid="password-strength"
                    >
                      {strength.text}
                    </Badge>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${
                        strength.color === "green" ? "bg-green-500" : 
                        strength.color === "yellow" ? "bg-yellow-500" : "bg-red-500"
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
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                    <div className="text-xs text-amber-700">
                      <p className="font-medium mb-1">Security Tip:</p>
                      <p>Never share your password and use unique passwords for each account.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Information Sections */}
        <div className="space-y-8">
          {/* What is GinyWow Password Generator */}
          <section className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">What is GinyWow Password Generator?</h2>
            <p className="text-gray-700 leading-relaxed">
              GinyWow Password Generator is a free, secure online tool that creates strong, random passwords to protect your accounts. 
              With customizable options for length, character types, and complexity, you can generate passwords that meet any security requirement 
              while ensuring maximum protection against cyber threats.
            </p>
          </section>

          {/* Why Use Strong Passwords */}
          <section className="bg-white rounded-lg p-6 border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Why Use Strong Passwords?</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Prevent Hacking</h3>
                    <p className="text-gray-600 text-sm">Strong passwords are much harder to crack</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Protect Personal Data</h3>
                    <p className="text-gray-600 text-sm">Keep your personal information safe from breaches</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Secure Online Accounts</h3>
                    <p className="text-gray-600 text-sm">Protect email, banking, and social media accounts</p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Prevent Identity Theft</h3>
                    <p className="text-gray-600 text-sm">Reduce risk of identity and financial theft</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Compliance Requirements</h3>
                    <p className="text-gray-600 text-sm">Meet security standards for business and personal use</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <h3 className="font-semibold text-gray-900">Peace of Mind</h3>
                    <p className="text-gray-600 text-sm">Feel confident about your online security</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Password Best Practices */}
          <section className="bg-gray-50 rounded-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Password Security Best Practices</h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">1</div>
                <p className="text-gray-700">Use at least 12 characters for stronger security</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">2</div>
                <p className="text-gray-700">Include a mix of uppercase, lowercase, numbers, and symbols</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">3</div>
                <p className="text-gray-700">Use unique passwords for each account</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">4</div>
                <p className="text-gray-700">Enable two-factor authentication when available</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold">5</div>
                <p className="text-gray-700">Consider using a password manager for storage</p>
              </div>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}