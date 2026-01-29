
import { InventoryItem, MarketingContent, PODraft, SupplierOffer, Forecast, UserContext, AgentLog } from "../types";

// This service is temporarily hard-coded for demo recording stability.
export class GeminiService {
  private parseLogs(logStr: string): AgentLog[] {
    const lines = logStr.split('\n').filter(l => l.trim().startsWith('Agent:'));
    return lines.map(line => {
      const agentPart = line.match(/Agent: (.*?) -/);
      const actionPart = line.match(/\[Action: (.*?)\]/);
      const obsPart = line.match(/\[Observation: (.*?)\]/);
      return {
        agent: agentPart ? agentPart[1] : 'System Orchestrator',
        action: actionPart ? actionPart[1] : 'Processing',
        observation: obsPart ? obsPart[1] : 'Completed',
        timestamp: new Date().toLocaleTimeString()
      };
    });
  }

  async generateSmartInsight(inventory: InventoryItem[], context: UserContext): Promise<{ text: string, logs: AgentLog[] }> {
    // Simulate slight network delay for visual feel
    await new Promise(r => setTimeout(r, 800));
    
    const logs = this.parseLogs(`
Agent: Inventory Auditor - [Action: Cross-referencing current stock vs. Mandi benchmarks...] -> [Observation: Detected critical stock level for Sona Masuri Rice (4 units)].
Agent: Market Scout - [Action: Scanning Madri Industrial Area price bulletins...] -> [Observation: Current Udaipur market price is ₹54/kg, trending UP due to festive demand].
Agent: Risk Manager - [Action: Analyzing lead times for Rajasthan logistics...] -> [Observation: Logistics delay predicted in Sukher hub. Immediate reorder recommended].
    `);

    const text = `INVENTORY STATUS: CRITICAL (SONA MASURI RICE)
Current stock (4/15) will deplete in 32 hours based on Udaipur velocity.
MARKET PULSE: Price rally detected in Madri mandi (+4.2% daily).
RECOMMENDATION: Trigger bulk procurement via 'Negotiator' to lock in ₹52/kg price before midnight spike.`;

    return { text, logs };
  }

  async runVisualAudit(data: string, mimeType: string, context: UserContext): Promise<{ inventory: InventoryItem[], logs: AgentLog[] }> {
    await new Promise(r => setTimeout(r, 1200));

    const logs = this.parseLogs(`
Agent: Computer Vision - [Action: Segmenting multimodal image data...] -> [Observation: Identified 12 bags of Sunflower Oil and 4 remaining units of Rice].
Agent: Inventory Auditor - [Action: Validating visual counts against ledger...] -> [Observation: Visual match found. Inventory state synchronized].
    `);

    const inventory: InventoryItem[] = [
      { id: '1', item_name: 'Sona Masuri Rice', quantity: 4, target_quantity: 15, stock_status: 'Low Stock', category: 'Grain' },
      { id: '2', item_name: 'Premium Ghee (500ml)', quantity: 22, target_quantity: 10, stock_status: 'Overstock', category: 'Dairy' },
      { id: '3', item_name: 'Sunflower Oil 5L', quantity: 12, target_quantity: 12, stock_status: 'In Stock', category: 'Oil' },
      { id: '4', item_name: 'Atta 10kg Bag', quantity: 2, target_quantity: 8, stock_status: 'Low Stock', category: 'Flour' },
    ];

    return { inventory, logs };
  }

