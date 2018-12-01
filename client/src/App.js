import React, { Component } from 'react';
import axios from 'axios';
import { sortBy } from 'lodash';
import classNames from 'classnames';
import './App.css';

import { Link } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const SORTS = {
  NONE: list => list,
  TITLE: list => sortBy(list, 'title'),
  AUTHOR: list => sortBy(list, 'author'),
  COMMENTS: list => sortBy(list, 'num_comments').reverse(),
  POINTS: list => sortBy(list, 'points').reverse(),
};

const updateSearchTopStoriesState = (hits, page) => (prevState) => {
  const { searchKey, results } = prevState;

  const oldHits = results && results[searchKey]
    ? results[searchKey].hits
    : [];

  const updatedHits = [
    ...oldHits,
    ...hits
  ];

  return {
    results: {
      ...results,
      [searchKey]: { hits: updatedHits, page }
    },
    isLoading: false
  };
};

class App extends Component {
  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      results: null,
      searchKey: '',
      searchTerm: "",
      error: null,
      isLoading: false,
      sortKey: 'NONE',
      isSortReverse: false,
      threshold: -0.75,
      enableSA: false
    };
  }

  needsToSearchTopStories = searchTerm => {
    return !this.state.results[searchTerm];
  }

  setSearchTopStories = result => {
    const { hits, page } = result;
    this.setState(updateSearchTopStoriesState(hits, page));
  }

  fetchSearchTopStories = (searchTerm, page = 0) => {
    this.setState({ isLoading: true });

    axios.post(`/api/search`, {
      searchTerm: searchTerm,
      page: page
    })
      .then(result => this.setSearchTopStories(result.data))
      .catch(error => this._isMounted && this.setState({ error }));
  }

  componentDidMount = () => {
    this._isMounted = true;

    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });
    this.fetchSearchTopStories(searchTerm);
  }

  componentWillUnmount = () => {
    this._isMounted = false;
  }

  onSearchChange = event => {
    this.setState({ searchTerm: event.target.value });
  }

  onThresholdChange = event => {
    this.setState({ threshold: event.target.value });
  }

  onButtonClick = () => {
    this.setState(prevState => ({
      enableSA: !prevState.enableSA
    }));
  }

  onSearchSubmit = event => {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm });

    if (this.needsToSearchTopStories(searchTerm)) {
      this.fetchSearchTopStories(searchTerm);
    }

    event.preventDefault();
  }

  onDismiss = id => {
    const { searchKey, results } = this.state;
    const { hits, page } = results[searchKey];

    const isNotId = item => item.objectID !== id;
    const updatedHits = hits.filter(isNotId);

    this.setState({
      results: {
        ...results,
        [searchKey]: { hits: updatedHits, page }
      }
    });
  }

  render() {
    const {
      searchTerm,
      results,
      searchKey,
      error,
      isLoading,
      threshold,
      enableSA
    } = this.state;

    const page = (
      results &&
      results[searchKey] &&
      results[searchKey].page
    ) || 0;

    const list = (
      results &&
      results[searchKey] &&
      results[searchKey].hits
    ) || [];

    return (
      <center>
        <div className="page">
          <div className="interactions">
            <div className="container">
              <div className="row">
                <div className="col" style={{ textAlign: 'left' }}>
                  <h4 style={{ display: 'inline-block' }}>HN Clean</h4>
                  <span style={{ marginLeft: '1em', display: 'inline-block', fontWeight: '500' }}>>
                    <a href="https://github.com/RootofalleviI/HN-Clean" style={{ color: 'black' }} target='_blank'> Source</a>
                  </span>
                  <span style={{ marginLeft: '1em', display: 'inline-block', fontWeight: '500' }}>>
                    <a href="https://david-duan.me" style={{ color: 'black' }} target='_blank'> About</a>
                  </span>

                </div>
                <div className="col" style={{ verticalAlign: 'bottom' }}>
                  <Threshold
                    button_onClick={this.onButtonClick}
                    button_children={enableSA ? "Disable SA" : "Enable SA"}
                    threshold_value={threshold}
                    threshold_onChange={this.onThresholdChange}
                  />
                </div>
                <div className="col" style={{ verticalAlign: 'bottom' }}>
                  <Search
                    value={searchTerm}
                    onChange={this.onSearchChange}
                    onSubmit={this.onSearchSubmit}
                  >
                    Search
                </Search>
                </div>
              </div>
            </div>
            <hr />
          </div>
          {error
            ? <div className="interactions">
              <p>Something went wrong.</p>
            </div>
            : <Table
              list={list}
              onDismiss={this.onDismiss}
              threshold={this.state.threshold}
              enableSA={this.state.enableSA}
            />
          }
          <div className="interactions">
            <ButtonWithLoading
              isLoading={isLoading}
              onClick={() => this.fetchSearchTopStories(searchKey, page + 1)}>
              More
          </ButtonWithLoading>
          </div>
        </div>
      </center>
    );
  }
}

