import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ExternalLink, Droplets, TrendingUp, Globe, Database } from 'lucide-react';

export const BackgroundInfo = () => {
  const researchAreas = [
    {
      title: "Urban Hydrology",
      icon: Droplets,
      description: "Urban hydrology studies the movement, distribution, and quality of water in urban environments. It focuses on how urbanization affects natural water cycles through increased impervious surfaces, altered drainage patterns, and stormwater runoff.",
      keyPoints: [
        "Increased surface runoff due to impervious surfaces",
        "Changes in peak flow rates and timing",
        "Water quality degradation from urban pollutants",
        "Need for sustainable drainage systems"
      ]
    },
    {
      title: "Rainfall-Runoff Modeling",
      icon: TrendingUp,
      description: "Mathematical models that simulate the transformation of rainfall into surface runoff. These models are essential for flood prediction, drainage design, and water resource management in urban areas.",
      keyPoints: [
        "Time-area methods for runoff estimation",
        "Hydrodynamic routing through drainage networks",
        "Infiltration and loss models",
        "Calibration with observed data"
      ]
    },
    {
      title: "Spatial & Temporal Effects",
      icon: Globe,
      description: "The spatial distribution of rainfall and catchment properties, combined with temporal rainfall patterns, significantly affect runoff response. Understanding these effects is crucial for accurate modeling.",
      keyPoints: [
        "Spatial variability of rainfall intensity",
        "Catchment scale effects on runoff",
        "Temporal rainfall patterns and storm dynamics",
        "Impact on peak flows and volumes"
      ]
    },
    {
      title: "Stormwater Management",
      icon: Database,
      description: "Modern approaches to managing urban stormwater involve sophisticated modeling tools and sustainable practices to reduce flooding, protect water quality, and manage water resources.",
      keyPoints: [
        "Design of drainage infrastructure",
        "Low impact development (LID) techniques",
        "Real-time control systems",
        "Climate change adaptation"
      ]
    }
  ];

  const externalResources = [
    {
      title: "Impact of Spatial and Temporal Rainfall Resolution",
      url: "https://www.sciencedirect.com/science/article/pii/S0022169415003856",
      description: "Research on how rainfall input resolution affects urban hydrodynamic models across European catchments."
    },
    {
      title: "Spatiotemporal Structure of Rainfall on Flood Frequency",
      url: "https://hess.copernicus.org/articles/25/4701/2021/",
      description: "Analysis of how rainfall patterns affect flood frequency in urban areas."
    },
    {
      title: "EPA Storm Water Management Model (SWMM)",
      url: "https://www.epa.gov/water-research/storm-water-management-model-swmm",
      description: "Industry-standard software for stormwater modeling and analysis."
    }
  ];

  const historicalContext = [
    {
      period: "1960s-1970s",
      development: "Early urban drainage models developed, including the Rational Method and early computer-based approaches."
    },
    {
      period: "1980s",
      development: "Introduction of distributed hydrologic models and hydraulic routing techniques. Development of SWMM and similar tools."
    },
    {
      period: "1990s",
      development: "Focus on spatial variability and scale effects. Integration of GIS technology with hydrologic models."
    },
    {
      period: "2000s (This Thesis)",
      development: "Advanced understanding of micro-catchment processes and their scaling to larger urban catchments. Process-based modeling approaches."
    }
  ];

  return (
    <div className="space-y-6">
      <Card className="p-6 shadow-card">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <Globe className="h-6 w-6 text-primary" />
          Research Context & Background
        </h2>
        <p className="text-muted-foreground mb-6">
          This dissertation investigates the spatial and temporal effects on urban rainfall-runoff modeling, 
          contributing to our understanding of how urban catchments respond to storm events. The research 
          was conducted at the University of Technology, Sydney, with field work in Canberra, Australia.
        </p>

        <div className="grid gap-4 md:grid-cols-2">
          {researchAreas.map((area, index) => {
            const Icon = area.icon;
            return (
              <Card key={index} className="p-4 border-2 hover:border-primary/50 transition-colors">
                <div className="flex items-start gap-3 mb-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{area.title}</h3>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mb-3">
                  {area.description}
                </p>
                <Separator className="my-3" />
                <ul className="space-y-1.5">
                  {area.keyPoints.map((point, idx) => (
                    <li key={idx} className="text-sm flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            );
          })}
        </div>
      </Card>

      <Card className="p-6 shadow-card">
        <h2 className="text-xl font-bold mb-4">Historical Development</h2>
        <div className="space-y-4">
          {historicalContext.map((item, index) => (
            <div key={index} className="flex gap-4">
              <Badge variant="secondary" className="h-fit shrink-0">
                {item.period}
              </Badge>
              <p className="text-sm text-foreground/90">{item.development}</p>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 shadow-card">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <ExternalLink className="h-5 w-5 text-primary" />
          Related Research & Resources
        </h2>
        <div className="space-y-4">
          {externalResources.map((resource, index) => (
            <a
              key={index}
              href={resource.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-accent/5 transition-all group"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold group-hover:text-primary transition-colors">
                    {resource.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {resource.description}
                  </p>
                </div>
                <ExternalLink className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors shrink-0" />
              </div>
            </a>
          ))}
        </div>
      </Card>

      <Card className="p-6 shadow-card bg-muted/30">
        <h3 className="font-semibold mb-3">Key Research Contributions</h3>
        <ul className="space-y-2 text-sm">
          <li className="flex gap-2">
            <span className="text-primary">✓</span>
            <span>Development of the "Process Tree" modeling approach for urban catchments</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">✓</span>
            <span>Detailed micro-catchment analysis with paired roof and urban surface measurements</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">✓</span>
            <span>Investigation of scaling effects from micro to macro catchment levels</span>
          </li>
          <li className="flex gap-2">
            <span className="text-primary">✓</span>
            <span>Three-year monitoring program in Giralang catchment, Canberra</span>
          </li>
        </ul>
      </Card>
    </div>
  );
};
