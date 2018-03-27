import React from 'react';
import PropTypes from 'prop-types';

class CreditsModal extends React.Component {
  render() {
    return (
      <div className="credits-modal">
        <h2>Credits</h2>
        <div className="upper-container">
          <div className="row">
            <div className="column small-6">
              <div>
                <strong>Text:</strong> Maria Hart and Will Halicks
              </div>
              <div>
                <strong>Design:</strong> Daniel Caso
              </div>
              <div>
                <strong>Research:</strong> Rosie Gilroy
              </div>
            </div>
            <div className="column small-6">
              <div>
                <strong>Review:</strong> Katie Reytar and Kristian Teleki
              </div>
              <div>
                <strong>Data Preparation:</strong> Nathan Suberi
              </div>
              <div>
                <strong>Additional Design:</strong> [to come]
              </div>
            </div>
          </div>
        </div>
        <div className="main-container">
          <div className="row">
            <div className="column small-12">
              <p>
                360-degree images courtesy The Ocean Agency / XL Catlin Seaview Survey. Watch Chasing Coral, a documentary chronicling their epic underwater campaign to document the disappearance of coral reefs, <a href="https://www.netflix.com/title/80168188" target="_blank" rel="noopener noreferrer">streaming now</a>.
              </p>
              <p>
                <a href="https://www.flickr.com/photos/travels_with_tam/32828868944/in/photolist-S1YwZN-7pTeih-53CDnm-68xUDN-8a1GLP-5eMKt-68Hims-Wcgp3W-u5ckV-bHdAKH-buiNqL-bHdAx6-9SxRHy-aLyYd-audraQ-buiNoo-6dw6bM-dXb1Ym-tJTSh-7XFLEG-52FSAK-zNpnRD-4JBbui-68itCP-5Bt6SY-auaLx4-4JBbL2-dyF4sg-t27QF-dyF4Gz-oJDWwu-buiNyY-bHdACX-bHdAHB-4WVKT5-auaM1r-eSVvJY-7x2bwZ-dGMUxo-9DfWFh-auaLrg-aqUVBZ-7uhhfe-9Dd2Kt-9DfXyW-3fMBfE-9yUnYo-7qHs7q-9Dd3ug-HCSn8v" target="_blank" rel="noopener noreferrer">Humphead wrasse image</a> courtesy Tam Warner Minton and used here under a <a href="https://creativecommons.org/licenses/by/2.0/" target="_blank" rel="noopener noreferrer">CC BY 2.0 license</a>.
              </p>
              <p>
                Scuba audio courtesy HDVideoGuy/<a href="https://freesound.org/people/HDVideoGuy/sounds/156011/" target="_blank" rel="noopener noreferrer">freesound.org</a> and used here under a <a href="https://creativecommons.org/licenses/by-nc/3.0/" target="_blank" rel="noopener noreferrer">CC BY-NC 3.0 license</a>.
              </p>
              <div className="buttons">
                <button
                  className="c-button -primary"
                  onClick={() => this.props.onRequestClose(false)}
                >
                  Ok
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

CreditsModal.propTypes = {
  onRequestClose: PropTypes.func.isRequired
};

export default CreditsModal;
