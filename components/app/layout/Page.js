import React from 'react';
import User from 'components/user';

export default class extends React.Component {

  // Expose session to all pages
  static async getInitialProps(props) {
    const user = new User({ req: props.req });

    return {
      user: await user.getUser()
    };
  }

}
