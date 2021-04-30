import PropTypes from 'prop-types';
import { useRouter } from 'next/router';

// Components
import DatasetsForm from 'components/datasets/form/DatasetsForm';

function DatasetsNew(props) {
  const { user } = props;
  const router = useRouter();

  return (
    <div className="c-datasets-new">
      <DatasetsForm
        basic
        application={[process.env.NEXT_PUBLIC_APPLICATIONS]}
        authorization={user.token}
        onSubmit={() => router.push('/myrw/datasets/my_datasets')}
      />
    </div>
  );
}

DatasetsNew.propTypes = {
  // Store
  user: PropTypes.object.isRequired,
};

export default DatasetsNew;
