import React, {PropTypes} from 'react';
import {Colors} from '../../../commons/colors';
import {Fonts} from '../../../commons/fonts';
import {
  firstCharCapitalize,
  isUndefined,
  isNull
} from '../../../commons/utils/utils';

import {autoScrollTo, getPosition} from 'utils/utils';

import Cookies from 'cookies-js';
import vis from 'vis';
import {baseUrl, networkGraphDefaultOptions, hierarchicalNetwork, applyHierarchicalNetwork} from 'config';

import {createNodeObject} from './GraphNode';
import {createEdgeObject} from './GraphEdge';
import {getIcon} from './GraphUtils';
import { DEFAULT_FONT } from 'Constants';

import Loader from 'components/Loader';
import ContextualMenu from './ContextualMenu';

import CanvasToolBar from './CanvasToolBar';
import NetworkStyleMenu from './NetworkStyleMenu';
import NodeSelectionMenu from './NodeSelectionMenu';

import './_network.scss';

const styles = {
  graphWrap: {
    display: 'block',
    height: '100%'
  },
  loader: {
    position: 'absolute',
    top: '350px',
    display: 'flex',
    backgroundColor: Colors.contextBG,
    padding: '20px',
    left: '300px',
    width: '350px'
  }
};

let timeWindow = {
    window: '1h'
  },
  undoGraphCount = 0,
  nodeDefaultOptions = {
    borderWidth : 4,
    chosen:{
      node:function (values, id, selected, hovering){
        values.borderWidth = 4;
        values.color = values.borderColor;
      }
    },
    labelHighlightBold: false,
    shape:'circularImage',
    font:{
      multi:'html',
      color: Colors.garnet,
      face: Fonts.roboto,
      size: Fonts.defaultSize,
      align: 'left'
    },
  },
  edgeDefaultOptions = {
    font: {
      face: DEFAULT_FONT,
      color: Colors.pebble,
      size: Fonts.edgeLabelSize,
      align: 'middle'
    }
  },
  showLabelOnNode = {
    font : {
      size: Fonts.defaultSize
    }
  },
  hideLabelOnNode = {
    font : {
      size : 0
    }
  },
  showLabelOnEdge = {
    font : {
      size: Fonts.edgeLabelSize
    }
  },
  hideLabelOnEdge = {
    font : {
      size : 0
    }
  },
  physicsTrue = {
    physics: {
      stabilization: true
    },
    nodes: nodeDefaultOptions,
    edges: edgeDefaultOptions
  },
  physicsFalse = {
    physics: false,
    nodes: nodeDefaultOptions,
    edges: edgeDefaultOptions
  },
  improvedLayoutTrue = {
    layout: {
      improvedLayout: true
    },
    nodes: nodeDefaultOptions,
    edges: edgeDefaultOptions
  },
  improvedLayoutFalse = {
    layout: {
      improvedLayout: false
    },
    nodes: nodeDefaultOptions,
    edges: edgeDefaultOptions
  },
  defaultLayoutOptions = {
    layout:{
      hierarchical: {
        enabled:false,
      }
    },
    nodes: nodeDefaultOptions,
    edges: edgeDefaultOptions
  },
  hierarchicalLayoutOptions = {
    layout:{
      hierarchical: {
        enabled : true,
        direction: 'UD',
      }
    },
    nodes: nodeDefaultOptions,
    edges: edgeDefaultOptions
  },
  sequentialLayoutOptions = {
    layout:{
      hierarchical: {
        enabled:true,
        direction : 'LR',
      }
    },
    nodes: nodeDefaultOptions,
    edges: edgeDefaultOptions
  },
  radialOptions = {
    layout:{
      hierarchical: {
        enabled:false,
      },
      randomSeed:2
    },

    // physics: {
    //   stabilization : true,
    //   repulsion: {
    //     centralGravity: 0.1,
    //     springLength: 250,
    //     springConstant: 0.05,
    //     nodeDistance: 250,
    //     damping: 0.09
    //   }
    // },
    nodes: nodeDefaultOptions,
    edges: edgeDefaultOptions
  },
  emptyNodesEdges = {
    nodes: [],
    edges: []
  };

export function generateDataFromAssetDetails(data) {
  const assetData = [];
  const nodes = [];

  nodes[0] = {
    id: data.id,
    nodeId: data.id,
    label: data.info.name,
    type: data.type,
    metadata: data.info
  };

  assetData[0] = {
    nodes,
    edges: []
  };

  return assetData;
}

function getActionsByTypes(actionsData) {
  let nodeTypes = [],
    lookup = {},
    actions = [];
  actionsData.forEach((action) => {
    let types = action.types;
    types.forEach((type) => {
      if (!(type in lookup)) {
        lookup[type] = 1;
        const obj = {
          type: type
        };

        nodeTypes.push(obj);
      }
    });
  });

  nodeTypes.forEach((node) => {
    let actionObject = {},
      nodeType = (node.type).toLowerCase();
    actionObject.nodeType = nodeType;
    actionObject.actions = [];

    actionsData.forEach((action) => {
      if ((action.types).includes(nodeType)) {
        let tempObj = {
          reportId: action.name,
          targetType: action.targetType,
          label: action.label,
          parameters: action.parameters,
          actionType: action.actionType
        };
        actionObject.actions.push(tempObj);
      }
    });

    actions.push(actionObject);
  });

  return actions;
}

function isNodeOrEdgeAlreadyExists(array, id) {
  let exists = false;
  array.forEach((value) => {
    if (value.id === id) {
      exists = true;
    }
  });
  return exists;
}

