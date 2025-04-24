export const GA_ID = process.env.NEXT_PUBLIC_GA_ID!;

declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

export {};

export const pageview = (url: string) => {
  window.gtag("config", GA_ID, { page_path: url });
};
