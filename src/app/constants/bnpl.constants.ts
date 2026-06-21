export const BNPL_RULES = {
  CASHBACK: {
    // For simplicity let's assume that we give a person 2% for each additional month of bnpl.
    PERCENT_FOR_MONTH: 0.02,
  }
} as const;
