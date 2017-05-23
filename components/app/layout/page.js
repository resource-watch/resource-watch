import React from 'react';
import withRedux from 'next-redux-wrapper';

const makeStore = initialState => {
  return createStore(reducer, initialState);
};

class Page extends React.Component {
  static getInitialProps({ store, isServer, pathname, query }) {
    store.dispatch({ type: 'FOO', payload: 'foo' }); // component will be able to read from store's state when rendered
    return { custom: 'custom' }; // you can pass some custom props to component from here
  }
  render() {
    return (
      <div>
        <div>Prop from Redux {this.props.foo}</div>
        <div>Prop from getInitialProps {this.props.custom}</div>
      </div>
    );
  }
}

Page = withRedux(makeStore, state => ({ foo: state.foo }))(Page);

export default Page;
