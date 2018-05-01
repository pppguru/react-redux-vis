import React from 'react';
import {whatIsIt, isEmpty} from '../../../commons/utils/utils';

const styles = {
  key: {
    fontWeight: 'bold',
    marginBottom: '2px',
    marginRight: '2px'
  }
};

export class JsonWidget extends React.Component {
  constructor(props) {
    super(props);
    this.key = 0;
  }

  formatJson(rawJson, objName, formattedJson) {
    let jsonType = whatIsIt(rawJson);
    switch (jsonType) {
      case 'Object':
        for (let obj in rawJson) {
          let tempObj = objName !== '' ? objName + '.' + obj : obj;
          this.formatJson(rawJson[obj], tempObj, formattedJson);
        }
        break;
      case 'Array':
        rawJson.forEach((obj, index) => {
          let tempObj = objName !== '' ? objName : '';
          this.formatJson(obj, tempObj, formattedJson);
        });
        break;
      case 'String':
      case 'Number':
        let value = rawJson;
        if (rawJson === true) {
          value = 'true';
        }
        else if (rawJson === false) {
          value = 'false';
        }

        if (!isEmpty(value)) {
          formattedJson.push(
            <span key={this.key}>
              <span style={styles.key}>{objName !== '' ? ' ' + objName + ': ' : ''}</span>
              {value}
            </span>
          );
          this.key++;
        }
        break;
      default:
        console.log('Json is not in correct format.');
        break;
    }
    return formattedJson;
  }

  getJson() {
    const {props} = this,
      json = this.formatJson(props.data, '', []);
    return json;
  }

  render() {
    return (
      <div>{this.getJson()}</div>
    );
  }
}

export default JsonWidget;
