import React from 'react';
import PropTypes from 'prop-types';
import { toastr } from 'react-redux-toastr';

// redux
import { connect } from 'react-redux';

// redactions
import { setTmpSources, setSources } from 'redactions/admin/sources';

// components
import ContentGroup from 'components/ui/ContentGroup';
import Source from 'components/admin/metadata/form/Source';
import { SOURCE_ELEMENTS } from 'components/admin/metadata/form/constants';

class SourcesContentModal extends React.Component {

  componentWillMount() {
    const { sources, setTmpSources } = this.props;
    setTmpSources(sources);
  }

  onSubmitForm = (event) => {
    const { onSubmit, tmpSources, setSources } = this.props;
    event.preventDefault();

    // Validate the form
    SOURCE_ELEMENTS.validate();

    // Set a timeout due to the setState function of react
    setTimeout(() => {
      const valid = SOURCE_ELEMENTS.isValid();
      if (valid) {
        onSubmit();
        setSources(tmpSources);
      } else {
        toastr.error('Error', 'Fill all the required fields or correct the invalid values');
      }
    }, 0);
  }

  render() {
    const { onSubmit, onClose, tmpSources, setTmpSources } = this.props;

    return (
      <div className="source-content-modal">
        <h1 className="c-title -extrabig -secondary">Sources</h1>

        <form onSubmit={this.onSubmitForm}>
          <ContentGroup
            content={tmpSources}
            component={Source}
            onAddComponent={() => setTmpSources([...tmpSources, {}])}
          />
          <div className="c-button-container -j-center">
            <ul>
              <li>
                <button
                  className="c-button -primary"
                  disabled={!tmpSources.length}
                >
                  Submit
                </button>
              </li>
              <li>
                <button
                  type="button"
                  className="c-button -secondary"
                  onClick={() => onClose()}
                >
                  Cancel
                </button>
              </li>
            </ul>
          </div>
        </form>
      </div>
    );
  }
}

SourcesContentModal.propTypes = {
  sources: PropTypes.array,
  onSubmit: PropTypes.func.isRequired
};

SourcesContentModal.defaultProps = {
  sources: [],
  tmpSources: []
};

const mapStateToProps = ({ sources }) => ({
  sources: sources.sources,
  tmpSources: sources.tmpSources
});

const mapDispatchToProps = dispatch => ({
  setSources: sources => dispatch(setSources(sources)),
  setTmpSources: sources => dispatch(setTmpSources(sources))
});

export default connect(mapStateToProps, mapDispatchToProps)(SourcesContentModal);