function displayNotificationMessage(message, actionId) {
  let position = getPosition(document.getElementById(actionId));
  document.getElementById('notification-message').innerHTML = message;
  document.getElementById('notification-message').style.top = (position.y - 95) + 'px';
  ANIMATIONS.fadeIn(document.getElementById('notification-message'), {
    duration: 2,
    complete: function() {
      document.getElementById('notification-message').style.display = 'block';

      ANIMATIONS.fadeOut(document.getElementById('notification-message'), {
        duration: 2000,
        complete: function() {
          document.getElementById('notification-message').style.display = 'none';
        }
      });
    }
  });
}

function openFullMalwareReport(fullMalwareReportLink) {
  if (fullMalwareReportLink !== '') {
    window.open(baseUrl + fullMalwareReportLink);
  }
}

class NetworkGraph extends React.Component {
  static propTypes = {
    duration: PropTypes.object,
    params: PropTypes.object,
    broadcastEvent: PropTypes.func
  }

  constructor(props) {
    super(props);
    const {duration, params} = this.props,
      alertDate = params.date;

    this.nodeObjects = {};
    this.edgeObjects = {};
    this.decreasePositionBy = 120;
    this.highlightActive = false;

    this.state = {
      nodes: [],
      edges: [],
      previousNodesEdges: emptyNodesEdges,
      originalNodesEdges: emptyNodesEdges,
      duration: duration,
      alertDate: alertDate,
      isFetching: false, // This flag will get removed after started using fetchApiData function from props object
      showContextMenu: false,
      showUndoResetButtons: false,
      nodesListStatus: 'default',
      selectedNodeDetails: '',
      selectedNode: '',
      selectedNodesForExtendingGraph: [],
      actionsData: [],
      loaderText: '',
      loadAgain: true,
      sourceDetails: null,
      showStyleMenu: false,
      selectedStyle : 0,
      showNodeSelectionMenu : false,
      selectedNodeType : 0
    };

    this.deselectNode = this.deselectNode.bind(this);
    this.deselectEdge = this.deselectEdge.bind(this);

    this.loadContextMenu = this.loadContextMenu.bind(this);
    this.loadNodeEdgeContextMenu = this.loadNodeEdgeContextMenu.bind(this);

    this.loadGraph = this.loadGraph.bind(this);
    this.extendGraph = this.extendGraph.bind(this);
    this.fetchExtendedNodes = this.fetchExtendedNodes.bind(this);
    this.updateGraph = this.updateGraph.bind(this);
    this.undoOrResetGraph = this.undoOrResetGraph.bind(this);
    this.reScaleGraph = this.reScaleGraph.bind(this);
    this.reLayoutGraph = this.reLayoutGraph.bind(this);
    this.zoomInGraph = this.zoomInGraph.bind(this);
    this.zoomOutGraph = this.zoomOutGraph.bind(this);
    this.isGraphExtended = this.isGraphExtended.bind(this);
    this.updateNodeAndEdgeObjects = this.updateNodeAndEdgeObjects.bind(this);

    this.handleShowLabel = this.handleShowLabel.bind(this);


    this.network = null;
  }

  componentWillReceiveProps(nextProps) {
    const {props} = this;

    if (nextProps.eventData && (nextProps.eventData !== props.eventData)) {
      const {id} = nextProps.eventData;

      this.deselectNodes(this.network);
      // this.network.setSelection({nodes: [], edges: []});
      this.network.unselectAll();

      if (this.nodeObjects[id]) {
        let nodeDetails = {
          network: this.network,
          nodeID: id,
          selected: 'node'
        };
        this.network.setSelection({nodes: [id], edges: []});
        this.loadNodeContextMenu(nodeDetails);
      }
    }
  }

  getNodesEdges(data) {
    let nodes = [],
      edges = [],
      dataNodes = data.nodes,
      dataEdges = data.edges;

    if (!isUndefined(dataNodes)) {
      dataNodes.forEach((dataNode) => {
        let nodeId = dataNode.nodeId ? dataNode.nodeId : dataNode.id;
        if (isUndefined(this.nodeObjects[nodeId])) {
          dataNode.nodeTypeDisplay = dataNode.type ? firstCharCapitalize(dataNode.type) : '';
          let nodeObject = createNodeObject(dataNode);
          nodes.push(nodeObject);
          this.nodeObjects[nodeId] = nodeObject;
        }
      });
    }

    if (!isUndefined(dataEdges)) {
      let alreadyAddedEdges = [];
      dataEdges.forEach((dataEdge) => {
        if (isUndefined(this.edgeObjects[dataEdge.id]) && !isNodeOrEdgeAlreadyExists(alreadyAddedEdges, dataEdge.id)) {
          let edgesInSameDirection = [];
          dataEdges.forEach((edgeInSameDirection) => {
            if (dataEdge.id !== edgeInSameDirection.id &&
              dataEdge.source === edgeInSameDirection.source &&
              dataEdge.target === edgeInSameDirection.target) {
              edgesInSameDirection.push(edgeInSameDirection);
              alreadyAddedEdges.push(edgeInSameDirection);
            }
          });

          let edgeObject = createEdgeObject(dataEdge, edgesInSameDirection);
          edges.push(edgeObject);
          this.edgeObjects[dataEdge.target] = edgeObject;
          this.edgeObjects[edgeObject.id] = edgeObject;
        }
      });
    }

    return {
      'nodes': nodes,
      'edges': edges
    };
  }

