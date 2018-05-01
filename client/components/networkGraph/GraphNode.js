import React from 'react';
import {Colors} from '../../../commons/colors';
import {Fonts} from '../../../commons/fonts';
import { DEFAULT_FONT } from 'Constants';

import {
  firstCharCapitalize,
  isUndefined,
  isNull,
  whatIsIt,
  formatDateInLocalTimeZone
} from '../../../commons/utils/utils';

import {getCountryName} from '../../../commons/utils/countryUtils';
import {getIcon, getIconSelected} from './GraphUtils';

function addNewlines(str) {
  let char = 15;
  if (str.length > char) {
    let result = '';
    while (str.length > 0) {
      result += str.substring(0, char) + '\n  ';
      str = str.substring(char);
    }
    return result;
  }
  return str;
}

function parseReputationText(values, newLine, value) {
  let {label, title, nodeDetails} = value,
    {newLine1, newLine2} = newLine;

  values.forEach((data) => {
    newLine1 = (label === '') ? '' : '\n  ';
    newLine2 = (label === '') ? '' : '<br />';

    for (let valueType in data) {
      if (valueType === 'reputation') {
        if ((data[valueType]).length > 0) {
          let newLine = {
              newLine1: newLine1,
              newLine2: newLine2
            },
            value = {
              label: label,
              title: title,
              nodeDetails: nodeDetails
            },
            reputationText = createReputationText(data[valueType], newLine, value);
          label = reputationText.label;
          title = reputationText.title;
          nodeDetails = reputationText.nodeDetails;
        }
      }
      else {
        title += newLine2 + '<b>Reputation ' + firstCharCapitalize(valueType) + ':</b> ' +
          data[valueType] + '<br />';
        nodeDetails += newLine2 + 'Reputation ' + firstCharCapitalize(valueType) + ': ' +
          data[valueType] + '<br />';
      }
    }
  });
  return {
    label: label,
    title: title,
    nodeDetails: nodeDetails
  };
}

function createReputationText(values, newLine, value) {
  let {label, title, nodeDetails} = value,
    value1 = '',
    value2 = '',
    {newLine1, newLine2} = newLine,
    newLine3 = ',\n  ',
    newLine4 = ',<br />';

  values.forEach((data) => {
    newLine1 = (label === '') ? '' : '\n  ';
    newLine2 = (label === '') ? '' : '<br />';
    newLine3 = (value1 === '') ? '' : ',\n  ';
    newLine4 = (value1 === '') ? '' : ',<br />';
    value1 += newLine3 + data;
    value2 += newLine4 + data;
  });

  label += newLine1 + 'Reputation: ' + value1;
  title += newLine2 + '<b>Reputation:</b> ' + value2;
  nodeDetails += newLine2 + 'Reputation: ' + value2;
  return {
    label: label,
    title: title,
    nodeDetails: nodeDetails
  };
}

function handleReputationMetaData(parameters) {
  let {values, nodeStatus, nodeObject, newLine} = parameters,
    {newLine1, newLine2} = newLine,
    label = '',
    title = '',
    nodeDetails = '';

  if (!isUndefined(values)) {
    if (!isUndefined(values.reputation) && (values.reputation).length > 0 && whatIsIt(values.reputation) === 'Array') {
      let newLine = {
          newLine1: newLine1,
          newLine2: newLine2
        },
        value = {
          label: label,
          title: title,
          nodeDetails: nodeDetails
        },
        reputationText = createReputationText(values.reputation, newLine, value);
      label = reputationText.label;
      title = reputationText.title;
      nodeDetails = reputationText.nodeDetails;
    }

    if (!isUndefined(values[0]) && !isUndefined(values[0].reputation) &&
      whatIsIt(values[0].reputation) === 'Array') {
      let newLine = {
          newLine1: newLine1,
          newLine2: newLine2
        },
        value = {
          label: label,
          title: title,
          nodeDetails: nodeDetails
        },
        reputationText = parseReputationText(values, newLine, value);
      label = reputationText.label;
      title = reputationText.title;
      nodeDetails = reputationText.nodeDetails;
    }
  }
  nodeStatus = 'safe';

  if (label !== '') {
    let key = 'nodeDetails_' + nodeObject.id;
    nodeObject.label += newLine1 + label;
    nodeObject.title += newLine2 + title;
    if (nodeDetails.includes('<br />')) {
      let tempNodeDetails = nodeDetails.split('<br />');
      tempNodeDetails.forEach((nodeDetail, index) => {
        key = key + '_' + index;
        nodeObject.nodeDetails.push(<li key={key}>{nodeDetail}</li>);
      });
    }
    else {
      nodeObject.nodeDetails.push(<li key={key}>{nodeDetails}</li>);
    }

    nodeStatus = (label.includes('Scanning Host')) ? 'scan' : 'malicious';
  }

  return {
    nodeObject: nodeObject,
    nodeStatus: nodeStatus
  };
}

