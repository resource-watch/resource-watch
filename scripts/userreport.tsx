import Script from 'next/script';

export default function UserReportScript() {
  return (
    <Script
      id="user-report"
      strategy="lazyOnload"
      dangerouslySetInnerHTML={{
        __html: `
            window._urq = window._urq || [];
            _urq.push(['setGACode', '${process.env.NEXT_PUBLIC_GOOGLE_TAG_MANAGER_CONTAINER_ID}']);
            _urq.push(['initSite', '085d5a65-977b-4c3d-af9f-d0a3624e276f']);
            (function() {
            var ur = document.createElement('script');
            ur.type = 'text/javascript';
            ur.async = true;
            ur.src = ('https:' == document.location.protocol ? 'https://cdn.userreport.com/userreport.js' : 'http://cdn.userreport.com/userreport.js');
            var s = document.getElementsByTagName('script')[0];
            s.parentNode.insertBefore(ur, s);
            })();
          `,
      }}
    />
  );
}
