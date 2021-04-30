import {
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';

// components
import PagesForm from 'components/admin/pages/form/PagesForm';

export default function PagesShow({
  user,
}) {
  const router = useRouter();
  const {
    query: {
      params,
    },
  } = router;

  const id = params?.[1] || null;

  const handleSubmit = useCallback(() => {
    router.push('/admin/pages');
  }, [router]);

  return (
    <div className="c-pages-show">
      <PagesForm
        id={id}
        authorization={user.token}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

PagesShow.propTypes = {
  user: PropTypes.shape({
    token: PropTypes.string.isRequired,
  }).isRequired,
};
