import Script from 'next/script';

export default function CrazyEggScript() {
  return (
    <Script
      type="text/javascript"
      strategy="lazyOnload"
      src="//script.crazyegg.com/pages/scripts/0069/4623.js"
    />
  );
}