  async generateMarketingContent(itemNames: string[], context: UserContext): Promise<{ content: MarketingContent[], logs: AgentLog[] }> {
    await new Promise(r => setTimeout(r, 1000));

    const logs = this.parseLogs(`
Agent: Creative Strategist - [Action: Analyzing local Udaipur search trends...] -> [Observation: High engagement for 'Fresh Staples' in Hiran Magri sector].
Agent: Ad Generator - [Action: Drafting hyper-local captions...] -> [Observation: Campaign ready for WhatsApp and Instagram].
    `);

    const content: MarketingContent[] = [
      {
        id: '1',
        platform: 'WhatsApp',
        caption: 'Udaipur Special! 🏔️ Stock up on Fresh Sona Masuri Rice at lowest prices. Direct from Madri Mandi to your kitchen. Limited Stock!',
        hashtags: ['UdaipurFood', 'FreshGroceries'],
        callToAction: 'Order via WhatsApp Now',
        status: 'draft',
        metrics: { predictedReach: 1200, actualReach: 0, clicks: 0, conversions: 0 }
      },
      {
        id: '2',
        platform: 'Instagram',
        caption: 'The secret to the perfect Pulao? 🍚 Our Premium Sona Masuri Rice. Visit Lake City Traders today!',
        hashtags: ['LakeCity', 'HealthyEating'],
        callToAction: 'Visit Store',
        status: 'draft',
        metrics: { predictedReach: 3500, actualReach: 0, clicks: 0, conversions: 0 }
      }
    ];

    return { content, logs };
  }

  async negotiateSupply(itemNames: string[], context: UserContext): Promise<{ offers: SupplierOffer[], po: PODraft, logs: AgentLog[] }> {
    await new Promise(r => setTimeout(r, 1500));

    const logs = this.parseLogs(`
Agent: Procurement Negotiator - [Action: Querying Sukher logistics cluster...] -> [Observation: 3 suppliers identified with ready stock].
Agent: Finance Agent - [Action: Comparing bulk discount structures...] -> [Observation: Mewar Agro offers best 30-day credit term].
    `);

    const offers: SupplierOffer[] = [
      { supplier: 'Mewar Agro Wholesalers', price: '₹51.50/kg', deliveryTime: '4 hours', rating: '4.9/5', link: '#' },
      { supplier: 'Lake City Traders', price: '₹52.00/kg', deliveryTime: '2 hours', rating: '4.7/5', link: '#' },
      { supplier: 'Rajasthan Staples Corp', price: '₹53.20/kg', deliveryTime: '1 day', rating: '4.5/5', link: '#' }
    ];

    const po: PODraft = {
      to: 'Mewar Agro Wholesalers, Udaipur',
      subject: 'Urgent Procurement: Sona Masuri Rice (1000kg)',
      body: 'Dear Sir, following our agent negotiation, we wish to place a bulk order at ₹51.50/kg. Delivery expected at our Sukher warehouse by 6 PM today.',
      sources: [{ title: 'Current Mandi Price List - Rajasthan Agriculture', uri: 'https://example.com/mandi-prices' }]
    };

    return { offers, po, logs };
  }

  async predictDemand(context: UserContext): Promise<{ forecasts: Forecast[], logs: AgentLog[] }> {
    await new Promise(r => setTimeout(r, 1000));

    const logs = this.parseLogs(`
Agent: Predictive Analyst - [Action: Ingesting local news from Rajasthan Patrika...] -> [Observation: Upcoming local festival detected next Tuesday].
Agent: Supply Chain Modeler - [Action: Running 30-day demand simulation...] -> [Observation: 40% spike predicted for dairy and grains].
    `);

    const forecasts: Forecast[] = [
      {
        event: 'Mewar Festival Spike',
        impact: 'Heavy demand for Ghee, Sugar, and Rice expected in Udaipur city center.',
        recommendation: 'Increase Sona Masuri Rice inventory by 200% by Friday.',
        source: 'Regional Calendar Grounding',
        timeframe: 'Next 7 Days',
        sources: [{ title: 'Udaipur Cultural Calendar 2024', uri: '#' }]
      },
      {
        event: 'Logistics Bottleneck (Sukher Road)',
        impact: 'Planned road maintenance may delay deliveries by 6-12 hours.',
        recommendation: 'Schedule all incoming stock arrivals before 8:00 AM.',
        source: 'Local Infrastructure News',
        timeframe: 'Next 48 Hours',
        sources: [{ title: 'Udaipur Traffic Advisory', uri: '#' }]
      }
    ];

    return { forecasts, logs };
  }
}
