import { useEffect } from 'react';
import { useRouter } from 'next/router';
// ! react-progress-2 is deprecated and unmaintained. Look for a replacement.
import Progress from 'react-progress-2';

const ProgressBar = () => {
  const router = useRouter();

  useEffect(() => {
    const showProgressBar = () => {
      if (Progress?.Component?.instance) {
        Progress.show();
      }
    };

    const hideProgressBar = () => {
      if (Progress?.Component?.instance) {
        Progress.hideAll();
      }
    };

    router.events.on('routeChangeStart', showProgressBar);
    router.events.on('routeChangeComplete', hideProgressBar);

    return () => {
      router.events.off('routeChangeStart', showProgressBar);
      router.events.off('routeChangeComplete', hideProgressBar);
    };
  }, [router]);

  return <Progress.Component />;
};

export default ProgressBar;
