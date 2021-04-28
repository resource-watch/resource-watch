import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { StickyContainer, Sticky } from 'react-sticky';

// Redux
import { connect } from 'react-redux';

// Components
import CollectionListAside from 'components/collection-list-aside';
import MyRWDatasetsMy from 'components/app/myrw/datasets/pages/my-rw-datasets';

// Constants
const DATASET_SUBTABS = [{
  label: 'My datasets',
  value: 'my_datasets',
  route: '/myrw/datasets/my_datasets',
  params: { tab: 'datasets', subtab: 'my_datasets' },
}, {
  label: 'Favorites',
  value: 'favourites',
  route: '/myrw/datasets/favorites',
  params: { tab: 'datasets', subtab: 'favorites' },
}];

class DatasetIndex extends PureComponent {
  static defaultProps = {
    subtab: 'my_datasets',
  };

  static propTypes = {
    subtab: PropTypes.string,
  };

  render() {
    const { subtab } = this.props;
    return (
      <div className="c-datasets-index">
        <StickyContainer>
          <div className="row l-row">
            <div className="columns small-12 medium-3">
              <Sticky>
                {
                  ({ style }) => (
                    <div style={style}>
                      <CollectionListAside
                        additionalTabs={DATASET_SUBTABS}
                        selected={subtab}
                      />
                    </div>
                  )
                }
              </Sticky>
            </div>

            <div className="columns small-12 medium-9">
              <MyRWDatasetsMy />
            </div>

          </div>
        </StickyContainer>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps, null)(DatasetIndex);
