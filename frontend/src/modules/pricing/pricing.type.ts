export interface PricingSetting<T> {
  id: string;
  key: string;
  locale: string;
  value: T;
}

export interface CreditPackage {
  key: string;
  credits: number;
  price: number;
}
