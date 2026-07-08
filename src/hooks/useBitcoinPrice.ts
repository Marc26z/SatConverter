import { useQuery } from '@tanstack/react-query';

interface MempoolPrice {
  USD: number;
  EUR: number;
  GBP: number;
  CAD: number;
  CHF: number;
  AUD: number;
  JPY: number;
}

export function useBitcoinPrice() {
  return useQuery<MempoolPrice>({
    queryKey: ['bitcoin-price'],
    queryFn: async (c) => {
      const res = await fetch('https://mempool.space/api/v1/prices', { signal: c.signal });
      if (!res.ok) throw new Error('Failed to fetch Bitcoin price');
      return res.json() as Promise<MempoolPrice>;
    },
    refetchInterval: 30_000, // refresh every 30 seconds
    staleTime: 15_000,
  });
}

/** Convert a USD amount to satoshis given a BTC/USD price */
export function usdToSats(usd: number, btcPriceUsd: number): number {
  if (!btcPriceUsd || btcPriceUsd <= 0) return 0;
  // 1 BTC = 100,000,000 sats
  return Math.round((usd / btcPriceUsd) * 100_000_000);
}
