import React, {PropTypes} from 'react';

import PaginationWidget from 'components/widgets/PaginationWidget';
import TimelineCard from 'components/TimelineCard';
import ParentCard from 'containers/ParentCard';
import TabsWidget from 'components/TabsWidget';

import {Colors} from '../../commons/colors';
import {
  formatDateInLocalTimeZone,
  isUndefined
} from '../../commons/utils/utils';
import {autoScrollTo} from 'utils/utils';
import { TIMELINE_CARD, CONTEXTUAL_MENU_CARD } from 'Constants';

const styles = {
  dateStyle: {
    marginRight: '22px',
    marginTop: '19px'
  },
  dateSpan: {
    fontSize: '12px',
    color: Colors.grape
  },
  rightArrow: {
    display: 'block',
    bottom: 0,
    position: 'absolute',
    right: '460px'
  }
};

export function getTabObj(tabs, timelineType, currentTab) {
  let tabObj = {};
  for (let tab in tabs) {
    if (tab === currentTab) {
      tabObj = tabs[tab][timelineType];
    }
  }
  return tabObj;
}

function setOrRemoveQueryParam(queryParams, name, value) {
  if (queryParams[name] === '') {
    if (!isUndefined(value)) {
      queryParams[name] = value;
    }
    else {
      delete queryParams[name];
    }
  }
  else {
    delete queryParams[name];
  }
  return queryParams;
}

class Timeline extends React.Component {
  static propTypes = {
    attributes: PropTypes.object,
    meta: PropTypes.object,
    id: PropTypes.string,
    params: PropTypes.object,
    data: PropTypes.object,
    broadcastEvent: PropTypes.func,
    updateTab: PropTypes.func,
    clearSearch: PropTypes.func,
    search: PropTypes.string
  }

  constructor(props) {
    super(props);

    this.state = {
      totalCount: 0,
      totalPage: 0,
      currentPage: 1,
      filter: '',
      rows: [],
      nextPageStart: 0,
      selectedCardId: '',
      autoScroll: true,
      searchText: props.search
    };

    this.pagination = {
      isPaginated: false,
      pageNumber: 1
    };

    this.style = {
      card: {
        paddingBottom: '25px'
      }
    };

    this.decreaseHeightBy = 120;
    this.decreasePositionBy = 250;
    this.topMargin = 86;
    this.currentTabId = 0;
    this.currentTab = 'DETAILS';
    this.apiObj = {};

    this.contextualMenuApiParams = {
      meta: {},
      attributes: {}
    };

    const {attributes} = props;
    this.card = (!isUndefined(attributes.isMainComponent) && !attributes.isMainComponent)
    ? CONTEXTUAL_MENU_CARD : TIMELINE_CARD;

    this.fetchData = this.fetchData.bind(this);
    this.getContextualMenuApiObj = this.getContextualMenuApiObj.bind(this);
    this.setSelectedCardId = this.setSelectedCardId.bind(this);
    this.setAutoScroll = this.setAutoScroll.bind(this);
    this.onTabChange = this.onTabChange.bind(this);
  }

  componentDidMount() {
    const {props} = this;
    if (!props.data) {
      return;
    }

    this.setRows(props);
    this.state.selectedCardId = '';
  }

  componentWillReceiveProps(nextProps) {
    const {props, state} = this;

    if (!nextProps.data) {
      return;
    }

    if (nextProps.eventData && (nextProps.eventData !== props.eventData)) {
      const {id, set} = nextProps.eventData;

      state.rows.forEach((row) => {
        if (row.id === id) {
          this.setSelectedCardId(id, set);
          let details = {
            selectedCardId: id,
            eventDate: row.Date
          };
          this.getContextualMenuApiObj(details);
          state.autoScroll = false;
        }
      });
    }
    else {
      // if api object has loadOnce property it implies that the general function
      // for duration update will not be called, component has to manage on its own.
      // therefore we are managing in here only e.g. asset page timeline component.
      let loadOnDurationUpdate = false;
      if (props.meta.api && props.meta.api.loadOnce) {
        loadOnDurationUpdate = true;
      }

      if (loadOnDurationUpdate && nextProps.duration !== props.duration) {
        this.fetchData(1, props.attributes.type);
      }
      else {
        this.setRows(nextProps);
        this.pagination.isPaginated = false;
      }
    }

    this.state.selectedCardId = '';
    this.state.searchText = nextProps.search;
  }

