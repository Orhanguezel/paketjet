// Google Consent Mode v2 + GTM + GA4. Varsayilan: analitik/pazarlama REDDEDILMIS; kullanici izin verince guncellenir.
// GTM/GA4 kimligi admin panelinden gelir; biri bossa o script basilmaz.
import type { AnalyticsConfig } from "@/lib/analytics-config";
import { CONSENT_KEY, CONSENT_VERSION } from "./consent";

export function AnalyticsHead({ gtmId, ga4Id }: AnalyticsConfig) {
  if (!gtmId && !ga4Id) return null;
  const defaults = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}window.gtag=gtag;
var c=null;try{c=JSON.parse(localStorage.getItem(${JSON.stringify(CONSENT_KEY)})||'null');if(!c||c.v!==${CONSENT_VERSION})c=null;}catch(e){}
var a=c&&c.analytics?'granted':'denied',m=c&&c.marketing?'granted':'denied';
gtag('consent','default',{analytics_storage:a,ad_storage:m,ad_user_data:m,ad_personalization:m,functionality_storage:'granted',security_storage:'granted',wait_for_update:500});
gtag('set','ads_data_redaction',true);gtag('set','url_passthrough',true);`;
  // Duz <script>: sunucu HTML'inin <head>'inde olmali (Search Console GA/GTM dogrulamasi ve Google'in onerisi).
  return (
    <>
      <script id="consent-default" dangerouslySetInnerHTML={{ __html: defaults }} />
      {/* eslint-disable-next-line @next/next/next-script-for-ga -- next/script HTML'e basmaz; GSC dogrulamasi head'de arar */}
      {gtmId && (
        <script id="gtm" dangerouslySetInnerHTML={{ __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer',${JSON.stringify(gtmId)});` }} />
      )}
      {ga4Id && (
        <>
          <script id="ga4-src" async src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga4Id)}`} />
          <script id="ga4-config" data-measurement-id={ga4Id} dangerouslySetInnerHTML={{ __html: `gtag('js',new Date());gtag('config',${JSON.stringify(ga4Id)});` }} />
        </>
      )}
    </>
  );
}

export function AnalyticsNoScript({ gtmId }: Pick<AnalyticsConfig, "gtmId">) {
  if (!gtmId) return null;
  return (
    <noscript>
      <iframe src={`https://www.googletagmanager.com/ns.html?id=${encodeURIComponent(gtmId)}`} height="0" width="0" style={{ display: "none", visibility: "hidden" }} title="Google Tag Manager" />
    </noscript>
  );
}
