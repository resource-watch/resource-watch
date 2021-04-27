import {
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';

// components
import FaqsForm from 'components/admin/faqs/form/FaqsForm';

export default function FaqsShow({
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
    router.push('/admin/faqs');
  }, [router]);

  return (
    <div className="c-faqs-show">
      <FaqsForm
        id={id}
        authorization={user.token}
        onSubmit={handleSubmit}
      />
    </div>
  );
}

FaqsShow.propTypes = {
  user: PropTypes.shape({
    token: PropTypes.string.isRequired,
  }).isRequired,
};

// class FaqsShow extends PureComponent {
//   static propTypes = {
//     id: PropTypes.string.isRequired,
//     user: PropTypes.object.isRequired,
//   }

//   handleSubmit = () => { Router.pushRoute('admin_faqs', { tab: 'faqs' }); }

//   render() {
//     const {
//       id,
//       user: { token },
//     } = this.props;

//     return (
//       <div className="c-faqs-show">
//         <FaqsForm
//           id={id}
//           authorization={token}
//           onSubmit={this.handleSubmit}
//         />
//       </div>
//     );
//   }
// }

// export default FaqsShow;