function handleNodeMetaData(metadata, nodeObject) {
  let nodeStatus = 'safe',
    isNameDisplayed = false;
  nodeObject.metadata = metadata;
  for (let metadataType in metadata) {
    let metadataTypeLower = metadataType.toLowerCase(),
      newLine1 = '\n  ',
      newLine2 = '<br />';

    metadataTypeLower = (metadataTypeLower === 'date' ||
      metadataTypeLower === 'start_date' ||
      metadataTypeLower === 'end_date')
    ? 'date'
    : metadataTypeLower;

    metadataTypeLower = (nodeObject.type === 'anomaly' && metadataTypeLower === 'date')
      ? 'anomalyDate'
      : nodeObject.type === 'anomaly' && (metadataTypeLower === 'start_date' || metadataTypeLower === 'end_date')
        ? 'date'
        : nodeObject.type !== 'anomaly' &&
          (metadataTypeLower === 'date' || metadataTypeLower === 'start_date' || metadataTypeLower === 'end_date')
          ? 'date'
          : metadataTypeLower;

    let displayMetaData = (metadataTypeLower !== '' &&
      metadataTypeLower !== 'coordinates' &&
      metadataTypeLower !== 'multiple');

    if (displayMetaData) {
      switch (metadataTypeLower) {
        case 'reputation':
          let parameters = {
              values: metadata[metadataType],
              nodeStatus: nodeStatus,
              nodeObject: nodeObject,
              newLine: {
                newLine1: newLine1,
                newLine2: newLine2
              }
            },
            tempObject = handleReputationMetaData(parameters);

          nodeObject = tempObject.nodeObject;
          nodeStatus = tempObject.nodeStatus;
          break;
        case 'country':
          nodeObject.label += newLine1 +
            getCountryName[metadata[metadataType]];
          nodeObject.title += newLine2 + '<b>' + firstCharCapitalize(metadataType) + ':</b> ' +
            getCountryName[metadata[metadataType]];
          nodeObject.nodeDetails.push(<li key={metadataType}><b>{firstCharCapitalize(metadataType)}:</b>
            &nbsp;{getCountryName[metadata[metadataType]]}</li>);
          break;
        case 'anomalyDate':
          let dateTimeAnomaly = formatDateInLocalTimeZone(metadata[metadataType]),
            time = nodeObject.type === 'anomaly' ? '' : ' ' + dateTimeAnomaly.time;
          nodeObject.label += newLine1 + dateTimeAnomaly.date + time;
          if (nodeObject.type === 'anomaly' &&
            ((!isUndefined(metadata.multiple) && !metadata.multiple) || isUndefined(metadata.multiple))) {
            nodeObject.title += newLine2 + dateTimeAnomaly.date + time;
          }
          nodeObject.nodeDetails.push(
            <li key={metadataType}>{dateTimeAnomaly.date}{time}</li>
          );
          break;
        case 'date':
          let dateTime = formatDateInLocalTimeZone(metadata[metadataType]);
          nodeObject.label += newLine1 + firstCharCapitalize(metadataType) + ': ' +
            dateTime.date + ' ' + dateTime.time;
          nodeObject.title += newLine2 + '<b>' + firstCharCapitalize(metadataType) + ':</b> ' +
            dateTime.date + ' ' + dateTime.time;
          nodeObject.nodeDetails.push(
            <li key={metadataType}><b>{firstCharCapitalize(metadataType)}:</b> {dateTime.date} {dateTime.time}</li>
          );
          break;
        case 'displayname':
          if (!isNameDisplayed) {
            nodeObject.title += newLine2 + '<b>Name:</b> ' + metadata[metadataType];
            nodeObject.nodeDetails.push(<li key={metadataType}><b>Name:</b> {metadata[metadataType]}</li>);
            isNameDisplayed = true;
          }
          break;
        default:
          if (isNameDisplayed && metadataTypeLower === 'name') {
            break;
          }
          if (metadataTypeLower === 'title') {
            nodeObject.label += newLine1 + firstCharCapitalize(metadataType) + ': ' +
              addNewlines(metadata[metadataType]);
          }
          if (whatIsIt(metadata[metadataType]) === 'Array') {
            let metadataArray = metadata[metadataType];
            nodeObject.title += newLine2 + '<b>' + firstCharCapitalize(metadataType) + '</b>:';
            nodeObject.nodeDetails.push(
              <li key={metadataType}><b>{firstCharCapitalize(metadataType)}:</b></li>
            );
            metadataArray.forEach((value, index) => {
              nodeObject.title += newLine2 + value;
              nodeObject.nodeDetails.push(
                <li key={metadataType + index}>{index + 1}. {value}</li>
              );
            });
          }
          else {
            nodeObject.title += newLine2 + '<b>' + firstCharCapitalize(metadataType) + ':</b> ' +
              metadata[metadataType];
            nodeObject.nodeDetails.push(
              <li key={metadataType}><b>{firstCharCapitalize(metadataType)}:</b> {metadata[metadataType]}</li>
            );
          }
          if (metadataTypeLower === 'name') {
            isNameDisplayed = true;
          }
          break;
      }
    }
  }

  nodeObject.status = nodeStatus;

  return {
    nodeObject: nodeObject,
    nodeStatus: nodeStatus
  };
}

