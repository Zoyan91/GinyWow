import { Shield, Zap, Users, Star, CheckCircle, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function TrustBadges() {
  const trustSignals = [
    {
      icon: Shield,
      text: "100% Secure",
      color: "bg-green-100 text-green-700",
    },
    {
      icon: Zap,
      text: "Instant Convert",
      color: "bg-blue-100 text-blue-700",
    },
    {
      icon: Users,
      text: "10K+ Users",
      color: "bg-purple-100 text-purple-700",
    },
    {
      icon: Star,
      text: "4.9/5 Rating",
      color: "bg-yellow-100 text-yellow-700",
    },
    {
      icon: CheckCircle,
      text: "No Signup",
      color: "bg-emerald-100 text-emerald-700",
    },
    {
      icon: Download,
      text: "Free Forever",
      color: "bg-indigo-100 text-indigo-700",
    },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-3 mb-8">
      {trustSignals.map((signal, index) => (
        <Badge
          key={index}
          variant="outline"
          className={`${signal.color} border-0 px-4 py-2 font-medium flex items-center gap-2`}
        >
          <signal.icon className="h-4 w-4" />
          {signal.text}
        </Badge>
      ))}
    </div>
  );
}

export function StatsSection() {
  const stats = [
    { number: "50M+", label: "Images Converted", description: "Processed worldwide" },
    { number: "12+", label: "Format Support", description: "Popular formats" },
    { number: "99.9%", label: "Success Rate", description: "Reliable conversion" },
    { number: "< 5s", label: "Average Time", description: "Fast processing" },
  ];

  return (
    <div className="bg-gray-50 py-12 my-16 rounded-2xl">
      <div className="max-w-4xl mx-auto px-4">
        <h3 className="text-2xl font-bold text-center text-gray-900 mb-8">
          Trusted by Content Creators Worldwide
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {stats.map((stat, index) => (
            <div key={index} className="space-y-2">
              <div className="text-3xl font-bold text-blue-600">{stat.number}</div>
              <div className="font-semibold text-gray-900">{stat.label}</div>
              <div className="text-sm text-gray-600">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}