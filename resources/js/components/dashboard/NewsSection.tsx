import { router } from "@inertiajs/react";
import { useState } from "react";
import { Newspaper, ExternalLink, TrendingUp, Building2, Globe, RefreshCw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type NewsItem = {
  id: string;
  title: string;
  source: string;
  category: "real-estate" | "economy" | "market";
  publishedAt: string;
  url: string;
  summary: string;
  image: string;
};

const mockNews: NewsItem[] = [
  {
    id: "1",
    title: "European Commercial Real Estate Market Shows Signs of Recovery in Q1 2026",
    source: "Reuters",
    category: "real-estate",
    publishedAt: "2h ago",
    url: "#",
    summary: "Office and retail sectors see increased transaction volumes across major European cities.",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400&h=250&fit=crop",
  },
  {
    id: "2",
    title: "ECB Holds Interest Rates Steady, Signals Potential Cut in April",
    source: "Bloomberg",
    category: "economy",
    publishedAt: "4h ago",
    url: "#",
    summary: "The European Central Bank maintained its benchmark rate at 2.5%, citing stable inflation trends.",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=400&h=250&fit=crop",
  },
  {
    id: "3",
    title: "Residential Property Prices Rise 3.2% Across the Eurozone",
    source: "Financial Times",
    category: "market",
    publishedAt: "6h ago",
    url: "#",
    summary: "Demand for housing continues to outpace supply in urban centers, driving prices higher.",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400&h=250&fit=crop",
  },
  {
    id: "4",
    title: "Green Building Standards Become Mandatory for New Developments",
    source: "Property Wire",
    category: "real-estate",
    publishedAt: "8h ago",
    url: "#",
    summary: "New EU regulations require all developments to meet minimum energy efficiency ratings by 2027.",
    image: "https://images.unsplash.com/photo-1518005068251-37900150dfca?w=400&h=250&fit=crop",
  },
  {
    id: "5",
    title: "Construction Costs Stabilize After Two Years of Volatility",
    source: "Construction Europe",
    category: "market",
    publishedAt: "12h ago",
    url: "#",
    summary: "Material prices flatten as supply chains normalize, easing pressure on development budgets.",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=400&h=250&fit=crop",
  },
  {
    id: "6",
    title: "PropTech Startups Raise Record €4.8B in 2025 Funding",
    source: "TechCrunch",
    category: "real-estate",
    publishedAt: "1d ago",
    url: "#",
    summary: "Venture capital flows into property technology as AI-driven solutions reshape the real estate industry.",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=250&fit=crop",
  },
];

const categoryConfig = {
  "real-estate": { label: "Real Estate", icon: Building2, className: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20" },
  economy: { label: "Economy", icon: TrendingUp, className: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20" },
  market: { label: "Market", icon: Globe, className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" },
};

const NewsSection = () => {
  
  const [news] = useState<NewsItem[]>(mockNews);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Newspaper className="w-4 h-4 text-primary" />
          Real Estate & Economy News
        </CardTitle>
        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground">
          <RefreshCw className="w-3.5 h-3.5" />
        </Button>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {news.map((item) => {
            const cat = categoryConfig[item.category];
            return (
              <div
                key={item.id}
                onClick={() => router.visit(`/news?id=${item.id}`)}
                className="group rounded-lg border border-border bg-card overflow-hidden hover:shadow-md transition-all cursor-pointer"
              >
                <div className="aspect-[16/9] overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div className="p-3.5">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <Badge variant="outline" className={`text-[0.625rem] font-medium px-1.5 py-0 ${cat.className}`}>
                      {cat.label}
                    </Badge>
                    <span className="text-[0.625rem] text-muted-foreground shrink-0">{item.publishedAt}</span>
                  </div>
                  <h4 className="text-[0.8125rem] font-semibold leading-snug mb-1.5 group-hover:text-primary transition-colors line-clamp-2">
                    {item.title}
                  </h4>
                  <p className="text-[0.6875rem] text-muted-foreground leading-relaxed line-clamp-2">{item.summary}</p>
                  <div className="flex items-center gap-1.5 mt-2.5 text-[0.625rem] text-muted-foreground">
                    <span className="font-medium">{item.source}</span>
                    <ExternalLink className="w-2.5 h-2.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default NewsSection;
