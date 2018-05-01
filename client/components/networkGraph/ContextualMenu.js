import React, {PropTypes} from 'react';
import { Colors } from '../../../commons/colors';
import { isUndefined, firstCharCapitalize, whatIsIt } from '../../../commons/utils/utils';
import { DEFAULT_FONT } from 'Constants';

import 'styles/_contextualMenu.scss';

const styles = {
  contextualMenu: {
    width: '260px',
    backgroundColor: Colors.white,
    border: `1px solid ${Colors.border}`,
    position: 'absolute',
    top: '50px',
    right: '40px',
    height: '306px',
    boxShadow: `1px 1px 1px 1px ${Colors.shadow}`
  },
  clearIcon: {
    position: 'absolute',
    top: '-35px',
    right: 0,
    cursor: 'pointer',
    fontWeight: '600'
  },
  arrowIcon: {
    width: '24px',
    alignSelf: 'flex-start',
    transform: 'rotate(-90deg)'
  },
  list: {
    listStyleType: 'none',
    padding: 0,
    margin: 0,
    fontSize: '13px',
    height: '306px',
    overflowY: 'auto'
  },
  item: {
    cursor: 'pointer',
    borderBottom: `1px solid ${Colors.border}`
  },
  userInput: {
    margin: '0 15px'
  },
  inputWrap: {
    display: 'flex',
    height: '24px',
    marginBottom: '15px',
    color: Colors.text
  },
  inputLabel: {
    lineHeight: '24px',
    flexGrow: '1'
  },
  input: {
    marginLeft: '10px',
    flexGrow: '2'
  },
  wrapItem: {
    display: 'flex',
    padding: '15px 15px 15px 10px',
    minHeight: '59px'
  },
  itemContent: {
    display: 'flex'
  },
  actionIcon: {
    marginRight: '10px'
  },
  collapseContextualMenu: {
    position: 'absolute',
    left: '25px',
    bottom: '25px'
  },
  expandContextualMenu: {
    position: 'absolute',
    bottom: '25px',
    right: '25px',
    display: 'none'
  },
  selectedDetails: {
    margin: '0px 24px',
    width: '90%',
    color: Colors.garnet,
    fontSize: '13px',
    fontFamily: DEFAULT_FONT,
    overflowWrap: 'break-word',
    paddingRight: '20px',
    paddingBottom: '20px'
  },
  notificationMessage: {
    top: 0,
    right: '260px',
    fontSize: '16px',
    position: 'absolute',
    padding: '20px',
    backgroundColor: Colors.notificationMessageBG,
    color: Colors.garnet,
    display: 'none'
  },
  actionTable: {
    border: '0',
    width: '260px',
    cellPadding: '10',
    cellSpacing: '10'
  }
};

function getActions(actions, data, type) {
  if ((data.nodeType).toLowerCase() === type.toLowerCase()) {
    actions = Object.assign(actions, data.actions);
  }
  return actions;
}

function checkForUserInputs(parameters) {
  let userInputParameters = [];
  if (!isUndefined(parameters.length)) {
    parameters.forEach((parameter) => {
      let tempObj = {};
      if (parameter.userInput === true) {
        tempObj.name = parameter.name;
        userInputParameters.push(tempObj);
      }
    });
  }
  return userInputParameters;
}

class ContextualMenu extends React.Component {
  static propTypes = {
    actions: PropTypes.array.isRequired,
    showContextMenu: PropTypes.bool.isRequired,
    sourceDetails: PropTypes.object
  }

  constructor(props) {
    super(props);

    this.getContextMenu = this.getContextMenu.bind(this);
    this.displayActions = this.displayActions.bind(this);
    this.generateParameters = this.generateParameters.bind(this);
    this.createHTML = this.createHTML.bind(this);
    this.close = this.close.bind(this);
    this.doAction = this.doAction.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);