  setSelectedCardId(id, set) {
    if (set) {
      this.setState({selectedCardId: id});
    }
    else {
      this.setState({selectedCardId: ''});
    }
  }

  setAutoScroll(autoScroll) {
    this.setState({autoScroll});
  }

  setRows(props) {
    const {state} = this,
      {data, attributes} = props;

    state.totalCount = data.total;
    state.totalPage = Math.ceil(data.total / attributes.noOfEventsPerPage);
    state.currentPage = (this.pagination.isPaginated) ? this.pagination.pageNumber : 1;
    state.nextPageStart = data.next;
    state.rows = data.normalizeData;
    if (state.filter === '' && data.options && data.options.customParams) {
      state.filter = data.options.customParams.filter;
    }
  }

  displayDate(dateString, card) {
    let dateTime = formatDateInLocalTimeZone(dateString),
      paddingLeft = (card === TIMELINE_CARD) ? '0px' : '10px';

    return (
      <div style={{ ...styles.dateStyle, paddingLeft }}>
        <span style={styles.dateSpan}>
          {dateTime.date}<br />{dateTime.time}
        </span>
      </div>
    );
  }

  displayCard() {
    const rows = this.state.rows,
      {props, state} = this,
      {attributes, chart} = props;

    const type = this.card === CONTEXTUAL_MENU_CARD ? 'secondaryTimeline' : 'primaryTimeline';

    return (
      <div style={this.style.card} ref={type} id={type}>
        {
          rows.map((event, index) => {
            let dateString = (event.Date) ? event.Date : '',
              cardId = 'card' + index,
              backgroundColor = (this.card === CONTEXTUAL_MENU_CARD) ? {backgroundColor: Colors.contextBG} : {},
              padding = (this.card === CONTEXTUAL_MENU_CARD)
                ? (index === 0 ? {padding: '15px 15px 0px 15px'} : {padding: '0px 15px 0px 15px'})
                : {};

            if (dateString !== '') {
              return (
                <div style={{ display: 'flex', ...backgroundColor, ...padding }} key={cardId}>
                  {this.card === TIMELINE_CARD ? this.displayDate(dateString, this.card) : null}
                  <TimelineCard
                    id={cardId}
                    data={event}
                    updateRoute={props.updateRoute}
                    getContextualMenuApiObj={this.getContextualMenuApiObj}
                    selectedCardId={state.selectedCardId}
                    card={this.card}
                    attributes={attributes}
                    chart={chart}
                    broadcastEvent={props.broadcastEvent}
                    setSelectedCardId={this.setSelectedCardId}
                    setAutoScroll={this.setAutoScroll} />
                  {this.card === CONTEXTUAL_MENU_CARD ? this.displayDate(dateString, this.card) : null}
                </div>
              );
            }
          })
        }

        <PaginationWidget
          pageCount={state.totalPage}
          currentPage={state.currentPage}
          maxNumbersOnLeftRight={attributes.maxNumbersOnLeftRightPagination}
          fetchData={this.fetchData}
          type={attributes.type}
          style={attributes.otherStyles.pagination ? attributes.otherStyles.pagination : {}} />
      </div>
    );
  }

  fetchData(pageNumber, type, isTabChange) {
    const {props, state} = this,
      {params} = props;

    let api = Object.assign({}, props.meta.api, this.getApiObj(pageNumber, type)),
      options = props.options ? props.options : {};

    if (isTabChange && isTabChange === true && api.queryParams.filter) {
      delete api.queryParams.filter;
    }
    else {
      if (state.searchText !== '') {
        api.queryParams = Object.assign({}, api.queryParams, {
          filter: '__any ~ "' + state.searchText + '"'
        });
      }
      else {
        // below condition is added becasue,
        // we need traffic filter for alert details - Timeline view
        // so deleting only those filters that are added through search bar.
        if (api.queryParams.filter && (api.queryParams.filter).includes('__any ~')) {
          delete api.queryParams.filter;
        }
      }
    }

    props.fetchApiData({id: props.id, api, params, options});
    this.pagination = {
      isPaginated: true,
      pageNumber: pageNumber
    };
  }