  updateNodeAndEdgeObjects(updatedNodes, updatedEdges) {
    let tempNodeObjects = {},
      tempEdgeObjects = {};

    for (let key in this.nodeObjects) {
      if (!isUndefined(updatedNodes)) {
        updatedNodes.forEach((updatedNode) => {
          let nodeId = updatedNode.nodeId ? updatedNode.nodeId : updatedNode.id;
          if (nodeId === key) {
            tempNodeObjects[key] = this.nodeObjects[key];
            tempEdgeObjects[key] = this.edgeObjects[key];// Remove other targets from edgeObjects
          }
        });
      }
    }

    this.nodeObjects = Object.assign({}, tempNodeObjects);

    for (let key in this.edgeObjects) {
      if (!isUndefined(updatedEdges)) {
        updatedEdges.forEach((updatedEdge) => {
          if (updatedEdge.id === key) {
            tempNodeObjects[key] = this.nodeObjects[key];
            tempEdgeObjects[key] = this.edgeObjects[key];// Remove other targets from edgeObjects
          }
        });
      }
    }
    this.edgeObjects = Object.assign({}, tempEdgeObjects);
  }

  mergeMultipleGraphs(nodes, edges, data) {
    let isGraphExtended = false;

    data.forEach((graph) => {
      let nodesEdges = this.getNodesEdges(graph);

      if (!isUndefined(nodesEdges.nodes)) {
        nodesEdges.nodes.forEach((node) => {
          if (isNodeOrEdgeAlreadyExists(nodes, node.id) === false) {
            nodes.push(node);
            isGraphExtended = true;
          }
        });
      }

      if (!isUndefined(nodesEdges.edges)) {
        nodesEdges.edges.forEach((edge) => {
          if (isNodeOrEdgeAlreadyExists(edges, edge.id) === false) {
            edges.push(edge);
            isGraphExtended = true;
          }
        });
      }
    });
    return {
      nodes: nodes,
      edges: edges,
      isGraphExtended: isGraphExtended
    };
  }

  deselectNode(network) {
    return (event) => {
      this.deselectNodes(network);
      this.closeContextualMenu();
    };
  }

  deselectNodes(network) {
    for (let obj in this.nodeObjects) {
      let deselectedNode = this.nodeObjects[obj],
        node = network.body.nodes[deselectedNode.id];

      // node.setOptions({
      //   image: getIcon(deselectedNode.type, deselectedNode.status, 'INACTIVE')
      // });

      this.deselect(deselectedNode);
      this.toggleHighlightAnomalyChart({id: ''}, false);
    }
  }

  deselectEdge() {
    return (event) => {
      let i = 0;
      for (let edgeObject in this.edgeObjects) {
        let deselectedEdge = this.edgeObjects[edgeObject];

        if (!isUndefined(deselectedEdge)) {
          if (i === 0) {
            this.deselect(deselectedEdge);
          }
          i++;
        }
      }

      this.closeContextualMenu();
    };
  }

  deselect(deselected) {

    if (!isUndefined(deselected)) {
      this.setState({
        loadAgain: false,
        showContextMenu: false,
        selectedNodeDetails: '',
        actions: '',
        selectedNode: '',
        selectedNodesForExtendingGraph: [],
        sourceDetails: null
      });
      // document.getElementById('actions').innerHTML = '';
      // document.getElementById('refreshData').style.marginLeft = 'auto';
    }
  }

  handleNodeSelected(params){
    let hiddenColorDefault = 'rgba(200,200,200,0.5)';
    let nodesDataset = this.network.body.data.nodes;
    var allNodes = nodesDataset.get({returnType:"Object"});

    if (params.nodes.length > 0) {

      this.network.unselectAll();

      this.highlightActive = true;
      var selectedNode = params.nodes[0];

      // mark all nodes as hard to read.
      for (var nodeId in allNodes) {

        if (allNodes[nodeId].hiddenColor === undefined) {
          allNodes[nodeId].hiddenColor = allNodes[nodeId].color;
        }
        allNodes[nodeId].color = hiddenColorDefault;
      }
      var connectedNodes = this.network.getConnectedNodes(selectedNode);

      // all first degree nodes get their own color and their label back
      for (var i = 0; i < connectedNodes.length; i++) {
        allNodes[connectedNodes[i]].color = allNodes[connectedNodes[i]].hiddenColor;
      }

      // the main node gets its own color and its label back.
      allNodes[selectedNode].color = allNodes[selectedNode].hiddenColor;

      this.network.setSelection({nodes :[selectedNode]});

    }
    else if (this.highlightActive === true) {
      this.network.unselectAll();

      // reset all nodes
      for (var nodeId in allNodes) {
        allNodes[nodeId].color = allNodes[nodeId].hiddenColor;
      }
      this.highlightActive = false;

      if (params.edges.length > 0){
        let selectedEdge = params.edges[0];
        this.network.setSelection({edges : [selectedEdge]});
      }
    }

    // transform the object into an array
    var updateArray = [];
    for (nodeId in allNodes) {
      if (allNodes.hasOwnProperty(nodeId)) {
        updateArray.push(allNodes[nodeId]);
      }
    }
    nodesDataset.update(updateArray);

    // this.resetAllNodesSize(this.network);
  }

  onClickNetworkGraph() {
    return (params) => {
      this.handleNodeSelected(params);
    }
  }

  networkDragEnded(){
    return (params) => {
      if (params.nodes.length > 0) {
        var selectedNodeID = params.nodes[0];
        this.handleNodeSelected(params);
      }else if (params.edges.length > 0) {
        var selectedEdgeID = params.edges[0];
        this.network.setSelection({edges : [selectedEdgeID]});
      }
    };
  }

  stabilizedNetwork(){
    return (event) => {
      let newEdgeLength = 10000;
      edgeDefaultOptions.length = newEdgeLength;
      this.network.setOptions({
        nodes : nodeDefaultOptions,
        edges : edgeDefaultOptions,
        physics : false
      });
    };
  }

