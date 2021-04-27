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

// class ToolsShow extends PureComponent {
//   static propTypes = {
//     id: PropTypes.string.isRequired,
//     user: PropTypes.object.isRequired,
//   }

//   handleSubmit = () => Router.pushRoute('admin_tools', { tab: 'tools' });

//   render() {
//     const {
//       id,
//       user: { token },
//     } = this.props;

//     return (
//       <div className="c-tools-show">
//         <ToolsForm
//           id={id}
//           authorization={token}
//           onSubmit={this.handleSubmit}
//         />
//       </div>
//     );
//   }
// }

// export default ToolsShow;
