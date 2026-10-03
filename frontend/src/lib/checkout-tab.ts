// Shopier odeme sayfasi yeni sekmede acilir; bu sekme odeme sonuc sayfasinda durumu izler.
// Pencere TIKLAMA ANINDA (await'ten once) acilmali, yoksa mobil Safari/Chrome acilir pencereyi engeller.
const KEY = (ref: string) => `checkout:${ref}`;

export function openCheckoutTab() {
  let tab: Window | null = null;
  try {
    tab = window.open("about:blank", "_blank");
  } catch {
    tab = null;
  }
  return {
    /** Odeme sayfasina gider. Acilir pencere engellendiyse ayni sekmede yonlenir ve false doner. */
    go(url: string, ref: string) {
      try { sessionStorage.setItem(KEY(ref), url); } catch {}
      if (tab && !tab.closed) {
        tab.opener = null;
        tab.location.href = url;
        return true;
      }
      window.location.href = url;
      return false;
    },
    cancel() {
      if (tab && !tab.closed) tab.close();
    },
  };
}

export function storedCheckoutUrl(ref: string) {
  try {
    const url = sessionStorage.getItem(KEY(ref));
    return url && /^https:\/\/(www\.)?shopier\.com\//.test(url) ? url : null;
  } catch {
    return null;
  }
}
