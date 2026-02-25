import Script from "next/script";
import { analyticsConfig } from "@/config/analytics";

export function Analytics() {
  return (
    <>
      {/* Google Analytics */}
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${analyticsConfig.googleAnalyticsId}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${analyticsConfig.googleAnalyticsId}');
          `,
        }}
      />

      {/* Buy Me a Coffee Widget */}
      <Script
        id="bmc-widget"
        strategy="lazyOnload"
        data-name="BMC-Widget"
        data-cfasync="false"
        src="https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js"
        data-id={analyticsConfig.buyMeCoffeeId}
        data-description="Support us on Buy me a coffee!"
        data-message="Love what we're building?"
        data-color="#5F7FFF"
        data-position="Right"
        data-x_margin="18"
        data-y_margin="18"
      />
    </>
  );
}

