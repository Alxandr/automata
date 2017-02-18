import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';

class Versions extends Component {
  constructor(props, context) {
    super(props, context);

    this.dispatch = props.dispatch;
  }

  componentWillMount() {
    this.dispatch({
      type: 'FETCH_FACTORIO_VERSIONS'
    });
  }

  render() {
    return (<h1>Versions</h1>);
  }
}

Versions.propTypes = {
  dispatch: PropTypes.func.isRequired
};

export default connect()(Versions);
