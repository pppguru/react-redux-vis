import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import Header from './PageHeader';
import Sidebar from './Sidebar';
import PageContent from './PageContent';
import ParentCard from 'containers/ParentCard';
import {fetchNextSetOfData} from 'actions/parentCard';

import { fetchUserData, logout } from 'actions/auth';
import { fetchActionsList } from 'actions/actionsList';

import Loader from 'components/Loader';
import {Colors} from '../../../commons/colors';
import 'styles/core.scss';

import { hideBodyScroll, showBodyScroll } from 'utils/utils';

const styles = {
  details: {
    backgroundColor: Colors.cloud,
    position: 'fixed',
    top: '64px',
    left: '72px',
    bottom: 0,
    right: 0,
    zIndex: 3,
    overflow: 'auto'
  },
  base: {
    paddingLeft: '72px',
    paddingTop: '64px',
    boxSizing: 'border-box',
    height: '100%'
  },
  handle: {
    position: 'absolute',
    right: '-20px',
    top: '64px',
    backgroundColor: Colors.slider,
    height: '72px',
    lineHeight: '72px',
    width: '20px',
    borderRadius: '0 10px 10px 0',
    textAlign: 'center',
    cursor: 'pointer',
    zIndex: 1300
  },
  icon: {
    fontSize: '16px',
    color: Colors.arctic
  }
};

export class CoreLayout extends React.Component {
  static propTypes = {
    fetchUserData: PropTypes.func.isRequired,
    fetchActionsList: PropTypes.func.isRequired,
    logout: PropTypes.func.isRequired,
    history: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired
  }

  constructor(props) {
    super(props);
    this.state = {
      showDetails: false,
      showFullSidebar: false,
      sidebarWidth: {width: '72px'},
      sidebar: props.auth.sidebar,
      showSearch: false,
      isFullView: false,
      elm: null
    };

    this.hideDetails = this.hideDetails.bind(this);
    this.mouseOver = this.mouseOver.bind(this);
    this.mouseOut = this.mouseOut.bind(this);
  }

  getChildContext() {
    const that = this;
    return {
      clickThrough(input) {
        that.setState({
          input,
          showDetails: true
        });

        hideBodyScroll();
      }
    };
  }

  hideDetails() {
    this.setState({
      showDetails: false
    });

    showBodyScroll();
  }

  mouseOver() {
    this.setState({
      sidebarWidth: {width: '172px'}
    });
  }

  mouseOut() {
    this.setState({
      sidebarWidth: {width: '72px'}
    });
  }

  toggleSearch = () => {
    this.setState({showSearch: !this.state.showSearch});
  }

  componentDidMount() {
    this.props.fetchUserData();
    this.props.fetchActionsList();

    this.context.router.listen(() => {
      this.hideDetails();
      if (this.state.showSearch) {
        this.toggleSearch();
      }
    });
  }

  componentWillReceiveProps(nextProps) {
    const {props} = this;

    this.setState({sidebar: nextProps.auth.sidebar});

    // if user api returns error redirect to auth page.
    if (nextProps.auth.isError) {
      props.logout();
    }
  }

  getDetailsInput() {
    const {state: {showDetails, input}} = this;
    let detailsInput = Object.assign({}, input);
    if (showDetails && detailsInput && detailsInput.details) {
      detailsInput.details.meta.api.queryParams = Object.assign({},
        detailsInput.details.meta.api.queryParams, {
          start: detailsInput.data.interval.from,
          end: detailsInput.data.interval.to
        });

      let apiObj = {
        id: detailsInput.details.id,
        api: detailsInput.details.meta.api,
        params: {},
        options: {},
        isDetails: true
      };

      detailsInput = Object.assign({}, detailsInput.details, {
        details: detailsInput.details,
        apiObj,
        fetchNextSetOfData,
        hideDetails: this.hideDetails,
        isDetailsView: true
      });
    }
    else {
      detailsInput = {};
    }

    return detailsInput;
  }

  getFullView = () => {
    const { elm } = this.state,
      {props} = elm,
      updatedProps = Object.assign({}, elm.props, {
        id: `${props.id}FullView`
      });

    updatedProps.attributes = {
      ...updatedProps.attributes,
      id: `${props.attributes.id}-full-view`,
      style: {
        width: '100%',
        height: 'auto'
      }
    };

    return (
      <div style={{...styles.details, padding: '30px'}}>
        <ParentCard {...updatedProps}>
          {React.cloneElement(updatedProps.children)}
        </ParentCard>
      </div>
    );
  }

  render() {
    const {props, state} = this,
      { showDetails, input } = state;

    let detailsInput = this.getDetailsInput();

    return (
      <div style={styles.wrap}>
        <Header params={props.params} />

        <Sidebar
          sidebar={this.state.sidebar}
          location={props.location}
          toggleSearch={this.toggleSearch}
          showSearch={state.showSearch} />

        <div style={styles.base}>
          {
            props.auth.isLoading
            ? <Loader />
            : <PageContent
              location={props.location}
              params={props.params}
              history={this.context.router} />
          }

          {
            showDetails && input.details
            ? (
              <div style={styles.details}>
                <ParentCard {...detailsInput} />
              </div>
            )
            : null
          }
        </div>
      </div>
    );
  }
}

CoreLayout.childContextTypes = {
  clickThrough: React.PropTypes.func
};

CoreLayout.contextTypes = {
  router: React.PropTypes.object
};

function mapStateToProps(state, ownProps) {
  const {auth} = state;
  return {
    auth
  };
}

export default connect(mapStateToProps, {
  fetchUserData, logout, fetchActionsList
})(CoreLayout);
