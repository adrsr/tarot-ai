import type { Bid } from './bid';

export type ScoringResult = Readonly<{
  defenseScore: number;
  takerScore: number;
  takerPartnerScore?: number;
  contractBid: Bid;
  oudlerCount: number;
  contractThreshold: number;
  contractPoints: number;
  contractDifference: number;
  baseFormula: string;
  defenseFormula: string;
  takerFormula: string;
  takerPartnerFormula?: string;
  baseScore: number;
}>;
