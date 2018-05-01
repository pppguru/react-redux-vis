import React, {PropTypes} from 'react';
import Area2DAsSparkLineChart from 'components/charts/Area2DAsSparkLineChart';

import {Colors} from '../../commons/colors';
import {getCountryCode} from '../../commons/utils/countryUtils';
import { getQueryParamsForDetails } from 'utils/utils';

const styles = {
  list: {
    marginLeft: '-30px',
    marginRight: '-30px'
  },
  header: {
    fontSize: '14px',
    paddingBottom: '16px'
  },
  wrap: {
    listStyleType: 'none',
    padding: 0,
    margin: 0,
    fontSize: '13px'
  },
  row: {
    display: 'flex'
  },
  elm: {
    padding: '15px'
  },
  oddRow: {
    background: Colors.subHeadingBG
  }
};

function loadComponent(column) {
  switch (column.type) {
    case 'chart':
      return loadChartComponent(column);
    default:
      break;
  }
}

function loadChartComponent(column) {
  let {chart, data, duration} = column;
  if (column.chart) {
    switch (column.chart.type) {
      case 'area2d':
        return (
          <Area2DAsSparkLineChart chart={chart} data={data} duration={duration} />
        );
      default:
        break;
    }
  }
}

function loadText(data) {
  return (
    <div>
      {data.map((text, index) => {
        return (
          <div key={`column${index}`}>
            {
              text.header
              ? <span style={styles.header}>{text.header + ': '}</span>
              : null
            }
            { /* The following condition checks
              if header not exists and it is a first row in that column and
              it is having multiple rows in that column,
              then 'header' style should apply to that text otherwise display it as normal text. */ }
            {
              !text.header && index === 0 && data.length > 1
              ? <span style={styles.header}>{text.value}</span>
              : text.value + ' '
            }
            {
              text.header && text.header === 'Country'
              ? displayCountryFlag(text)
              : null
            }
          </div>
        );
      })}
    </div>
  );
}

function displayCountryFlag(data) {
  let countryFlag = getCountryCode[data.value];
  countryFlag = countryFlag ? 'flag-icon flag-icon-' + countryFlag.toLowerCase() : '';
  return (
    <span className={countryFlag} rel='tooltip' title={data.value} />
  );
}

export class List extends React.Component {
  constructor(props) {
    super(props);
    this.handleRowClick = this.handleRowClick.bind(this);
  }

  static propTypes = {
    attributes: PropTypes.object,
    tableOptions: PropTypes.object,
    data: PropTypes.object,
    showDetailsTable: PropTypes.func
  }

  handleRowClick(tableRow, index) {
    const {props} = this,
      {showDetailsTable} = props;

    return () => {
      if (props.details && props.details.meta) {
        const queryParams = getQueryParamsForDetails(props.details.meta.queryParams, { tableRow });
        showDetailsTable(queryParams);
      }
      else {
        showDetailsTable(tableRow.dataObj);
      }
    };
  }

  getRow(row, id) {
    const {props} = this;

    return row.columns.map((column, indexCol) => {
      column = Object.assign({}, column, {
        key: `td${id}${indexCol}`,
        duration: props.duration
      });

      let style = column.type === 'text' ? { ...column.style, 'wordBreak': 'break-all' } : { ...column.style };
      style = Object.assign(style, styles.elm);

      return (
        <div style={style} key={column.key}>
          {
            column.type === 'text'
              ? loadText(column.data)
              : loadComponent(column)
          }
        </div>
      );
    });
  }

  getHeader(normalizeData) {
    const [row] = normalizeData;
    if (!row) return null;

    return <li style={styles.row}>
      {
        row.columns.map(col => {
          const head = col.name,
            style = Object.assign({}, styles.header, styles.elm, col.style);

          return <div style={style} key={head}>{head}</div>;
        })
      }
    </li>;
  }

  loadList() {
    const {props} = this;
    if (!props.data) { return; }

    const {data, attributes} = props,
      {tableJson: {options}, normalizeData} = data,
      id = attributes.id;

    const rowStyle = styles.row;
    if (options.rowClickable) {
      rowStyle.cursor = 'pointer';
    }

    return (
      <ul id={id} style={styles.wrap}>
        {this.getHeader(normalizeData) }

        {
          normalizeData.map((row, index) => {
            let style = Object.assign({}, rowStyle);
            if (index % 2 === 0) {
              style = Object.assign({}, rowStyle, styles.oddRow);
            }

            return (
              <li onClick={this.handleRowClick(row, index)}
                style={style}
                key={`tr${id}${index}`}>
                {this.getRow(row, id)}
              </li>
            );
          })
        }
      </ul>
    );
  }

  render() {
    return (
      <div style={styles.list}>
        {this.loadList()}
      </div>
    );
  }
}

List.contextTypes = {
  clickThrough: React.PropTypes.func
};

export default List;
