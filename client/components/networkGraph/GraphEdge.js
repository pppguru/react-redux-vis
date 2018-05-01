import React from 'react';
import {Colors} from '../../../commons/colors';
import { DEFAULT_FONT } from 'Constants';

import { firstCharCapitalize, formatDateInLocalTimeZone } from '../../../commons/utils/utils';

function displayEdgeAsDashLine(type) {
  let dashes = false;
  switch (type) {
    case 'ioc':
      dashes = true;
      break;
    default:
      break;
  }
  return dashes;
}

function handleEdgeMetaData(metadata, edgeObject) {
  edgeObject.metadata = metadata;
  let edgeMetaData = [];
  for (let metadataType in metadata) {
    let metadataTypeLower = metadataType.toLowerCase();
    if (metadataTypeLower === 'date' || metadataTypeLower === 'datetime') {
      let dateTime = formatDateInLocalTimeZone(metadata[metadataType]);
      edgeObject.title += '<br />' + dateTime.date + ' ' + dateTime.time;
      edgeMetaData.push(<li key='date'> {dateTime.date} {dateTime.time}</li>);
    }
    else {
      edgeObject.title += '<br /><b>' + firstCharCapitalize(metadataType) + ':</b> ' +
        metadata[metadataType];
      edgeMetaData.push(
        <li key={metadataType}><b>{firstCharCapitalize(metadataType)}:</b> {metadata[metadataType]}</li>
      );
    }
  }
  return {
    edgeMetaData: edgeMetaData,
    edgeObject: edgeObject
  };
}

export function createEdgeObject(dataEdge, edgesInSameDirection) {
  let edgeObject = {
      id: dataEdge.id,
      notNodeId: dataEdge.id ? dataEdge.id : '',
      type: [],
      from: dataEdge.source,
      to: dataEdge.target,
      arrows: {
        to: {
          scaleFactor: 0.5
        }
      },
      arrowStrikethrough: false,
      label: dataEdge.label ? dataEdge.label + '\n\n\n' : '',
      title: dataEdge.label ? dataEdge.label : '',
      // length: 150,
      smooth: {
        type: 'discrete'
      },
      color: {
        inherit: 'from'
      },
      edgeDetails: [],
      actionData: dataEdge.actionData ? dataEdge.actionData : {}
    },
    edgesTypes = [];

  if (displayEdgeAsDashLine(dataEdge.type)) {
    edgeObject.dashes = true;
  }

  if (dataEdge.type) {
    edgeObject.type.push(dataEdge.type);
  }

  edgesTypes.push(
    <li key='1'>{edgesInSameDirection.length > 0 ? '1. ' : ''}{dataEdge.label}</li>
  );

  if (edgesInSameDirection.length > 0) {
    edgesInSameDirection.forEach((edgeInSameDirection, index) => {
      edgeObject.type.push(edgeInSameDirection.type);
      edgeObject.title += '<br />' + edgeInSameDirection.label;
      edgesTypes.push(
        <li key={index + 2}>{index + 2}. {edgeInSameDirection.label}</li>
      );
    });
  }

  let metaDataObject = handleEdgeMetaData(dataEdge.metadata, edgeObject);
  edgeObject = metaDataObject.edgeObject;

  edgeObject.edgeDetails.push(
    <ul className='no-list-style'>
      <li key='edgeType'><b>Edge Type:</b>
        <ol style={{padding: 0}}>
          {edgesTypes}
        </ol>
      </li>
      <li key='source'><b>Source:</b> {dataEdge.source}</li>
      <li key='target'><b>Target:</b> {dataEdge.target}</li>
      {metaDataObject.edgeMetaData}
    </ul>
  );

  return edgeObject;
}