    this.state = {
      showInput: [],
      showContextMenu: props.showContextMenu,
      clicked: ''
    };
  }

  componentWillReceiveProps(nextProps) {
    const {props} = this;

    let state = { showContextMenu: nextProps.showContextMenu };
    if (nextProps && nextProps.sourceDetails && props.sourceDetails) {
      if (nextProps.sourceDetails.itemId !== props.sourceDetails.itemId) {
        state.clicked = '';
      }
    }
    this.setState(state);
  }

  getContextMenu(sourceDetails) {
    if (!sourceDetails) return null;

    let {props} = this,
      {nodeObjects} = props,
      actionsData = props.actions,
      actions = [],
      {itemId, itemType} = sourceDetails;

    actionsData.forEach((data) => {
      if (whatIsIt(itemType) === 'String') {
        actions = getActions(actions, data, itemType);
      }
      else if (whatIsIt(itemType) === 'Array') {
        itemType.forEach((type) => {
          actions = getActions(actions, data, type);
        });
      }
    });

    // Append the actions associated with nodes
    if (!isUndefined(nodeObjects[itemId]) &&
        !isUndefined(nodeObjects[itemId].actions) &&
        nodeObjects[itemId].actions.length > 0) {
      actions = Object.assign(actions, nodeObjects[itemId].actions);
    }

    return this.displayActions(actions, sourceDetails);
  }

  displayActions(actions, sourceDetails) {
    let {itemId, itemType, contextMenuType} = sourceDetails;
    let arr = [];
    actions.forEach((action, index) => {
      const details = {
          parameters: action.parameters,
          index,
          itemId,
          itemType,
          notNodeId: sourceDetails.notNodeId ? sourceDetails.notNodeId : '',
          contextMenuType
        },
        parameters = this.generateParameters(details);

      const updatedDetails = {
        actions,
        index,
        parameters,
        sourceDetails
      };

      arr.push(this.createHTML(updatedDetails));
    });

    return <ul style={styles.list}>{arr}</ul>;
  }

  generateParameters(details) {
    let {parameters, index, itemId, itemType, notNodeId, contextMenuType} = details,
      parametersToApi = [],
      userInputParameters = [],
      fullMalwareReportLink = '';

    if (!isUndefined(parameters.length)) {
      parameters.forEach((parameter) => {
        let tempObj = {};
        if (parameter.userInput === false && parameter.name !== 'link') {
          let params = {
            name: parameter.name,
            value: parameter.value,
            itemId,
            itemType,
            notNodeId,
            contextMenuType
          };
          tempObj.name = parameter.name;
          tempObj.value = this.getParameterValue(params);

          tempObj.userInput = false;
          parametersToApi.push(tempObj);
        }
        if (parameter.userInput === true) {
          tempObj.name = parameter.name;
          tempObj.id = parameter.name + index;
          tempObj.value = '';
          tempObj.userInput = true;
          parametersToApi.push(tempObj);
        }
        if (parameter.name === 'link') {
          fullMalwareReportLink = !isUndefined(parameter.value)
          ? parameter.value : '';
        }
      });

      userInputParameters = checkForUserInputs(parameters);
    }
    return {
      parametersToApi,
      userInputParameters,
      fullMalwareReportLink
    };
  }

  getParameterValue(params) {
    let {name, value, itemId, itemType, notNodeId, contextMenuType} = params;
    if (isUndefined(value)) {
      let {props} = this,
        {nodeObjects, edgeObjects} = props,
        parameterName = ((name).includes('metadata')) ? 'metadata' : name;

      parameterName = ((name).includes('actionData')) ? 'actionData' : parameterName;

      value = '';
      switch (parameterName) {
        case 'id':
          value = notNodeId;
          break;
        case 'nodeId':
          value = itemId;
          break;
        case 'type':
          value = itemType;
          break;
        case 'date':
          value = props.alertDate;
          break;
        case 'ip':
          if (itemType.toLowerCase() === 'internal_ip' || itemType.toLowerCase() === 'external_ip') {
            value = itemId;
          }
          break;
        case 'source.id':
          if (!isUndefined(edgeObjects[itemId])) {
            value = edgeObjects[itemId].from;
          }
          break;
        case 'target.id':
          if (!isUndefined(edgeObjects[itemId])) {
            value = edgeObjects[itemId].to;
          }
          break;
        case 'metadata':
          let paramName = (name).replace('metadata.', ''),
            metadataValue = '';

          if (contextMenuType === 'node') {
            metadataValue = (!isUndefined(nodeObjects[itemId]) && !isUndefined(nodeObjects[itemId].metadata))
              ? nodeObjects[itemId].metadata[paramName]
              : '';
          }
          else if (contextMenuType === 'edge') {
            metadataValue = (!isUndefined(edgeObjects[itemId]) && !isUndefined(edgeObjects[itemId].metadata))
              ? edgeObjects[itemId].metadata[paramName]
              : '';
          }
          value = (!isUndefined(metadataValue)) ? metadataValue : '';
          break;
        case 'actionData':
          let actionParamName = (name).replace('actionData.', ''),
            actiondataValue = '';

          if (contextMenuType === 'node') {
            actiondataValue = (!isUndefined(nodeObjects[itemId]) && !isUndefined(nodeObjects[itemId].actionData))
              ? nodeObjects[itemId].actionData[actionParamName]
              : '';
          }
          else if (contextMenuType === 'edge') {
            actiondataValue = (!isUndefined(edgeObjects[itemId]) && !isUndefined(edgeObjects[itemId].actionData))
              ? edgeObjects[itemId].actionData[actionParamName]
              : '';
          }
          value = (!isUndefined(actiondataValue)) ? actiondataValue : '';
          break;
        default:
          break;
      }
    }
    return value;
  }

  doAction(paramLen, sourceDetails, actionDetails, actionId) {
    const {props} = this,
      that = this;

    if (paramLen > 0) {
      return function() {
        const input = [...that.state.showInput];
        input.push(actionId);
        that.setState({showInput: input});
      };
    }
    else {
      return function() {
        that.setState({clicked: actionId});
        props.doAction(sourceDetails, actionDetails)();
      };
    }
  }

  handleKeyPress = (event) => {
    const {props} = this;
    if (event.key === 'Enter') {
      props.doAction(this.sourceDetails, this.actionDetails)();
    }
  }

  getInputs(userInputParameters, sourceDetails, actionDetails) {
    return userInputParameters.map((input, index) => {
      this.sourceDetails = sourceDetails;
      this.actionDetails = actionDetails;

      const text = firstCharCapitalize(input.name);
      return (
        <div key={`input${index}`} style={styles.inputWrap}>
          <label style={styles.inputLabel}>{text} :</label>
          <input type='text'
            id={`${input.name}${index}`}
            style={styles.input}
            onKeyPress={this.handleKeyPress} />
        </div>
      );
    });
  }

  createHTML(details) {
    const {state} = this,
      {actions, index, parameters, sourceDetails} = details,
      {parametersToApi, userInputParameters, fullMalwareReportLink} = parameters,
      actionId = 'action' + index;

    let reportId = (!isUndefined(actions[index].reportId)) ? actions[index].reportId
      : (!isUndefined(actions[index].name) ? actions[index].name : ''),
      actionDetails = {
        reportId,
        parameters: parametersToApi,
        actionsCount: actions.length,
        actionId,
        actionLabel: actions[index].label,
        fullMalwareReportLink: fullMalwareReportLink,
        actionType: actions[index].actionType
      };

    const inputStyle = {...styles.userInput, display: 'none'};
    if (state.showInput.includes(actionId)) {
      inputStyle.display = 'block';
    }

    const className = state.clicked === actionId ? 'clicked' : '';
    let li = (
      <li style={styles.item}
        id={actionId}
        key={actionId}
        className={className}
        onClick={this.doAction(userInputParameters.length, sourceDetails, actionDetails, actionId)}>
        <div style={styles.wrapItem}>
          <i style={styles.arrowIcon} className='material-icons'>
            arrow_drop_down
          </i>

          <div style={styles.itemContent}>
            {actions[index].label}

            {
              userInputParameters.length > 0
                ? (
                  <i className='material-icons'>
                    arrow_drop_down
                  </i>
                )
                : null
            }
          </div>
        </div>
        <div style={inputStyle}>
          {this.getInputs(userInputParameters, sourceDetails, actionDetails)}
        </div>
      </li>
    );

    return li;
  }

  close() {
    this.setState({
      showContextMenu: false,
      clicked: ''
    });
  }

  render() {
    const {props, state} = this;
    let contextMenuStyle = {display: state.showContextMenu ? 'block' : 'none'};

    return (
      <div style={styles.wrap}>
        <div ref={(ref) => this.contextualMenu = ref}
          style={{...styles.contextualMenu, ...contextMenuStyle}}
          id='contextual-menu'
          className='context-menu'>
          {this.getContextMenu(props.sourceDetails)}

          <i style={styles.clearIcon}
            className='material-icons'
            onClick={this.close}>
            clear
          </i>
        </div>

        <div style={{...styles.notificationMessage}} id='notification-message' />
      </div>
    );
  }
}

export default ContextualMenu;
