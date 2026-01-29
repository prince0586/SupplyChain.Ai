
export interface UserContext {
  detected_city: string;
  detected_state?: string;
  user_language: string;
  coordinates?: { lat: number; lng: number };
}

export type Theme = 'light' | 'dark';

export interface AgentLog {
  agent: string;
  action: string;
  observation: string;
  timestamp: string;
}

export interface InventoryItem {
  id: string;
  item_name: string;
  quantity: number;
  target_quantity: number;
  stock_status: 'Low Stock' | 'In Stock' | 'Overstock';
  category: string;
  expiry_date?: string;
  anomalies?: string[];
  audit_observations?: string;
}

export interface SupplierOffer {
  supplier: string;
  price: string;
  deliveryTime: string;
  rating: string;
  link: string;
}

export interface PODraft {
  to: string;
  subject: string;
  body: string;
  sources?: { title: string; uri: string }[];
}

export interface MarketingMetrics {
  predictedReach: number;
  actualReach: number;
  clicks: number;
  conversions: number;
}

export interface MarketingContent {
  id: string;
  platform: 'Instagram' | 'WhatsApp' | 'Facebook';
  caption: string;
  hashtags: string[];
  callToAction: string;
  imageUrl?: string;
  status: 'draft' | 'active' | 'completed';
  metrics: MarketingMetrics;
}

export interface Forecast {
  event: string;
  impact: string;
  recommendation: string;
  source: string;
  timeframe: string;
  sources?: { title: string; uri: string }[];
}

export enum AgentMode {
  DASHBOARD = 'DASHBOARD',
  VISION = 'VISION',
  NEGOTIATOR = 'NEGOTIATOR',
  MARKETING = 'MARKETING',
  STRATEGY = 'STRATEGY'
}
