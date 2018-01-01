import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ReactTags from 'react-tag-autocomplete';
import uuid from 'uuid/v4';
import ImmutablePropTypes from 'react-immutable-proptypes';
import Immutable, { List, Map } from 'immutable';
import { connect } from 'react-redux';
import { partial, debounce } from 'lodash';
import { queryEntireCollection, clearSearch } from 'Actions/search';
import { Loader } from 'UI';
import c from 'classnames';

class TagControl extends Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    field: PropTypes.object,
    forID: PropTypes.string,
    isFetching: PropTypes.node,
    query: PropTypes.func.isRequired,
    queryHits: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.object,
    ]),
    classNameWrapper: PropTypes.string.isRequired,
    setActiveStyle: PropTypes.func.isRequired,
    setInactiveStyle: PropTypes.func.isRequired
  }

  constructor(props, ctx) {
    super(props, ctx);
    const { value } = props;

    this.controlID = uuid();
  }

  componentDidMount() {
    const { value, field } = this.props;

    const collection = field.get('collection');
    const searchFields = field.get('searchFields').toJS();
    this.props.queryEntireCollection(this.controlID, collection, searchFields, value);
  }

  handleDelete = (index) => {
    const { value, metadata, onChange, forID } = this.props;
    const parsedMetadata = metadata && { [forID]: metadata.removeIn(value.get(index).valueSeq()) };

    onChange(value.remove(index), parsedMetadata);
  }

  handleAddition = (tag) => {
    const { value, onChange } = this.props;
    onChange((value || List()).push(tag));
  }

  render(){
    const {
      value,
      isFetching,
      forID,
      queryHits,
      classNameWrapper,
      setActiveStyle,
      setInactiveStyle
    } = this.props;

    const tags = value || List();
    const suggestions = (queryHits.get) ? queryHits.get(this.controlID, []) : [];

    return (
      <div>
        <ReactTags
          tags={tags.toJS()}
          suggestions={suggestions}
          handleDelete={this.handleDelete}
          handleAddition={this.handleAddition} />

        <Loader active={isFetching === this.controlID} />
      </div>
    );
  }

};

function mapStateToProps(state, ownProps) {
  const { className } = ownProps;
  const isFetching = state.search.get('isFetching');
  const queryHits = state.search.get('queryHits');
  return { isFetching, queryHits, className };
}

export default connect(
  mapStateToProps,
  {
    queryEntireCollection,
    clearSearch,
  },
  null,
  {
    withRef: true,
  }
)(TagControl);
