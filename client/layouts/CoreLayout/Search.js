import React, { PropTypes } from 'react';
import { connect } from 'react-redux';

import {fetchSearchData} from 'actions/core';
import FontIcon from 'material-ui/FontIcon';
import { Link } from 'react-router';

import AssetWidget from 'components/widgets/AssetWidget';
import Loader from 'components/Loader';

import {Colors} from '../../../commons/colors';

import { debounce } from 'utils/utils';

const styles = {
  wrap: {
    position: 'absolute',
    zIndex: 2,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(200, 200, 200, 0.8)',
    top: 0,
    bottom: 0
  },
  searchWrap: {
    display: 'flex',
    backgroundColor: Colors.pebble
  },
  textField: {
    margin: 0,
    border: '1px solid'
  },
  search: {
    display: 'block',
    backgroundColor: 'transparent',
    border: 0,
    outline: 0,
    width: '100%',
    color: Colors.arctic
  },
  icon: {
    color: Colors.navigation,
    display: 'block',
    height: '72px',
    lineHeight: '72px',
    margin: '0 30px',
    textAlign: 'center',
    cursor: 'pointer'
  },
  results: {
    position: 'absolute',
    backgroundColor: Colors.arctic,
    margin: '30px 50px',
    padding: '30px',
    overflowY: 'auto',
    right: 0,
    left: 0,
    bottom: 0,
    top: '70px'
  },
  error: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    textAlign: 'center',
    padding: '30px'
  },
  link: {
    textDecoration: 'none'
  }
};

export class Search extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      showLoader: false,
      isError: false,
      errorMessage: ''
    };

    this.prevQuery = '';
  }

  static propTypes = {
    auth: PropTypes.object.isRequired,
    toggleSearch: PropTypes.func.isRequired
  }

  clear = () => {
    const value = this.refs.searchInput.value;
    if (value === '') {
      this.props.toggleSearch();
    }
    else {
      this.refs.searchInput.value = '';
      this.setState({data: []});
    }
  }

  search = (evt) => {
    const {refs, props, prevQuery} = this;
    let query = refs.searchInput.value;

    if (query.length < 2 || prevQuery === query) return;

    this.prevQuery = query;

    this.setState({showLoader: true, isError: false});
    debounce(fetchSearchData(props.auth, query)
      .then(res => {
        if (res.ok) {
          return res.json();
        }
        else {
          throw new Error({message: 'Error in search'});
        }
      })
      .then(json => {
        this.setState({showLoader: false, isError: false});
        this.setState({data: json.rows});
      })
      .catch(ex => {
        this.setState({showLoader: false});
        this.setState({isError: true, errorMessage: 'Error in search'});
      }), 200);
  }

  getAssetUrl(item) {
    const {id, type} = item[0];
    return `/asset/${type}/${id}`;
  }

  getResults() {
    const {state} = this;
    return state.data.map((item, index) => {
      let to = this.getAssetUrl(item);

      return (
        <Link to={to} style={styles.link} key={`asset${index}`}>
          <AssetWidget
            data={item[0]} />
        </Link>
      );
    });
  }

  getErrorMessage() {
    return (
      <div style={styles.error}>
        {this.state.errorMessage}
      </div>
    );
  }

  componentDidMount() {
    this.refs.searchInput.focus();
    document.body.style.overflow = 'hidden';
  }

  componentWillUnmount() {
    document.body.style.overflow = '';
  }

  render() {
    const {props, state} = this;
    return (
      <div style={{...styles.wrap, ...props.style}} className={props.className}>
        <div style={styles.searchWrap}>
          <FontIcon style={styles.icon} className='material-icons' onClick={props.toggleSearch}>
            arrow_back
          </FontIcon>

          <input ref='searchInput'
            placeholder='Search Assets'
            style={styles.search}
            onKeyUp={this.search} />

          <FontIcon style={styles.icon} className='material-icons' onClick={this.clear}>clear</FontIcon>
        </div>
        <div style={styles.results}>
          {state.showLoader ? <Loader /> : null}
          {state.isError ? this.getErrorMessage() : null}
          {this.getResults()}
        </div>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  const {auth} = state;

  return {
    auth
  };
}

export default connect(mapStateToProps, {})(Search);
