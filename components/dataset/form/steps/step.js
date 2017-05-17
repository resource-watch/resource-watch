import React from 'react';

import { PROVIDER_DICTIONARY } from '../constants';

class Step extends React.Component {
  constructor(props) {
    super(props);
    this.providerDictionary = PROVIDER_DICTIONARY;
  }
}

Step.propTypes = {
};

export default Step;