  loadContextMenu(network, contextMenuType) {
    return (event) => {

      let listHTML = {
        loadAgain: false
      };
      this.setState(listHTML);

      let selectedIDs = network.getSelection(),
        selected = '';

      if (contextMenuType === 'node' && network.getSelection().nodes.length > 0) {
        selected = 'node';
      }
      if (contextMenuType === 'edge' && network.getSelection().edges.length > 0) {
        selected = 'edge';
      }

      this.loadNodeEdgeContextMenu(selected, selectedIDs, network);
    };
  }

  loadNodeEdgeContextMenu(selected, selectedIDs, network) {
    let nodeID = selectedIDs.nodes[0],
      edgeID = selectedIDs.edges[0];

    switch (selected) {
      case 'node':
        let nodeDetails = {
          network,
          nodeID,
          selected
        };
        this.loadNodeContextMenu(nodeDetails);
        break;
      case 'edge':
        let edgeDetails = {
          network,
          edgeID,
          selected
        };
        this.loadEdgeContextMenu(edgeDetails);
        break;
      default:
        break;
    }
  }

  toggleHighlightAnomalyChart(nodeObject, set = true) {
    this.props.broadcastEvent('primary-timeline', {id: nodeObject.id, set});
  }

  loadNodeContextMenu(nodeDetails) {
    let {network, nodeID, selected} = nodeDetails,
      {state} = this,
      nodeType,
      selectedNodeDetails = [];

    state.nodes.forEach((nodeObject) => {
      let node = network.body.nodes[nodeObject.id];
      if (nodeObject.id === nodeID) {
        selectedNodeDetails.push(nodeObject.nodeDetails);
        nodeType = nodeObject.type;


        // this.network.setSelection({nodes :[nodeID]});

        // node.setOptions({
        //   image: getIcon(nodeObject.type, nodeObject.status, 'SELECTED')
        // });

        this.toggleHighlightAnomalyChart(nodeObject);
      }
      else {
        // node.setOptions({
        //   image: getIcon(nodeObject.type, nodeObject.status, 'INACTIVE')
        // });
      }
    });

    let notNodeId = this.nodeObjects[nodeID] ? this.nodeObjects[nodeID].notNodeId : '';

    let sourceDetails = {
      contextMenuType: selected,
      network: network,
      itemId: nodeID,
      itemType: nodeType,
      notNodeId: notNodeId
    };

    this.setState({ sourceDetails });
    // this.ContextualMenu.getContextMenu(sourceDetails);

    let selectedNodesForExtendingGraph = [{
      nodeID: nodeID,
      reportId: '',
      timeWindow: timeWindow
    }];

    let states = {
      loadAgain: false,
      selectedNodeDetails,
      showContextMenu: true,
      selectedNode: nodeID,
      selectedNodesForExtendingGraph
    };
    this.setState(states);
  }

  loadEdgeContextMenu(edgeDetails) {
    let {network, edgeID, selected} = edgeDetails,
      {state} = this,
      edgeType,
      selectedNodeDetails = [];

    state.edges.forEach((edgeObject) => {
      if (edgeObject.id === edgeID) {
        selectedNodeDetails.push(edgeObject.edgeDetails);
        edgeType = edgeObject.type;

        this.toggleHighlightAnomalyChart(edgeObject);
      }
    });

    let notNodeId = this.edgeObjects[edgeID] ? this.edgeObjects[edgeID].notNodeId : '';

    let sourceDetails = {
      contextMenuType: selected,
      network,
      itemId: edgeID,
      itemType: edgeType,
      notNodeId
    };

    this.setState({ sourceDetails });
    // this.ContextualMenu.getContextMenu(sourceDetails);

    let states = {
      loadAgain: false,
      selectedNodeDetails,
      showContextMenu: true
    };
    this.setState(states);
  }

  loadGraph(load) {
    this.setState({
      'loadAgain': load
    });
  }

  extendGraph(sourceDetails, actionDetails) {
    return (event) => {
      let {contextMenuType, network, itemId} = sourceDetails,
        nodeID = itemId,
        {reportId, parameters, actionsCount, actionId, actionLabel, fullMalwareReportLink, actionType} = actionDetails;
      this.setState({
        isFetching: true,
        loaderText: actionLabel
      });
      let selectedNodesForExtendingGraph = this.state.selectedNodesForExtendingGraph;
      if (!isUndefined(selectedNodesForExtendingGraph)) {
        selectedNodesForExtendingGraph.forEach((selectedNode) => {
          if (selectedNode.nodeID === nodeID && selectedNode.reportId === reportId &&
            ((selectedNode.timeWindow.window && timeWindow.window &&
              selectedNode.timeWindow.window === timeWindow.window) ||
            (selectedNode.timeWindow.start && selectedNode.timeWindow.end &&
              timeWindow.start && timeWindow.end &&
              selectedNode.timeWindow.start === timeWindow.start &&
              selectedNode.timeWindow.end === timeWindow.end))) {
            let message = 'You have already performed this action.';
            displayNotificationMessage(message, actionId);
            this.setState({
              isFetching: false
            });
            return;
          }
        });
      }

      openFullMalwareReport(fullMalwareReportLink);
      if (fullMalwareReportLink !== '') {
        this.setState({
          isFetching: false
        });
        return;
      }

      let details = {
        network,
        actionId,
        reportId,
        nodeID,
        timeWindow,
        parameters,
        selectedNodesForExtendingGraph,
        contextMenuType,
        actionsCount,
        actionType
      };

      this.fetchExtendedNodes(details);
    };
  }