  getApiObj(pageNumber, type) {
    const {props} = this,
      {attributes, meta, tabs, timelineType, alertType, trafficFilter} = props;

    let queryParams = Object.assign({},
      meta.api && meta.api.queryParams,
      {
        window: '',
        count: attributes.noOfEventsPerPage,
        from: (pageNumber - 1) * attributes.noOfEventsPerPage
      }),
      apiObj = {},
      tabObj = getTabObj(tabs, timelineType, this.currentTab);

    if (timelineType === 'secondary') {
      let apiObj = {};
      if (alertType) {
        apiObj = tabObj[alertType];
      }
      else {
        apiObj = tabObj;
      }

      if (apiObj.meta.api && apiObj.meta.api.pathParams && apiObj.meta.api.pathParams.selectedCardId) {
        apiObj.meta.api.pathParams[apiObj.meta.api.pathParams.selectedCardId] = props.id;
      }
    }
    else {
      if (alertType) {
        apiObj = tabObj[alertType].meta.api;
        if (trafficFilter) {
          apiObj.queryParams.filter = trafficFilter;
        }
      }
      else {
        apiObj.path = tabObj.path;
        apiObj.pathParams = (meta.api && meta.api.pathParams && meta.api.pathParams.reportId)
          ? {
            reportId: this.currentTabId === 0 ? meta.api.pathParams.reportId : tabObj.pathParams.reportId
          }
          : {};
      }
    }

    if (this.currentTabId === 1 && props.params && props.params.type) {
      queryParams[props.params.type] = props.params.assetId;
    }

    apiObj.queryParams = queryParams;

    return apiObj;
  }

  getContextualMenuApiObj(details) {
    const {props} = this,
      {tabs, alertType} = props;

    let {selectedCardId, eventDate, user, machine, start, end} = details;
    if (!isUndefined(selectedCardId)) {
      this.setState({
        selectedCardId: selectedCardId
      });

      if (selectedCardId !== '') {
        let apiObj = {};
        if (alertType) {
          let tabObj = getTabObj(tabs, 'secondary', this.currentTab);
          apiObj = tabObj[alertType];
        }
        else {
          apiObj = getTabObj(tabs, 'secondary', this.currentTab);
        }

        if (apiObj.meta.api && apiObj.meta.api.pathParams && apiObj.meta.api.pathParams.selectedCardId) {
          apiObj.meta.api.pathParams[apiObj.meta.api.pathParams.selectedCardId] = selectedCardId;
        }
        let queryParams = Object.assign({},
          apiObj.meta.api && apiObj.meta.api.queryParams,
          {
            window: '',
            date: '',
            user: '',
            machine: '',
            start: '',
            end: ''
          });

        queryParams = setOrRemoveQueryParam(queryParams, 'date', eventDate);
        queryParams = setOrRemoveQueryParam(queryParams, 'user', user);
        queryParams = setOrRemoveQueryParam(queryParams, 'machine', machine);
        queryParams = setOrRemoveQueryParam(queryParams, 'start', start);
        queryParams = setOrRemoveQueryParam(queryParams, 'end', end);

        apiObj.meta.api.queryParams = queryParams;

        apiObj.type = 'secondary';
        this.contextualMenuApiParams = apiObj;
      }
    }
  }

  displayContextualMenuCards() {
    const {state, props} = this,
      {tabs} = props;

    let tabNames = [];
    if (tabs) {
      for (let tab in tabs) {
        tabNames.push(tab);
      }
    }

    if (state.autoScroll) {
      autoScrollTo('primaryTimeline', this.decreasePositionBy);
    }

    return (
      <div>
        <div style={{
          width: '450px',
          position: 'absolute',
          top: tabs && tabNames.length > 1 ? 132 : 0,
          right: 0,
          bottom: 0,
          zIndex: 1
        }}>
          <ParentCard
            key={state.selectedCardId}
            id={state.selectedCardId}
            meta={this.contextualMenuApiParams.meta}
            params={props.params}
            attributes={this.contextualMenuApiParams.attributes}
            tabs={props.tabs}
            timelineType='secondary'
            alertType={props.alertType}>
            <Timeline />
          </ParentCard>
        </div>
      </div>
    );
  }

