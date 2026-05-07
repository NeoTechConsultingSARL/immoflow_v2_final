import { router } from "@inertiajs/react";
import { ArrowLeft, Newspaper, Building2, TrendingUp, Globe, Clock, User } from "lucide-react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/dashboard/AppSidebar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const categoryConfig = {
  "real-estate": { label: "Real Estate", icon: Building2, className: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20" },
  economy: { label: "Economy", icon: TrendingUp, className: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20" },
  market: { label: "Market", icon: Globe, className: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20" },
};

const articles: Record<string, { title: string; source: string; category: "real-estate" | "economy" | "market"; publishedAt: string; author: string; image: string; content: string }> = {
  "1": {
    title: "European Commercial Real Estate Market Shows Signs of Recovery in Q1 2026",
    source: "Reuters",
    category: "real-estate",
    publishedAt: "March 5, 2026 · 2h ago",
    author: "Sarah Mitchell",
    image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=1200&h=500&fit=crop",
    content: `The European commercial real estate market is showing clear signs of recovery in the first quarter of 2026, with transaction volumes increasing significantly across major cities.\n\nOffice spaces in London, Paris, and Frankfurt have seen a 15% uptick in leasing activity compared to the same period last year, driven by companies adopting hybrid work models that still require quality office environments.\n\nRetail real estate has also benefited from increased consumer confidence, with prime high-street locations in cities like Milan, Madrid, and Amsterdam reporting near-full occupancy rates.\n\n"We're seeing a fundamental shift in how investors view European commercial property," said Marcus Heller, Head of European Real Estate at JLL. "The market correction of 2024 created attractive entry points, and institutional investors are now capitalizing on these opportunities."\n\nThe logistics and industrial sector continues to outperform, with warehouse and distribution center demand remaining robust due to sustained e-commerce growth. Cap rates in this segment have compressed by 25 basis points year-over-year.\n\nAnalysts project that total European commercial real estate investment will reach €280 billion in 2026, representing a 22% increase from 2025 levels.`,
  },
  "2": {
    title: "ECB Holds Interest Rates Steady, Signals Potential Cut in April",
    source: "Bloomberg",
    category: "economy",
    publishedAt: "March 5, 2026 · 4h ago",
    author: "James Crawford",
    image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&h=500&fit=crop",
    content: `The European Central Bank maintained its benchmark interest rate at 2.5% during its March meeting, while signaling that an April rate cut remains on the table if inflation continues its downward trajectory.\n\nECB President Christine Lagarde noted that headline inflation across the eurozone has fallen to 1.8%, below the bank's 2% target for the second consecutive month.\n\n"The data supports a cautious but optimistic outlook," Lagarde stated during the post-meeting press conference. "We are closely monitoring wage growth dynamics and service sector inflation before making further adjustments."\n\nFor the real estate sector, the steady rate environment has provided a degree of certainty that market participants have welcomed. Mortgage rates across the eurozone have stabilized around 3.1%, encouraging both residential buyers and commercial investors.\n\nBond markets reacted positively to the announcement, with 10-year Bund yields dropping 5 basis points to 2.15%. Market pricing now implies a 78% probability of a 25-basis-point cut at the April meeting.\n\nEconomists at Deutsche Bank project that the ECB will deliver two additional rate cuts in 2026, bringing the benchmark rate to 2.0% by year-end.`,
  },
  "3": {
    title: "Residential Property Prices Rise 3.2% Across the Eurozone",
    source: "Financial Times",
    category: "market",
    publishedAt: "March 5, 2026 · 6h ago",
    author: "Elena Vasquez",
    image: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=1200&h=500&fit=crop",
    content: `Residential property prices across the eurozone rose by 3.2% in the 12 months ending January 2026, according to new data from Eurostat, marking the strongest annual growth since mid-2023.\n\nThe increase was driven primarily by urban centers where housing supply continues to lag behind demand. Cities such as Lisbon (+7.1%), Dublin (+5.8%), and Berlin (+4.9%) led the growth rankings.\n\nNew construction activity, while improving, has not kept pace with population growth in major metropolitan areas. Building permits issued across the eurozone increased by 8% year-over-year, but remain 15% below the 2019 peak.\n\n"The structural shortage of housing in Europe's major cities is a multi-decade challenge," said Dr. Anna Krüger, Chief Economist at the European Housing Observatory. "Policy interventions focused solely on demand-side measures will not resolve the fundamental supply deficit."\n\nRental markets have also tightened, with average rents in EU capital cities rising 4.5% annually. This trend has intensified calls for expanded social housing programs across multiple member states.\n\nInvestor interest in build-to-rent developments has surged, with institutional capital allocations to the sector doubling compared to 2024 levels.`,
  },
  "4": {
    title: "Green Building Standards Become Mandatory for New Developments",
    source: "Property Wire",
    category: "real-estate",
    publishedAt: "March 4, 2026 · 8h ago",
    author: "Thomas Bergmann",
    image: "https://images.unsplash.com/photo-1518005068251-37900150dfca?w=1200&h=500&fit=crop",
    content: `New EU regulations taking effect in 2027 will require all new building developments to meet stringent energy efficiency standards, fundamentally reshaping the European construction landscape.\n\nThe Energy Performance of Buildings Directive (EPBD) revision mandates that all new buildings achieve a minimum Energy Performance Certificate (EPC) rating of 'A' from January 2027 onwards.\n\nExisting commercial buildings will need to reach at least a 'C' rating by 2030, while residential properties have until 2033 to comply. The regulations are expected to drive an estimated €150 billion in renovation spending across the EU.\n\n"This is a watershed moment for the European real estate industry," said Maria Santos, Director of Sustainability at Cushman & Wakefield Europe. "Buildings that fail to meet these standards will face significant value depreciation."\n\nThe directive also introduces mandatory solar panel installations for new commercial buildings with roof areas exceeding 250 square meters, and requires all new buildings to be 'zero-emission' by 2030.\n\nProperty developers are already adapting their pipelines, with green-certified projects commanding a 12-18% rental premium over conventional buildings in prime European markets.`,
  },
  "5": {
    title: "Construction Costs Stabilize After Two Years of Volatility",
    source: "Construction Europe",
    category: "market",
    publishedAt: "March 4, 2026 · 12h ago",
    author: "Henrik Johansson",
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&h=500&fit=crop",
    content: `Construction material costs across Europe have finally stabilized after more than two years of significant volatility, providing welcome relief for developers and contractors.\n\nThe European Construction Industry Federation (FIEC) reported that its composite materials price index remained flat in the fourth quarter of 2025, following a 2.1% decline in Q3.\n\nSteel prices have fallen 18% from their 2024 peak, while timber costs have normalized to pre-pandemic levels. Cement prices remain elevated but have stopped rising, with producers reporting improved supply logistics.\n\n"The normalization of supply chains and increased domestic production capacity have been key factors in price stabilization," said Pierre Dubois, FIEC Secretary General.\n\nLabor costs, however, continue to present challenges. Skilled construction worker wages rose 5.2% year-over-year, reflecting persistent shortages across the sector. The EU construction industry estimates a deficit of approximately 1.2 million workers.\n\nDevelopers report that total project costs are now 8-12% lower than the 2024 peak, enabling previously shelved projects to become viable again. Several large-scale mixed-use developments in Berlin, Warsaw, and Barcelona have been restarted in recent months.`,
  },
  "6": {
    title: "PropTech Startups Raise Record €4.8B in 2025 Funding",
    source: "TechCrunch",
    category: "real-estate",
    publishedAt: "March 3, 2026 · 1d ago",
    author: "Lisa Chen",
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&h=500&fit=crop",
    content: `European PropTech startups raised a record €4.8 billion in venture capital funding during 2025, as investors bet on technology-driven transformation of the real estate industry.\n\nAI-powered property valuation platforms led the funding rounds, with Berlin-based Valuo raising €340 million in a Series C round at a €2.1 billion valuation. The company's machine learning models can assess property values with 97% accuracy.\n\nSustainability-focused PropTech also attracted significant capital. London's GreenBuild Analytics secured €180 million to expand its energy auditing platform, which uses IoT sensors and AI to optimize building performance.\n\n"We're at an inflection point where technology adoption in real estate is accelerating exponentially," said Dr. Felix Hartmann, Partner at PropTech-focused VC firm Concrete Ventures. "The industry is finally moving beyond pilot programs to full-scale deployment."\n\nOther notable segments include digital twin platforms for construction management, blockchain-based property registries, and AI-driven tenant screening solutions.\n\nThe UK led European PropTech investment with €1.6 billion raised, followed by Germany (€1.1B), France (€680M), and the Netherlands (€420M). The sector is projected to grow to €8.2 billion in annual funding by 2028.`,
  },
};

const NewsArticle = () => {
  
  const params = new URLSearchParams(window.location.search);
  const articleId = params.get("id") || "1";
  const article = articles[articleId];

  if (!article) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <div className="flex-1 flex flex-col min-w-0">
            <main className="flex-1 p-6 lg:p-8 flex items-center justify-center">
              <div className="text-center space-y-3">
                <Newspaper className="w-12 h-12 text-muted-foreground mx-auto" />
                <h2 className="font-display text-xl font-bold">Article not found</h2>
                <Button variant="outline" onClick={() => router.visit("/dashboard")}>
                  <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                </Button>
              </div>
            </main>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  const cat = categoryConfig[article.category];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0">
          <header className="h-14 bg-card border-b border-border flex items-center px-6 sticky top-0 z-40">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="lg:hidden" />
              <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground" onClick={() => router.visit("/dashboard")}>
                <ArrowLeft className="w-4 h-4" /> Dashboard
              </Button>
            </div>
          </header>

          <main className="flex-1 animate-in fade-in slide-in-from-bottom-1 duration-400">
            {/* Hero image */}
            <div className="w-full h-56 md:h-72 lg:h-80 overflow-hidden">
              <img src={article.image} alt={article.title} className="w-full h-full object-cover" />
            </div>

            <div className="max-w-3xl mx-auto px-6 lg:px-8 py-8">
              {/* Meta */}
              <div className="flex items-center gap-3 mb-4">
                <Badge variant="outline" className={`text-xs font-medium px-2 py-0.5 ${cat.className}`}>
                  {cat.label}
                </Badge>
                <span className="text-xs text-muted-foreground font-medium">{article.source}</span>
              </div>

              {/* Title */}
              <h1 className="font-display text-2xl md:text-3xl lg:text-[2rem] font-bold leading-tight mb-4">
                {article.title}
              </h1>

              {/* Author & date */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                <span className="flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" /> {article.author}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> {article.publishedAt}
                </span>
              </div>

              <Separator className="mb-6" />

              {/* Body */}
              <article className="prose prose-sm dark:prose-invert max-w-none text-[0.9375rem] leading-relaxed">
                {article.content.split("\n\n").map((paragraph, i) => (
                  <p key={i}>{paragraph}</p>
                ))}
              </article>
            </div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default NewsArticle;