  fetchExtendedNodes(details) {
    let {
      network,
      actionId,
      reportId,
      nodeID,
      selectedNodesForExtendingGraph,
      contextMenuType,
      actionsCount,
      actionType
    } = details;

    const extendedNodes = this.fetchData(details),
      that = this;

    if (actionType !== 'timeline') {
      if (!extendedNodes) {
        this.setState({
          isFetching: false
        });
        return;
      }

      extendedNodes.then(
        function(json) {
          let graphDetails = {
            extendedNodes: json,
            network: network,
            actionId: actionId,
            selectedNodesForExtendingGraph: selectedNodesForExtendingGraph,
            nodeID: nodeID,
            reportId: reportId,
            contextMenuType: contextMenuType
          };
          that.updateGraph(graphDetails);
        }
      );
    }
    else {
      this.setState({
        isFetching: false
      });
    }
  }

  fetchData(details) {
    const {props} = this;
    let {
        reportId,
        nodeID,
        timeWindow,
        parameters,
        selectedNodesForExtendingGraph,
        actionType
      } = details,
      otherParameters = '',
      params = {};

    if (Array.isArray(parameters)) {
      parameters.forEach((parameter) => {
        if (parameter.userInput === true) {
          otherParameters += `&${parameter.name}=${document.getElementById(parameter.id).value}`;
          params[parameter.name] = document.getElementById(parameter.id).value;
        }
        else {
          otherParameters += `&${parameter.name}=${parameter.value}`;
          params[parameter.name] = parameter.value;
        }
      });
    }

    if (actionType === 'timeline') {
      const apiObj = {
        'path': '/api/analytics/reporting/execute/{reportId}',
        'pathParams': {
          'reportId': reportId
        },
        'queryParams': Object.assign({
          'window': '',
          'from': 0,
          'count': 10
        }, params)
      };

      props.fetchApiData({id: props.timelineId, api: apiObj, params: {}, options: {}});

      selectedNodesForExtendingGraph.push({
        'nodeID': nodeID,
        'reportId': reportId,
        'timeWindow': timeWindow
      });

      autoScrollTo('primary-timeline', this.decreasePositionBy);
    }
    else {
      const accessToken = Cookies.get('access_token'),
        tokenType = Cookies.get('token_type'),
        windowParam = timeWindow.window ? 'window=' + timeWindow.window : '',
        startEndParam = timeWindow.start && timeWindow.end
          ? 'start=' + timeWindow.start + '&end=' + timeWindow.end : '',
        apiUrl = baseUrl + '/api/analytics/actions/execute/' + reportId + '?' +
          windowParam + startEndParam + otherParameters,
        customHeaders = {
          'Accept': 'application/json'
        },
        defaultHeaders = Object.assign({
          'Authorization': `${tokenType} ${accessToken}`
        }, customHeaders);

      return fetch(apiUrl, {
        method: 'GET',
        headers: defaultHeaders
      })
      .then(response => response.json())
      .catch(error => {
        this.setState({
          isFetching: false
        });
        return Promise.reject(Error(error.message));
      });
    }
  }

  updateGraph(details) {

    let {
        extendedNodes,
        network,
        actionId,
        selectedNodesForExtendingGraph,
        nodeID,
        reportId,
        contextMenuType
      } = details,
      {state} = this,
      nodes = state.nodes,
      edges = state.edges;

    if (isUndefined(extendedNodes[0])) {
      let message = 'No additional results found.';

      this.handleNodeSelected({nodes:[nodeID]});

      displayNotificationMessage(message, actionId);
      this.setState({
        isFetching: false
      });
      return;
    }

    if (state.previousNodesEdges.nodes.length > 0) {
      undoGraphCount++;
    }
    else {
      undoGraphCount = 0;
    }

    let nodesPrevious = [],
      edgesPrevious = [];

    nodesPrevious.push(Object.assign([], nodes));
    edgesPrevious.push(Object.assign([], edges));

    let isGraphExtended = this.isGraphExtended(nodes, edges, extendedNodes);

    selectedNodesForExtendingGraph.push({
      'nodeID': nodeID,
      'reportId': reportId,
      'timeWindow': timeWindow
    });


    //Update the network options(physics enable, improvedLayout) according to the nodes count
    if (nodes.length <= 10) {
      network.setOptions(physicsFalse);
      network.setOptions(improvedLayoutTrue);
    }
    else {
      network.setOptions(physicsTrue);

      if (nodes.length >= 100) {
        network.setOptions(improvedLayoutFalse);
      }
      else{
        network.setOptions(improvedLayoutTrue);
      }
    }

    //Update the network option(edge length) according to the nodes count
    let edgeLength = nodes.length * 10;
    edgeDefaultOptions.length = edgeLength;
    network.setOptions({
      nodes : nodeDefaultOptions,
      edges : edgeDefaultOptions
    });


    network.setData({nodes: nodes, edges: edges});
    this.resetAllNodesSize(network);

    this.handleNodeSelected({nodes:[nodeID]});

    if (!isGraphExtended) {
      nodesPrevious = [];
      edgesPrevious = [];
      undoGraphCount--;
    }

    this.setState({
      loadAgain: false,
      nodesListStatus: 'extended',
      nodes: Object.assign([], nodes),
      edges: Object.assign([], edges),
      selectedNodesForExtendingGraph: selectedNodesForExtendingGraph,
      isFetching: false,
      loaderText: '',
      previousNodesEdges: {
        nodes: (nodesPrevious.length > 0) ? state.previousNodesEdges.nodes.concat(nodesPrevious)
          : state.previousNodesEdges.nodes,
        edges: (edgesPrevious.length > 0) ? state.previousNodesEdges.edges.concat(edgesPrevious)
          : state.previousNodesEdges.edges
      },
      showUndoResetButtons: true
    });



    // if (contextMenuType === 'node') {
    //   let node = network.body.nodes[nodeID];
    //   if (this.nodeObjects[nodeID] !== undefined) {
    //     node.setOptions({
    //       image: getIcon(this.nodeObjects[nodeID].type, this.nodeObjects[nodeID].status, 'SELECTED')
    //     });
    //   }
    // }

    if (!isGraphExtended) {
      let message = 'No additional results found.';
      this.handleNodeSelected({nodes:[nodeID]});
      displayNotificationMessage(message, actionId);
      this.setState({
        isFetching: false
      });
      return;
    }

    document.getElementById('undo').onclick = this.undoOrResetGraph(network, 'undo');
    document.getElementById('reset').onclick = this.undoOrResetGraph(network, 'reset');
    document.getElementById('rescaleFit').onclick = this.reScaleGraph(network);
    document.getElementById('layoutChange').onclick = this.reLayoutGraph(network);
    document.getElementById('filterNode').onclick = this.filterNodeGraph(network);
    document.getElementById('zoomIn').onclick = this.zoomInGraph(network);
    document.getElementById('zoomOut').onclick = this.zoomOutGraph(network);

    this.network = network;
    this.closeContextualMenu();
  }

