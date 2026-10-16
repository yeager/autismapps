/** Coins and bills per locale for the Money Check app. Pure module. */

export interface MoneyItem { value: number; label: string; emoji: string; color: string }

export interface Currency {
  coins: MoneyItem[];
  bills: MoneyItem[];
  /** Unit word next to the total; null = use the i18n key money.kr (Swedish/English behaviour) */
  unit: (amount: number) => string | null;
  /** Spoken amount; null = use the legacy "<n> <money.kr>" phrasing */
  spoken: (amount: number) => string | null;
}

const KRONOR: Currency = {
  coins: [
    { value: 1, label: '1 kr', emoji: '🪙', color: '#C0C0C0' },
    { value: 2, label: '2 kr', emoji: '🪙', color: '#C0C0C0' },
    { value: 5, label: '5 kr', emoji: '🪙', color: '#C0C0C0' },
    { value: 10, label: '10 kr', emoji: '🪙', color: '#FFD700' },
  ],
  bills: [
    { value: 20, label: '20 kr', emoji: '💵', color: '#9B59B6' },
    { value: 50, label: '50 kr', emoji: '💵', color: '#E67E22' },
    { value: 100, label: '100 kr', emoji: '💵', color: '#3498DB' },
    { value: 200, label: '200 kr', emoji: '💵', color: '#27AE60' },
    { value: 500, label: '500 kr', emoji: '💵', color: '#E74C3C' },
  ],
  unit: () => null,
  spoken: () => null,
};

// Brazilian real — whole reais only (the app sums integers; centavos would add decimals). Colours follow the real banknotes.
const REAIS: Currency = {
  coins: [{ value: 1, label: 'R$ 1', emoji: '🪙', color: '#D4AF37' }],
  bills: [
    { value: 2, label: 'R$ 2', emoji: '💵', color: '#3B6FB6' },
    { value: 5, label: 'R$ 5', emoji: '💵', color: '#8E5BA8' },
    { value: 10, label: 'R$ 10', emoji: '💵', color: '#C0392B' },
    { value: 20, label: 'R$ 20', emoji: '💵', color: '#E6A817' },
    { value: 50, label: 'R$ 50', emoji: '💵', color: '#B5651D' },
    { value: 100, label: 'R$ 100', emoji: '💵', color: '#2E86C1' },
    { value: 200, label: 'R$ 200', emoji: '💵', color: '#7F8C8D' },
  ],
  unit: (n) => (n === 1 ? 'real' : 'reais'),
  spoken: (n) => `${n} ${n === 1 ? 'real' : 'reais'}`,
};

export function currencyFor(code: string): Currency {
  return code === 'pt_BR' ? REAIS : KRONOR;
}