  collaseContextualMenu() {
    return () => {
      let details = {
        selectedCardId: '',
        eventDate: '',
        user: '',
        machine: ''
      };
      this.getContextualMenuApiObj(details);
      this.toggleHighlightNetworkNode('');
    };
  }

  toggleHighlightNetworkNode(id) {
    this.props.broadcastEvent('network-graph', {id});
  }

  setPrimaryTimelineHeight() {
    if (this.card === 'TIMELINE_CARD') {
      // For now, I am keeping this commented code.
      // As discussed with Ojassvi, we need to find out some other good solution for this.
      // this.refs.primaryTimeline.style.height =
      //   (this.refs.secondaryTimeline.offsetHeight - this.decreaseHeightBy) + 'px';

      // For now, I am using 'document' object here.
      if (document.getElementById('secondaryTimeline') &&
        document.getElementById('secondaryTimeline').offsetHeight) {
        if (document.getElementById('secondaryTimeline').offsetHeight >
          document.getElementById('primaryTimeline').offsetHeight) {
          console.log(document.getElementById('secondaryTimeline').offsetHeight, this.decreaseHeightBy, this.topMargin);
          this.refs.primaryTimeline.style.height =
            ((document.getElementById('secondaryTimeline').offsetHeight) - this.decreaseHeightBy +
              this.topMargin) + 'px';
        }
      }
    }
  }

  onTabChange(tabId) {
    const {props} = this,
      isTabChange = true;
    this.currentTabId = tabId.props.index;
    this.currentTab = tabId.props.label;
    props.updateTab(this.currentTab);
    props.clearSearch();
    this.fetchData(1, props.tabs[this.currentTab].type, isTabChange);
  }

  loadTabs() {
    const {props} = this,
      {tabs, timelineType} = props;
    let tabNames = [];
    if (tabs) {
      for (let tab in tabs) {
        tabNames.push(tab);
      }
    }
    if (tabs && tabNames.length > 1 && timelineType === 'primary') {
      return (
        <TabsWidget
          tabs={tabNames}
          style={{paddingLeft: '85px', paddingBottom: '17px'}}
          onTabChange={this.onTabChange} />
      );
    }
    return null;
  }

  displayNoResultsMessage() {
    const {state, props} = this;
    if (((props.data &&
      !isUndefined(state.rows) &&
      state.rows.length === 0 &&
      this.card === TIMELINE_CARD) || props.errorData)) {
      return (
        <div style={{paddingLeft: '85px'}}>No additional results were found.</div>
      );
    }
    return null;
  }

  displayTimeline() {
    const {state, props} = this,
      {attributes} = props;

    if (state.rows && state.rows.length > 0) {
      return (
        <div style={attributes.otherStyles.flex && state.selectedCardId !== '' ? attributes.otherStyles.flex : {}}>
          {this.displayCard()}
          {
            state.selectedCardId !== ''
            ? <div>

              {this.displayContextualMenuCards()}

              <img style={styles.rightArrow}
                src='/img/rightArrow.png'
                onClick={this.collaseContextualMenu()} />

              <div style={{color: 'transparent'}}>
                {
                  setTimeout(() => {
                    this.setPrimaryTimelineHeight();
                  }, 2000)
                }
              </div>
            </div>
            : null
          }
        </div>
      );
    }
    return null;
  }

  render() {
    const {state, props} = this,
      {errorData, meta} = props;

    if (errorData) {
      state.rows = [];
    }

    this.style.card = this.card === TIMELINE_CARD && state.selectedCardId !== '' ? this.style.card : {};
    this.apiObj = meta.api;

    return (
      <div id={props.attributes.id}>
        {this.loadTabs()}

        {this.displayNoResultsMessage()}

        {this.displayTimeline()}
      </div>
    );
  }
}

export default Timeline;