  isGraphExtended(nodes, edges, extendedNodes) {
    let nodesEdges = this.mergeMultipleGraphs(nodes, edges, extendedNodes);
    return nodesEdges.isGraphExtended;
  }

  zoomInGraph(network){
    return (event) => {
      let currentPosition = network.getViewPosition();
      let currentScale = network.getScale();

      network.moveTo({
        position: currentPosition,
        scale: currentScale + 0.1
      });
    };
  }

  zoomOutGraph(network){
    return (event) => {
      let currentPosition = network.getViewPosition();
      let currentScale = network.getScale();

      network.moveTo({
        position: currentPosition,
        scale: currentScale < 0.1 ? 0 : currentScale - 0.1
      });
    };
  }

  reScaleGraph(network){
    return (event) => {
      network.fit();
    };
  }

  reLayoutGraph(network){
    return (event) => {

      this.setState ({showStyleMenu : true})
    };
  }

  filterNodeGraph(network){
    return (event) => {

      this.setState ({showNodeSelectionMenu : true})
    };
  }

  undoOrResetGraph(network, action) {

    return (event) => {
      let nodesEdges = (action === 'undo') ? this.state.previousNodesEdges
        : this.state.originalNodesEdges,
        nodes = (action === 'undo') ? nodesEdges.nodes[undoGraphCount] : nodesEdges.nodes,
        edges = (action === 'undo') ? nodesEdges.edges[undoGraphCount] : nodesEdges.edges;

      if (!isUndefined(nodesEdges.nodes) && !isUndefined(nodesEdges.edges)) {
        if (!isUndefined(nodes) &&
          !isUndefined(edges)) {
          let updatedNodes = Object.assign([], nodes),
            updatedEdges = Object.assign([], edges);


          //Update the network options(physics enable, improvedLayout) according to the nodes count
          if (nodes.length <= 10) {
            network.setOptions(physicsFalse);
            network.setOptions(improvedLayoutTrue);
          }
          else {
            network.setOptions(physicsTrue);

            if (nodes.length >= 100) {
              network.setOptions(improvedLayoutFalse);
            }
            else{
              network.setOptions(improvedLayoutTrue);
            }
          }

          //Update the network option(edge length) according to the nodes count
          let edgeLength = nodes.length * 10;
          edgeDefaultOptions.length = edgeLength;
          network.setOptions({
            nodes : nodeDefaultOptions,
            edges : edgeDefaultOptions
          });

          network.setData({nodes: nodes, edges: edges});
          this.resetAllNodesSize(network);




          this.updateNodeAndEdgeObjects(updatedNodes, updatedEdges);

          let previousNodesEdges = emptyNodesEdges;

          if (action === 'undo') {
            let tempNodesArray = Object.assign([], nodesEdges.nodes),
              tempEdgesArray = Object.assign([], nodesEdges.edges);

            tempNodesArray.splice(undoGraphCount, 1);
            tempEdgesArray.splice(undoGraphCount, 1);

            previousNodesEdges = {
              nodes: Object.assign([], tempNodesArray),
              edges: Object.assign([], tempEdgesArray)
            };
          }

          this.setState({
            loadAgain: false,
            nodesListStatus: 'extended',
            nodes: updatedNodes,
            edges: updatedEdges,
            isFetching: false,
            showContextMenu: false,
            selectedNodeDetails: [],
            actions: '',
            selectedNode: '',
            selectedNodesForExtendingGraph: [],
            previousNodesEdges: previousNodesEdges,
            sourceDetails: null
          });

          // document.getElementById('actions').innerHTML = '';
          if (action === 'undo') {
            undoGraphCount--;
          }
          else {
            undoGraphCount = 0;
          }
        }
        this.network = network;
      }
    };
  }

  handleShowLabel(isShow) {
    let showOptionsNode, showOptionsEdge;
    if (isShow) {
      showOptionsNode = showLabelOnNode;
      showOptionsEdge = showLabelOnEdge;
    }
    else {
      showOptionsNode = hideLabelOnNode;
      showOptionsEdge = hideLabelOnEdge;
    }

    this.network.setOptions({
      nodes : showOptionsNode,
      edges : showOptionsEdge
    });

    nodeDefaultOptions.font.size = showOptionsNode.font.size;
    edgeDefaultOptions.font.size = showOptionsEdge.font.size;
  }

