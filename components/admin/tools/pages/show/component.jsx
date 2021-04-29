import {
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';

// components
import ToolsForm from 'components/admin/tools/form/ToolsForm';

export default function ToolsShow({
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
    router.push('/admin/tools');
  }, [router]);

  return (
    <div className="c-tools-show">
      <ToolsForm
        id={id}
        authorization={user.token}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

ToolsShow.propTypes = {
  user: PropTypes.shape({
    token: PropTypes.string.isRequired,
  }).isRequired,
};
