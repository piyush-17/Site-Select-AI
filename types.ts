export interface Financials {
  projectedRevenue: number[];
  projectedCosts: number[];
  breakEvenYear: number;
  roi: number;
}

export interface Demographics {
  populationDensity: string;
  avgIncome: number;
  dominantAgeGroup: string;
}

export interface MarketAnalysis {
  footTraffic: string;
  competitorDensity: string;
}

export interface Risk {
    level: 'Low' | 'Medium' | 'High';
    factors: string;
}

export interface LocationAnalysis {
  locationName: string;
  address: string;
  latitude: number;
  longitude: number;
  overallScore: number;
  summary: string;
  demographics: Demographics;
  marketAnalysis: MarketAnalysis;
  financials: Financials;
  risk: Risk;
}