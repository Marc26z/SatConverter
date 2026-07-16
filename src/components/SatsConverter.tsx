import { useState, useCallback } from 'react';
import { useBitcoinPrice, usdToSats } from '@/hooks/useBitcoinPrice';
import { Bitcoin, RefreshCw, Zap, DollarSign, TrendingUp } from 'lucide-react';

function formatSats(sats: number): string {
  if (sats >= 1_000_000) {
    return sats.toLocaleString();
  }
  return sats.toLocaleString();
}

function formatBtc(sats: number): string {
  const btc = sats / 100_000_000;
  return btc.toFixed(8);
}

const QUICK_AMOUNTS = [1, 5, 10, 25, 50, 100];

export function SatsConverter() {
  const [inputValue, setInputValue] = useState('');
  const { data: price, isLoading, isError, refetch, isFetching, dataUpdatedAt } = useBitcoinPrice();

  const dollarAmount = parseFloat(inputValue) || 0;
  const satsAmount = price ? usdToSats(dollarAmount, price.USD) : 0;
  const hasResult = dollarAmount > 0 && price;

  const handleInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    // Allow digits and a single decimal point, max 2 decimal places
    if (val === '' || /^\d*\.?\d{0,2}$/.test(val)) {
      setInputValue(val);
    }
  }, []);

  const handleQuickAmount = useCallback((amount: number) => {
    setInputValue(String(amount));
  }, []);

  const lastUpdated = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleTimeString()
    : null;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col">
      {/* Header */}
      <header className="border-b border-red-900/40 bg-black/90 backdrop-blur sticky top-0 z-10">
        <div className="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-red-600 rounded-full p-1.5">
              <Bitcoin className="w-5 h-5 text-white" strokeWidth={2.5} />
            </div>
            <span className="font-bold text-lg tracking-tight text-white">
              Sats Converter
            </span>
          </div>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            title="Refresh price"
            className="flex items-center gap-1.5 text-sm text-red-400 hover:text-red-300 transition-colors disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded px-2 py-1"
            aria-label="Refresh Bitcoin price"
          >
            <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-10">
        <div className="w-full max-w-lg space-y-6">

          {/* Hero text */}
          <div className="text-center space-y-2">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              <span className="text-red-500">$</span> to{' '}
              <span className="text-red-500">⚡</span> Sats
            </h1>
            <p className="text-gray-400 text-sm sm:text-base">
              Instantly convert US dollars to Bitcoin satoshis
            </p>
            <ul className="text-gray-500 text-sm space-y-1 mt-2">
              <li>• Enter Your Cost In Dollars</li>
              <li>• The cost in sats will be converted below</li>
            </ul>
          </div>

          {/* BTC Price Banner */}
          <div className="flex items-center justify-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-red-500 flex-shrink-0" />
            {isLoading && (
              <span className="text-gray-500 animate-pulse">Fetching BTC price…</span>
            )}
            {isError && (
              <span className="text-red-400">Failed to load price. <button onClick={() => refetch()} className="underline">Retry</button></span>
            )}
            {price && (
              <span className="text-gray-300">
                1 BTC ={' '}
                <span className="text-white font-semibold">
                  ${price.USD.toLocaleString()}
                </span>
                {lastUpdated && (
                  <span className="text-gray-500 ml-2">· {lastUpdated}</span>
                )}
              </span>
            )}
          </div>

          {/* Input card */}
          <div className="bg-zinc-900 border border-red-900/50 rounded-2xl p-6 shadow-xl shadow-red-950/20">
            <label htmlFor="usd-input" className="block text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">
              Amount in US Dollars
            </label>
            <div className="relative flex items-center">
              <div className="absolute left-4 pointer-events-none">
                <DollarSign className="w-5 h-5 text-red-500" />
              </div>
              <input
                id="usd-input"
                type="number"
                inputMode="decimal"
                min="0"
                step="any"
                placeholder="0.00"
                value={inputValue}
                onChange={handleInput}
                className="w-full bg-black border border-zinc-700 focus:border-red-500 rounded-xl pl-11 pr-4 py-4 text-2xl font-bold text-white placeholder-zinc-600 outline-none transition-colors focus-visible:ring-2 focus-visible:ring-red-500/50"
                aria-label="Dollar amount"
                autoFocus
              />
            </div>

            {/* Quick amount buttons */}
            <div className="mt-4">
              <p className="text-xs text-gray-600 mb-2">Quick amounts</p>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                {QUICK_AMOUNTS.map((amount) => (
                  <button
                    key={amount}
                    onClick={() => handleQuickAmount(amount)}
                    className={`py-2 rounded-lg text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 ${
                      dollarAmount === amount
                        ? 'bg-red-600 text-white'
                        : 'bg-zinc-800 text-gray-300 hover:bg-zinc-700'
                    }`}
                  >
                    ${amount}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Result card */}
          <div
            className={`rounded-2xl p-6 border transition-all duration-300 ${
              hasResult
                ? 'bg-gradient-to-br from-red-950/60 to-zinc-900 border-red-700/60 shadow-xl shadow-red-950/30'
                : 'bg-zinc-900/50 border-zinc-800'
            }`}
            aria-live="polite"
          >
            {isLoading ? (
              <div className="text-center py-4 space-y-3">
                <div className="h-10 bg-zinc-800 rounded-xl animate-pulse w-2/3 mx-auto" />
                <div className="h-5 bg-zinc-800 rounded-lg animate-pulse w-1/2 mx-auto" />
              </div>
            ) : hasResult ? (
              <div className="text-center space-y-1">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <span className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                    Satoshis
                  </span>
                </div>
                <p className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                  {formatSats(satsAmount)}
                  <span className="text-red-500 text-2xl sm:text-3xl ml-2">sats</span>
                </p>
                <p className="text-gray-500 text-sm mt-2">
                  ≈ {formatBtc(satsAmount)} BTC
                </p>
                <div className="mt-4 pt-4 border-t border-zinc-800 flex flex-col sm:flex-row gap-2 justify-center text-xs text-gray-500">
                  <span>${dollarAmount.toFixed(2)} USD</span>
                  <span className="hidden sm:inline">·</span>
                  <span>@ ${price?.USD.toLocaleString()} / BTC</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <Zap className="w-8 h-8 text-zinc-700 mx-auto mb-2" />
                <p className="text-gray-600 text-sm">
                  Enter a dollar amount above to see the sats equivalent
                </p>
              </div>
            )}
          </div>

          {/* Info blurb */}
          <div className="text-center text-xs text-gray-600 space-y-1">
            <p>1 Bitcoin = 100,000,000 satoshis · Price from mempool.space</p>
            <p>Auto-refreshes every 30 seconds</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-4 px-4 text-center text-xs text-zinc-700">
        <a
          href="https://shakespeare.diy"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-red-600 transition-colors"
        >
          Vibed with Shakespeare
        </a>
      </footer>
    </div>
  );
}
