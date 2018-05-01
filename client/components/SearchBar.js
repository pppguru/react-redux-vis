import React, {PropTypes} from 'react';
import {Colors} from '../../commons/colors';

import { debounce } from 'utils/utils';

const styles = {
  inputWrap: {
    margin: '0 20px',
    width: '85%',
    textAlign: 'right',
    display: 'inline-block',
    position: 'relative',
    verticalAlign: 'middle'
  },
  inputWrapDetails: {
    width: '100%',
    margin: '0px -22px',
    marginBottom: '0px'
  },
  searchText: {
    width: '50%',
    background: Colors.subHeadingBG,
    border: '0px',
    height: '35px',
    paddingLeft: '12px',
    paddingRight: '40px',
    fontSize: '13px',
    marginLeft: '46px'
  },
  searchTextDetails: {
    width: '100%'
  },
  searchIcon: {
    color: Colors.grape,
    cursor: 'pointer',
    bottom: '5px',
    fontSize: '21px',
    height: '14px',
    margin: 'auto',
    position: 'absolute',
    right: '12px',
    top: '8px',
    fontWeight: 500
  },
  searchIconDetails: {
    right: '-35px'
  },
  clearIcon: {
    color: Colors.white,
    cursor: 'pointer',
    fontSize: '21px',
    height: '35px',
    margin: 'auto',
    position: 'absolute',
    top: 0,
    background: Colors.grape,
    lineHeight: '35px',
    width: '45px',
    textAlign: 'center',
    fontWeight: 600
  },
  clearDiv: {
    color: 'transparent',
    cursor: 'initial',
    fontSize: '21px',
    height: '35px',
    lineHeight: '35px',
    width: '45px',
    margin: 'auto',
    marginLeft: '-17px',
    position: 'absolute',
    top: 0,
    background: 'transparent',
    textAlign: 'center',
    fontWeight: 600,
    display: 'inline'
  }
};

class SearchBar extends React.Component {
  constructor(props) {
    super(props);

    this.updateStyles(props);
    this.debounceSearch = debounce(props.updateSearch, 250);
  }

  static propTypes = {
    updateSearch: PropTypes.func.isRequired,
    searchText: PropTypes.string.isRequired,
    loadFloatingSearchBar: PropTypes.func.isRequired
  }

  componentWillReceiveProps(newProps) {
    if (this.myTextInput && newProps.searchText !== this.props.searchText) {
      this.myTextInput.value = newProps.searchText;
    }
  }

  updateStyles(newProps) {
    if (newProps.floatingSearchBar === true) {
      this.state = {
        showClearIcon: true,
        styles: {
          inputWrap: Object.assign({}, styles.inputWrap, styles.inputWrapDetails),
          searchText: Object.assign({}, styles.searchText, styles.searchTextDetails),
          searchIcon: Object.assign({}, styles.searchIcon, styles.searchIconDetails),
          clearIcon: {
            color: Colors.white,
            background: Colors.grape
          }
        }
      };
    }
    else {
      this.state = {
        showClearIcon: false,
        styles: {
          inputWrap: styles.inputWrap,
          searchText: styles.searchText,
          searchIcon: styles.searchIcon,
          clearIcon: {
            color: 'transparent',
            background: 'transparent'
          }
        }
      };
    }
  }

  clearSearchText = () => {
    const {props} = this;
    if (props.floatingSearchBar === true) {
      props.loadFloatingSearchBar(false);
    }
    this.props.updateSearch({ target: {value: ''} });
    this.myTextInput.value = '';
  }

  focusSearchText = () => {
    if (this.myTextInput) {
      this.myTextInput.focus();
    }
  }

  hideClearIcon = () => {
    const {props, state} = this;
    if (props.floatingSearchBar === false) {
      this.setState({
        showClearIcon: false,
        styles: Object.assign({}, state.styles, {
          clearIcon: {
            color: 'transparent',
            background: 'transparent'
          }
        })
      });
    }
  }

  showClearIcon = () => {
    const {props, state} = this;

    if (props.floatingSearchBar === false) {
      this.setState({
        showClearIcon: true,
        styles: Object.assign({}, state.styles, {
          clearIcon: {
            color: Colors.white,
            background: Colors.grape
          }
        })
      });
    }
  }

  callSearch = (evt) => {
    evt.persist();
    this.debounceSearch(evt);
  }

  render() {
    const {props, state} = this,
      {attributes: {otherStyles}} = props;

    if (otherStyles) {
      state.styles.searchText = Object.assign({},
        state.styles.searchText,
        otherStyles.searchBar
      );
    }

    return (
      <div style={state.styles.inputWrap}>
        <div style={styles.clearDiv} onClick={this.clearSearchText}>
          <i className='material-icons'
            style={{...styles.clearIcon, ...state.styles.clearIcon}}
            ref={(ref) => this.clearIcon = ref}>
            close
          </i>
        </div>

        <input
          id='searchText'
          type='text'
          style={state.styles.searchText}
          onChange={this.callSearch}
          onFocus={this.showClearIcon}
          onBlur={this.hideClearIcon}
          ref={(ref) => this.myTextInput = ref}
          autoFocus={props.floatingSearchBar} />

        <i className='material-icons'
          style={state.styles.searchIcon}
          onClick={this.focusSearchText}>
          search
        </i>
      </div>
    );
  }
};

export default SearchBar;
