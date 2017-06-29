import React from 'react';
import Session from 'components/session';

export default class extends React.Component {

  // Expose session to all pages
  static async getInitialProps(props) {
    const session = new Session({ req: props.req });

    return {
      session: await session.getSession()
    };
  }

}