export default class GraphNode {
  constructor(node) {
    let nodeId = node.nodeId ? node.nodeId : '',
      idDisplay = node.label ? node.label : (node.id ? node.id : node.nodeId),
      nodeType = node.type ? node.type : '';

    if (node.type === 'country') {
      idDisplay = (!isUndefined(getCountryName[idDisplay]))
      ? getCountryName[idDisplay]
      : idDisplay;
    }
    else if (node.type === 'time') {
      let dateTime = formatDateInLocalTimeZone(idDisplay);
      idDisplay = dateTime.date + ' ' + dateTime.time;
    }

    let nodeObject = {
      id: nodeId,
      notNodeId: node.id ? node.id : '',
      type: nodeType,
      label: '  ' + idDisplay,
      title: '<b>' + node.nodeTypeDisplay + ':</b> ' + idDisplay,
      nodeDetails: [],
      actions: (!isNull(node.actions) && !isUndefined(node.actions)) ? node.actions : [],
      color: {
        border: Colors.networkNode.border,
        background: Colors.white
      },
      actionData: node.actionData ? node.actionData : {}
    };


    nodeObject.image = {
      unselected : getIcon(nodeType),
      selected : getIconSelected(nodeType)
    };

    nodeObject.nodeDetails.push(<li key='nodeId'><b>{node.nodeTypeDisplay}:</b> {idDisplay}</li>);

    let metaDataObject = handleNodeMetaData(node.metadata, nodeObject),
      nodeStatus = metaDataObject.nodeStatus;
    nodeObject = metaDataObject.nodeObject;

    if (node.type === 'anomaly' || nodeStatus === 'malicious') {
      nodeObject.color.border = Colors.networkNode.hoverBorderColor;
    }
    else if (nodeStatus == 'scan'){
      nodeObject.color.border = Colors.networkNode.scanOrangeColor;
    }

    return nodeObject;
  }
}

export function createNodeObject(node) {
  let nodeId = node.nodeId ? node.nodeId : '',
    idDisplay = node.label ? node.label : (node.id ? node.id : node.nodeId),
    nodeType = node.type ? node.type : '';

  if (node.type === 'country') {
    idDisplay = (!isUndefined(getCountryName[idDisplay]))
      ? getCountryName[idDisplay]
      : idDisplay;
  }
  else if (node.type === 'time') {
    let dateTime = formatDateInLocalTimeZone(idDisplay);
    idDisplay = dateTime.date + ' ' + dateTime.time;
  }

  let nodeObject = {
    id: nodeId,
    notNodeId: node.id ? node.id : '',
    type: nodeType,
    label: '  ' + idDisplay,
    title: '<b>' + node.nodeTypeDisplay + ':</b> ' + idDisplay,
    nodeDetails: [],
    actions: (!isNull(node.actions) && !isUndefined(node.actions)) ? node.actions : [],
    color: {
      border: Colors.networkNode.border,
      background: Colors.white
    },
    actionData: node.actionData ? node.actionData : {}
  };

  nodeObject.image = {
    unselected : getIcon(nodeType),
    selected : getIconSelected(nodeType)
  };

  nodeObject.nodeDetails.push(<li key='nodeId'><b>{node.nodeTypeDisplay}:</b> {idDisplay}</li>);

  let metaDataObject = handleNodeMetaData(node.metadata, nodeObject),
    nodeStatus = metaDataObject.nodeStatus;
  nodeObject = metaDataObject.nodeObject;

  if (node.type === 'anomaly' || nodeStatus === 'malicious') {
    nodeObject.color.border = Colors.networkNode.hoverBorderColor;
  }
  else if (nodeStatus == 'scan'){
    nodeObject.color.border = Colors.networkNode.scanOrangeColor;
  }

  return nodeObject;
}