  networkStyleSetVisible(isVisible){
    this.setState({
      showStyleMenu: isVisible,
    });
  }

  networkStyleSetLayout(selectedStyle){

    let newLayoutOptions;
    if (selectedStyle === 0){
      newLayoutOptions = defaultLayoutOptions;
      this.network.setOptions(defaultLayoutOptions);
    }
    else if (selectedStyle === 1){
      newLayoutOptions = hierarchicalLayoutOptions;
      this.network.setOptions(hierarchicalLayoutOptions);
    }
    else if (selectedStyle === 2){
      newLayoutOptions = radialOptions;
      this.network.setOptions(radialOptions);
    }
    else if (selectedStyle === 3){
      newLayoutOptions = sequentialLayoutOptions;
      this.network.setOptions(sequentialLayoutOptions);
    }

    //Update the network option(edge length) according to the nodes count
    edgeDefaultOptions.length = this.network.body.data.nodes.length * 10;
    newLayoutOptions.edges = edgeDefaultOptions;
    newLayoutOptions.physics = physicsTrue.physics;
    this.network.setOptions(newLayoutOptions);

    //Update the state to modify the selection of modal
    this.setState({
      showStyleMenu : false,
      selectedStyle : selectedStyle
    });
  }

  networkNodeTypeSetVisible(isVisible){
    this.setState({
      showNodeSelectionMenu: isVisible,
    });
  }

  chooseNodeType(nodeType){

    let selectedNodeTypeStr = 'all';

    if (nodeType === 1)
      selectedNodeTypeStr = 'machine';
    else if (nodeType === 2)
      selectedNodeTypeStr = 'server';
    else if (nodeType === 3)
      selectedNodeTypeStr = 'domain';
    else if (nodeType === 4)
      selectedNodeTypeStr = 'website';


    let nodes = [];

    if (selectedNodeTypeStr === 'all') {
      nodes = Object.assign([], this.state.nodes);
    }
    else{
      this.state.nodes.forEach((nodeObject) => {
        if (nodeObject.type === selectedNodeTypeStr){
          nodes.push(nodeObject);
        }
      });
    }

    /*
    this.state.nodes.forEach((nodeObject) => {

      let node = this.network.body.data.nodes.get(nodeObject.id);
      if (selectedNodeTypeStr === 'all'){
        if (!node) {
          this.network.body.data.nodes.add(Object.assign({}, nodeObject));
        }
      }
      else{
        if (nodeObject.type === selectedNodeTypeStr){
          if (!node){
            this.network.body.data.nodes.add(nodeObject);
          }
        }
        else{
          if (node){
            this.network.body.data.nodes.remove({id: nodeObject.id});
          }
        }
      }

    });
     */

    //Update the network options(physics enable, improvedLayout) according to the nodes count
    if (nodes.length <= 10) {
      this.network.setOptions(physicsFalse);
      this.network.setOptions(improvedLayoutTrue);
    }
    else {
      this.network.setOptions(physicsTrue);

      if (nodes.length >= 100) {
        this.network.setOptions(improvedLayoutFalse);
      }
      else{
        this.network.setOptions(improvedLayoutTrue);
      }
    }

    //Update the network option(edge length) according to the nodes count
    let edgeLength = nodes.length * 10;
    edgeDefaultOptions.length = edgeLength;
    this.network.setOptions({
      nodes : nodeDefaultOptions,
      edges : edgeDefaultOptions
    });

    this.network.setData({nodes: nodes, edges: this.state.edges});
    this.resetAllNodesSize(this.network);

    this.setState({
      showNodeSelectionMenu : false,
      selectedNodeType : nodeType
    });
  }

  getEdgesOfNode(nodeId, network) {
    let edgesObj = network.body.data.edges;

    return edgesObj.get().filter(function (edge) {
      return edge.from === nodeId || edge.to === nodeId;
    });
  }

  resetAllNodesSize(network){
    this.state.nodes.forEach((nodeObject) => {
      let nodeID = nodeObject.id;

      let edgesCount = this.getEdgesOfNode(nodeID, network).length;
      let node = network.body.data.nodes.get(nodeID);

      if (node) //If exists on the network currently
        network.body.data.nodes.update({id: nodeID, size : 25 + edgesCount * 2});
    });

  }

