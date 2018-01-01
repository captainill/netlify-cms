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
    this.didInitialSearch = false;
  }

  componentDidMount() {
    const { value, field } = this.props;

    const collection = field.get('collection');
    const searchFields = field.get('searchFields').toJS();
    this.props.queryEntireCollection(this.controlID, collection, searchFields, value);

    console.log('jt-- componentDidMount func, collection:', collection);
    console.log('jt-- componentDidMount func, searchFields:', searchFields);
  }

  componentWillReceiveProps(nextProps) {
    if (this.didInitialSearch) return;
    if (nextProps.queryHits !== this.props.queryHits && nextProps.queryHits.get && nextProps.queryHits.get(this.controlID)) {
      this.didInitialSearch = true;
      const suggestion = nextProps.queryHits.get(this.controlID);
      console.log('jt-- componentWillReceiveProps func, suggestion:', suggestion);
      // if (suggestion) {
      //   const val = this.getSuggestionValue(suggestion[0]);
      //   this.props.onChange(val, { [nextProps.field.get('collection')]: { [val]: suggestion[0].data } });
      // }
    }
  }

  // handleChange = (e) => {
  //   const { onChange } = this.props;
  //   const oldValue = this.state.value;
  //   const newValue = e.target.value;
  //   const listValue = e.target.value.split(',');
  //   if (newValue.match(/,$/) && oldValue.match(/, $/)) {
  //     listValue.pop();
  //   }
  //
  //   const parsedValue = valueToString(listValue);
  //   this.setState({ value: parsedValue });
  //   onChange(listValue.map(val => val.trim()));
  // };

  handleDelete = (index) => {
    //const { itemsCollapsed } = this.state;
    const { value, metadata, onChange, forID } = this.props;
    const parsedMetadata = metadata && { [forID]: metadata.removeIn(value.get(index).valueSeq()) };

    console.log('jt-- handleDelete func, index:', index);
    console.log('jt-- handleDelete func, value:', value);
  //  this.setState({ itemsCollapsed: itemsCollapsed.delete(index) });

    onChange(value.remove(index), parsedMetadata);
  }

  handleAddition = (tag) => {
    console.log('handleAddition this', this );
    const { value, onChange } = this.props;
    console.log('jt-- handleAddition func, tag to add:', tag);
    console.log('jt-- handleAddition func, value:', value);
    //this.setState({ itemsCollapsed: this.state.itemsCollapsed.push(false) });
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

    // const inputProps = {
    //   placeholder: '',
    //   value: value || '',
    //   onChange: this.onChange,
    //   id: forID,
    //   className: classNameWrapper,
    //   onFocus: setActiveStyle,
    //   onBlur: setInactiveStyle,
    // };

    const tags = value || List();
    //const tags = value;
    const suggestions = (queryHits.get) ? queryHits.get(this.controlID, []) : [];

    console.log('jt-- render func, queryHits.get:', queryHits.get, queryHits.get(this.controlID, []));
    console.log('jt-- render func, tag:', tags.toJS(), tags.toJS() instanceof Array, tags.toArray());
    console.log('jt-- render func, suggestions:', suggestions);

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
  console.log('--jt TagControl.js, mapStateToProps func, state', state);
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
