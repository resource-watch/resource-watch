import PropTypes from 'prop-types';
import Link from 'next/link';

// Components
import Title from 'components/ui/Title';

function DashboardsListCard({ dashboard = {}, onDelete = null }) {
  return (
    <div className="c-card">
      <div className="card-container">
        <header className="card-header">
          <Link href={`/myrw-detail/dashboards/${dashboard.id}`}>
            <a>
              <Title className="-default">
                {dashboard.name}
              </Title>
            </a>
          </Link>
        </header>

        <div className="card-content">
          <div className="card-actions">
            <Link href={`/dashboards/${dashboard.id}`}>
              <a
                className="c-button -tertiary -compressed"
                target="_blank"
              >
                Preview
              </a>
            </Link>

            <button
              className="c-button -tertiary -compressed"
              onClick={() => onDelete(dashboard)}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

DashboardsListCard.propTypes = {
  dashboard: PropTypes.object,
  onDelete: PropTypes.func,
};

export default DashboardsListCard;