const Search = ({
  value,
  onChange,
  onSubmit,
  children
}) =>
  <form onSubmit={onSubmit}>
    <input
      type="text"
      value={value}
      onChange={onChange}
    />&nbsp;
    <button type="submit">
      {children}
    </button>
  </form>

const Threshold = ({
  button_onClick,
  button_children,
  threshold_value,
  threshold_onChange
}) => {
  let inputBox = (button_children === "Disable SA")
    ? <span>
      Set SA Threshold: &nbsp;
    <input
        size='1'
        type="text"
        value={threshold_value}
        onChange={threshold_onChange}
      />
    </span>
    : null
  return (
    <span style={{ verticalAlign: 'middle' }}>
      <Button
        onClick={button_onClick}
        className="threshold-button"
        children={button_children}
        style={{ color: 'black' }}
      /> &nbsp;
      {inputBox}
    </span>
  );
}

class Table extends Component {
  constructor(props) {
    super(props);

    this.state = {
      sortKey: 'NONE',
      isSortReverse: false,
    };

    this.onSort = this.onSort.bind(this);
  }

  onSort(sortKey) {
    const isSortReverse = this.state.sortKey === sortKey && !this.state.isSortReverse;
    this.setState({ sortKey, isSortReverse });
  }

  render() {
    const {
      list,
      onDismiss
    } = this.props;

    const {
      sortKey,
      isSortReverse,
    } = this.state;

    const sortedList = SORTS[sortKey](list);
    const reverseSortedList = isSortReverse
      ? sortedList.reverse()
      : sortedList;

    return (
      <div className="table">
        <div className="table-header">
          <span style={{ width: '55%' }}>
            <Sort
              sortKey={'TITLE'}
              onSort={this.onSort}
              activeSortKey={sortKey}
            >
              Title
            </Sort>
          </span>
          <span style={{ width: '15%' }}>
            <Sort
              sortKey={'AUTHOR'}
              onSort={this.onSort}
              activeSortKey={sortKey}
            >
              Author
            </Sort>
          </span>
          <span style={{ width: '10%' }}>
            <Sort
              sortKey={'COMMENTS'}
              onSort={this.onSort}
              activeSortKey={sortKey}
            >
              Comments
            </Sort>
          </span>
          <span style={{ width: '10%' }}>
            <Sort
              sortKey={'POINTS'}
              onSort={this.onSort}
              activeSortKey={sortKey}
            >
              Points
            </Sort>
          </span>
          <span style={{ width: '10%' }}>
            Archive
          </span>
        </div>
        {reverseSortedList.map(item =>
          <div key={item.objectID} className="table-row">
            <span style={{ width: '55%' }}>
              <a href={item.url}>{item.title}</a>
            </span>
            <span style={{ width: '15%' }}>
              {item.author}
            </span>
            <span style={{ width: '10%' }}>
              <Link
                to={`/comments/${item.objectID}&&${item.author}&&${item.points}&&${this.props.enableSA}&&${this.props.threshold}`}
                target='_blank'
              >
                {item.num_comments}
              </Link>
            </span>
            <span style={{ width: '10%' }}>
              {item.points}
            </span>
            <span style={{ width: '10%' }}>
              <Button
                onClick={() => onDismiss(item.objectID)}
                className="button-inline"
              >
                Dismiss
              </Button>
            </span>
          </div>
        )}
      </div>
    );
  }
}

const Sort = ({
  sortKey,
  activeSortKey,
  onSort,
  children
}) => {
  const sortClass = classNames(
    'button-inline',
    { 'button-active': sortKey === activeSortKey }
  );

  return (
    <Button
      onClick={() => onSort(sortKey)}
      className={sortClass}
    >
      {children}
    </Button>
  );
}

const Button = ({
  onClick,
  className = '',
  children,
}) =>
  <button
    onClick={onClick}
    className={className}
    type="button"
  >
    {children}
  </button>

const Loading = () =>
  <div>Loading ...</div>

const withLoading = (Component) => ({ isLoading, ...rest }) =>
  isLoading
    ? <Loading />
    : <Component {...rest} />

const ButtonWithLoading = withLoading(Button);

export {
  Button,
  Search,
  Table,
};

export default App;