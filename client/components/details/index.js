import React, {PropTypes} from 'react';
import { Tabs, Tab } from 'material-ui/Tabs';
import {Colors} from '../../../commons/colors';
import {whatIsIt} from '../../../commons/utils/utils';
import JsonWidget from '../widgets/JsonFlatWidget';

import Reactable from 'reactable';
const {Table, Tr, Td} = Reactable;

import './_details.scss';

const styles = {
    wrap: {
      backgroundColor: Colors.white,
      width: '100%',
      overflow: 'auto'
    },
    table: {
      width: '100%'
    },
    noData: {
      fontSize: '18px',
      marginLeft: '30px'
    }
  },
  fetchLimit = 100;

export default class DetailsTable extends React.Component {
  static propTypes = {
    style: PropTypes.object,
    detailsData: PropTypes.object,
    details: PropTypes.object,
    data: PropTypes.object,
    fetchNextSetOfData: PropTypes.func,
    updateRoute: PropTypes.func,
    apiObj: PropTypes.object
  }

  constructor(props) {
    super(props);
    this.state = {
      paginationDetails: {
        detailsData: {},
        currentPage: 0,
        lastPage: 0,
        paginateRequest: 0
      }
    };
    this.onPageChange = this.onPageChange.bind(this);
    this.handleRowClick = this.handleRowClick.bind(this);
  }

  componentWillReceiveProps(newProps) {
    if (newProps.detailsData &&
      newProps.detailsData.next === fetchLimit) {
      this.state.paginationDetails.currentPage = 0;
    }
  }

  getData(data) {
    const {columns, rows} = data;
    let list = [],
      hiddenList = [],
      headers = [],
      hiddenHeaders = [];
    columns.forEach((column, index) => {
      if (column.hidden === false) {
        headers.push({name: column.displayName, index});
      }
      hiddenHeaders.push({name: column.displayName, fieldName: column.name, index});
    });

    rows.forEach((row, index) => {
      let cols = [],
        hiddenCols = [];
      headers.forEach((header) => {
        row.forEach((value, colIndex) => {
          if (header.index === colIndex) {
            cols.push({name: header.name, value});
          }
        });
      });
      hiddenHeaders.forEach((header) => {
        row.forEach((value, colIndex) => {
          if (header.index === colIndex) {
            hiddenCols.push({name: header.name, value});
          }
        });
      });
      list.push(cols);
      hiddenList.push(hiddenCols);
    });

    return {
      list,
      headers,
      hiddenList
    };
  }

  onPageChange(page) {
    const {props} = this;
    let {apiObj} = props,
      {detailsData, lastPage} = this.state.paginationDetails,
      currentPage = page + 1;
    if (currentPage === lastPage &&
      detailsData.total > fetchLimit &&
      detailsData.total > detailsData.rows.length) {
      this.state.paginationDetails = Object.assign({}, this.state.paginationDetails, {
        currentPage: page,
        paginateRequest: this.state.paginationDetails.paginateRequest + 1
      });
      apiObj.api.queryParams = Object.assign({}, apiObj.api.queryParams, {
        from: detailsData.next
      });
      apiObj = {...apiObj, isDetails: true};
      props.fetchNextSetOfData(apiObj, detailsData);
    }
  }

  handleRowClick(row, index) {
    return () => {
      const {props: {details, updateRoute}} = this,
        {secondaryClick} = details;

      if (!secondaryClick) {
        return;
      }

      const {page, pathParams} = secondaryClick;
      let url = '/' + page;
      if (pathParams) {
        for (let param in pathParams) {
          row.forEach((col) => {
            let paramName = pathParams[param];
            if (paramName.includes(':fieldName')) {
              paramName = pathParams[param].replace(':fieldName', '');
              if (col.name === paramName) {
                url += '/' + col.value;
              }
            }
            else {
              url += '/' + pathParams[param];
            }
          });
        }
      }
      updateRoute(url);
    };
  }

  getValue(value) {
    if (whatIsIt(value) === 'Object' || whatIsIt(value) === 'Array') {
      return (
        <span>
          <JsonWidget data={value} />
        </span>
      );
    }
    return value;
  }

  getRow(row) {
    return (
      row.map((col, i) => (
        <Td column={(col.name).toUpperCase()}
          value={this.getValue(col.value)}
          key={(col.name).toUpperCase()}>
          {this.getValue(col.value)}
        </Td>
        )
      )
    );
  }

  getTable() {
    const { props: { details, detailsData } } = this;

    const { list, headers, hiddenList } = this.getData(detailsData);
    let itemsPerPage = details && details.itemsPerPage ? details.itemsPerPage : 5,
      lastPage = Math.ceil(list.length / itemsPerPage),
      columnNames = [];

    this.state.paginationDetails = Object.assign({}, this.state.paginationDetails, {
      detailsData,
      lastPage
    });

    headers.forEach((col) => {
      columnNames.push((col.name).toUpperCase());
    });

    if (details && details.secondaryClick) {
      styles.table = Object.assign({}, styles.table, { cursor: 'pointer' });
    }

    return (
      <div>
        {
          list.length > 0
            ? <Table
              style={styles.table}
              className='detailsTable'
              pageButtonLimit={10}
              itemsPerPage={list.length > itemsPerPage ? itemsPerPage : 0}
              currentPage={this.state.paginationDetails.currentPage}
              hideFilterInput
              previousPageLabel={'<<'}
              nextPageLabel={'>>'}
              sortable
              defaultSort={{
                column: 'DATE',
                direction: 'desc'
              }}
              onPageChange={this.onPageChange}>
              {
                list.map((row, i) => (
                  <Tr key={`tr${i}`} onClick={this.handleRowClick(hiddenList[i], i)}>
                    {this.getRow(row)}
                  </Tr>
                )
                )}
            </Table>
            : <div style={styles.noData}>No Data Found.</div>
        }
      </div>
    );
  }

  render() {
    const {props} = this,
      style = Object.assign({}, styles.wrap, props.style),
      {detailsData} = props;

    if (!detailsData) return null;

    return (
      <div style={style} className='details-scrollbar'>
        {this.getTable()}
      </div>
    );
  }
}
