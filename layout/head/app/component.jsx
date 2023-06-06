import { useMemo } from 'react';
import PropTypes from 'prop-types';
import HeadNext from 'next/head';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

// constants
import { HOTJAR_ROUTES } from 'constants/app';

const CrazyEggScript = dynamic(() => import('../../../scripts/crazyegg'), { ssr: false });
const UserReportScript = dynamic(() => import('../../../scripts/userreport'), { ssr: false });
const HotjarScript = dynamic(() => import('../../../scripts/hotjar'), { ssr: false });
const GoogleTagManagerScript = dynamic(() => import('../../../scripts/google-tag-manager'), {
  ssr: false,
});

const isProduction = ['preproduction', 'production'].includes(process.env.NEXT_PUBLIC_API_ENV);

export default function HeadApp({ title, description, thumbnail }) {
  const { asPath } = useRouter();
  const isHotjarRoute = useMemo(
    () => HOTJAR_ROUTES.filter((route) => asPath.startsWith(route)).length > 0,
    [asPath],
  );
  const url =
    typeof window !== 'undefined' ? `${window.location.origin}${window.location.pathname}` : '';

  return (
    <>
      <HeadNext>
        <title>{title ? `${title} | Resource Watch` : 'Resource Watch'}</title>

        <meta property="og:url" content={url} />
        <meta name="description" content={description} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta name="og:image" content={thumbnail} />
        <meta property="og:image:secure_url" content={thumbnail} />
        <meta name="og:image:alt" content={`${title}_widget`} />
      </HeadNext>
      {isProduction && (
        <>
          <CrazyEggScript />
          {isHotjarRoute && <HotjarScript />}
        </>
      )}
      <GoogleTagManagerScript />
      <UserReportScript />
    </>
  );
}

HeadApp.defaultProps = {
  title: null,
  description: null,
  thumbnail: 'https://resourcewatch.org/static/images/social-big.jpg',
};

HeadApp.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  thumbnail: PropTypes.string,
};
