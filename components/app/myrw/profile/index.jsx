import { connect } from 'react-redux';
import { useQueryClient } from 'react-query';

// actions
import { setUser } from 'redactions/user';

// component
import Profile from './component';

function ProfileContainer(props) {
  const queryClient = useQueryClient();

  return (
    <Profile
      queryClient={queryClient}
      {...props}
    />
  );
}

export default connect(
  (state) => ({ user: state.user }),
  { setUser },
)(ProfileContainer);
