import {
  useCallback,
} from 'react';
import { useRouter } from 'next/router';
import PropTypes from 'prop-types';

// components
import PartnersForm from 'components/admin/partners/form/PartnersForm';

export default function PartnersShow({
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
    router.push('/admin/partners');
  }, [router]);

  return (
    <div className="c-partners-show">
      <PartnersForm
        id={id}
        token={user.token}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

PartnersShow.propTypes = {
  user: PropTypes.shape({
    token: PropTypes.string.isRequired,
  }).isRequired,
};