  createNetworkGraph(networkData) {
    const that = this,
      {props} = this,
      {attributes} = props;

    networkGraphDefaultOptions.layout = applyHierarchicalNetwork
      ? Object.assign(networkGraphDefaultOptions.layout, hierarchicalNetwork)
      : networkGraphDefaultOptions.layout;

    networkGraphDefaultOptions.nodes = nodeDefaultOptions;
    networkGraphDefaultOptions.edges = edgeDefaultOptions;

    let options = Object.assign(networkGraphDefaultOptions,
      {
        height: (!isUndefined(attributes.canvasStyle.height))
          ? attributes.canvasStyle.height
          : networkGraphDefaultOptions.height
      }),

      network = new vis.Network(this.networkGraph, networkData, options);


    //Update the network options(physics enable, improvedLayout) according to the nodes count
    if (networkData.nodes.length <= 10) {
      network.setOptions(physicsFalse);
      network.setOptions(improvedLayoutTrue);
    }
    else {
      network.setOptions(physicsTrue);

      if (networkData.nodes.length >= 100) {
        network.setOptions(improvedLayoutFalse);
      }
      else{
        network.setOptions(improvedLayoutTrue);
      }
    }

    //Update the network option(edge length) according to the nodes count
    let edgeLength = networkData.nodes.length * 10;
    edgeDefaultOptions.length = edgeLength;
    network.setOptions({
      nodes : nodeDefaultOptions,
      edges : edgeDefaultOptions
    });

    this.resetAllNodesSize(network);


    network.on('selectNode', this.loadContextMenu(network, 'node'));
    network.on('selectEdge', this.loadContextMenu(network, 'edge'));
    network.on('deselectNode', this.deselectNode(network));
    network.on('deselectEdge', this.deselectEdge());

    network.on('click', this.onClickNetworkGraph());

    network.on('dragStart', this.loadContextMenu(network, 'node'));

    network.on('dragEnd', this.networkDragEnded());
    network.on('stabilized', this.stabilizedNetwork());

    document.getElementById('undo').onclick = this.undoOrResetGraph(network, 'undo');
    document.getElementById('reset').onclick = this.undoOrResetGraph(network, 'reset');
    document.getElementById('rescaleFit').onclick = this.reScaleGraph(network);
    document.getElementById('layoutChange').onclick = this.reLayoutGraph(network);
    document.getElementById('filterNode').onclick = this.filterNodeGraph(network);
    document.getElementById('zoomIn').onclick = this.zoomInGraph(network);
    document.getElementById('zoomOut').onclick = this.zoomOutGraph(network);

    this.network = network;
  }

  getGraphAndActions(data) {
    let networkData = { nodes: [], edges: [] };
    if (this.state.nodesListStatus === 'default') {
      let nodes = [],
        edges = [],
        nodesEdges = this.mergeMultipleGraphs(nodes, edges, data);
      this.state.nodes = nodesEdges.nodes;
      this.state.edges = nodesEdges.edges;
      this.state.originalNodesEdges = {
        nodes: Object.assign([], nodesEdges.nodes),
        edges: Object.assign([], nodesEdges.edges)
      };
      const actionsData = this.context.store.getState().actions;
      this.state.actionsData = getActionsByTypes(actionsData.list.actions);

      networkData = {
        nodes: nodesEdges.nodes,
        edges: nodesEdges.edges
      };
    }
    return networkData;
  }

  loadNetworkGraph(data, loadAgain, duration) {
    if ((duration.window && timeWindow.window !== duration.window) ||
        (duration.start && duration.end &&
        duration.start !== timeWindow.start && duration.end !== timeWindow.end)
      ) {
      this.state = {
        nodes: [],
        edges: [],
        previousNodesEdges: emptyNodesEdges,
        originalNodesEdges: emptyNodesEdges,
        duration: duration,
        alertDate: this.state.alertDate,
        isFetching: false, // This flag will get removed after started using fetchApiData function from props object
        showContextMenu: false,
        showUndoResetButtons: false,
        nodesListStatus: 'default',
        selectedNodeDetails: '',
        selectedNode: '',
        selectedNodesForExtendingGraph: [],
        actionsData: [],
        loaderText: '',
        loadAgain: true,
        sourceDetails: null,
        actions: ''
      };
      timeWindow = duration;
      this.nodeObjects = {};
      this.edgeObjects = {};
    }

    if (!loadAgain) {
      return;
    }

    if (!data) {
      return;
    }

    let networkData = this.getGraphAndActions(data);
    if (!isNull(this.networkGraph) && !isUndefined(this.networkGraph)) {
      if (networkData.nodes.length > 0) {
        this.createNetworkGraph(networkData);
        this.state.loadAgain = false;
      }
      else {
        document.getElementById('network-graph').innerHTML = 'No additional results were found.';
      }
    }
  }

  closeContextualMenu() {
    this.state.showContextMenu = false;
  }

  render() {

    const {props, state} = this;

    let data = props.data;
    if (props.data && props.params.assetId) {
      data = generateDataFromAssetDetails(data);
    }

    return (

        <div style={styles.graphWrap}>
          {
            state.isFetching
            ? <Loader loaderStyle={styles.loader} text={state.loaderText} />
            : null
          }

          <CanvasToolBar handleShowLabel={this.handleShowLabel.bind(this)}/>

          <div ref={(ref) => this.networkGraph = ref}
            style={props.attributes.canvasStyle}
            id='network-graph'>
            { this.loadNetworkGraph(data, state.loadAgain, props.duration) }
          </div>

          {
            state.actionsData && state.actionsData.length > 0
            ? <ContextualMenu
              showContextMenu={state.showContextMenu}
              sourceDetails={state.sourceDetails}
              nodeObjects={this.nodeObjects}
              edgeObjects={this.edgeObjects}
              alertDate={this.state.alertDate}
              selectedDetails={state.selectedNodeDetails}
              actions={state.actionsData}
              loadParent={this.loadGraph}
              doAction={this.extendGraph}
              style={props.attributes.canvasStyle} />
            : null
          }

          <NetworkStyleMenu showStyleMenu={state.showStyleMenu}
                            selectedStyle={state.selectedStyle}
                            networkStyleSetVisible={this.networkStyleSetVisible.bind(this)}
                            networkStyleSetLayout={this.networkStyleSetLayout.bind(this)}/>

          <NodeSelectionMenu showNodeSelectionMenu={state.showNodeSelectionMenu}
                             selectedNodeType={state.selectedNodeType}
                             networkNodeTypeSetVisible={this.networkNodeTypeSetVisible.bind(this)}
                             chooseNodeType={this.chooseNodeType.bind(this)}/>


        </div>
    );
  }
}

NetworkGraph.contextTypes = {
  store: React.PropTypes.object
};

export default NetworkGraph;
