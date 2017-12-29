import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { List, Map } from 'immutable';
import { partial } from 'lodash';
import c from 'classnames';

export default class TagControl extends Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    value: PropTypes.node
  }

  handleChange = (e) => {
    this.props.onChange(e.target.value.split(',').map((e) => e.trim()));
  }

  render() {
    var value = this.props.value;
    return h('input', { type: 'text', value: value ? value.join(', ') : '', onChange: this.handleChange });
  }
};
