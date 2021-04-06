import React, { PureComponent } from 'react';
import { StickyContainer, Sticky } from 'react-sticky';
import PropTypes from 'prop-types';

// components
import Aside from 'components/ui/Aside';
import DatasetsForm from 'components/datasets/form/DatasetsForm';
import DatasetMetadataForm from 'components/datasets/metadata/form';
import TagsForm from 'components/admin/tags/TagsForm';
import WidgetsIndex from 'components/admin/data/widgets/pages/list';
import LayersIndex from 'components/admin/data/layers/pages/list';

class DatasetsShow extends PureComponent {
  static propTypes = {
    tabs: PropTypes.array.isRequired,
    query: PropTypes.object.isRequired,
    user: PropTypes.object.isRequired,
  }

  render() {
    const {
      user,
      tabs,
      query: { subtab, id },
    } = this.props;
    const currentSubtab = subtab || 'edit';

    return (
      <div className="c-datasets-show">
        <StickyContainer>
          <div className="row l-row">
            <div className="columns small-12 medium-3">
              <Sticky>
                {
                  ({ style }) => (
                    <div style={style}>
                      <Aside
                        items={tabs}
                        selected={currentSubtab}
                      />
                    </div>
                  )
                }
              </Sticky>
            </div>

            <div className="columns small-12 medium-9">
              {(currentSubtab === 'edit')
                && (
                <DatasetsForm
                  application={[process.env.NEXT_PUBLIC_APPLICATIONS]}
                  authorization={user.token}
                  dataset={id}
                  basic={false}
                />
                )}

              {(currentSubtab === 'metadata')
                && (<DatasetMetadataForm dataset={id} />)}

              {(currentSubtab === 'tags')
                && (
                <div>
                  <TagsForm
                    dataset={id}
                    user={user}
                  />
                </div>
                )}

              {(currentSubtab === 'widgets') && (<WidgetsIndex dataset={id} />)}
              {(currentSubtab === 'layers') && (<LayersIndex dataset={id} />)}
            </div>

          </div>
        </StickyContainer>
      </div>
    );
  }
}

export default DatasetsShow;
