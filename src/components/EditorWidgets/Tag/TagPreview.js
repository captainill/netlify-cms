import PropTypes from 'prop-types';
import React, { Component } from 'react';

export default class TagPreview extends Component {
  static propTypes = {
    value: PropTypes.node
  }
  render() {
    return h('ul', {},
      this.props.value.map(function(val, index) {
        return h('li', {key: index}, val);
      })
    );
  }
};
