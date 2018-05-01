import React from 'react';
import ReactDOM from 'react-dom';
import Reactable from 'reactable';
import $ from 'jquery';
import TestUtils from 'react-addons-test-utils';

let ReactableTestUtils = {
  resetTestEnvironment: function() {
    window.renderApp = function(id) {
      ReactDOM.unmountComponentAtNode($('div#threatTable')[0]);
    };
    $('div#threatTable').remove();
  },

  // Expect the row specified to have the specified class
  expectRowClass: function(rowIndex, className) {
    let row = $($('#table tbody.reactable-data tr')[rowIndex]);
    expect(row.attr('class')).to.have.equal(className);
  },

  // Expect the columns of a the data row specified to have the values in the array as their text values
  expectRowText: function(rowIndex, textArray) {
    let row = $($('#table tbody.reactable-data tr')[rowIndex]).find('td');

    expect(row.length).to.equal(textArray.length);

    for (let i = 0; i < row.length; i++) {
      expect($(row[i]).text()).to.have.equal(textArray[i]);
    }
  },

  testNode: function() {
    let testNode = $('<div>').attr('id', 'threatTable');
    $('body').append(testNode);
    testNode.empty();
    return testNode[0];
  }
};

describe('Reactable', function() {
  describe('with null children', function() {
    before(function() {
      window.renderApp = function(id) {
        ReactDOM.render(
          <Reactable.Table className='table' id='table'>
            {null}
            {null}
            {null}
          </Reactable.Table>,
          ReactableTestUtils.testNode()
        );
      };
    });

    after(ReactableTestUtils.resetTestEnvironment);

    it('renders the table', function() {
      expect($('table#table.table')).to.exist;
    });
  });

  describe('directly passing a data array', function() {
    before(function() {
      ReactDOM.render(
        <Reactable.Table className='table' id='table' data={[
          {Name: 'Griffin Smith', Age: '18'},
          {Age: '23', Name: 'Lee Salminen'},
          {Age: '28', Position: 'Developer'},
          {Name: 'Leonor Hyatt', Position: null}
        ]} />,
        ReactableTestUtils.testNode()
      );
    });

    after(ReactableTestUtils.resetTestEnvironment);

    it('renders the table', function() {
      expect($('table#table.table')).to.exist;
    });

    it('renders the column headers in the table', function() {
      let headers = [];
      $('thead th').each(function() {
        headers.push($(this).text());
      });

      expect(headers).to.eql(['Name', 'Age', 'Position']);
    });

    it('renders the first row with the correct data', function() {
      ReactableTestUtils.expectRowText(0, ['Griffin Smith', '18', '']);
    });

    it('renders the second row with the correct data', function() {
      ReactableTestUtils.expectRowText(1, ['Lee Salminen', '23', '']);
    });

    it('renders the third row with the correct data', function() {
      ReactableTestUtils.expectRowText(2, ['', '28', 'Developer']);
    });

    it('handles null values', function() {
      ReactableTestUtils.expectRowText(3, ['Leonor Hyatt', '', '']);
    });
  });

  describe('adding <Tr>s to the <Table>', function() {
    before(function() {
      ReactDOM.render(
        <Reactable.Table className='table' id='table'>
          <Reactable.Tr data={{Name: 'Griffin Smith', Age: '18'}} />
          <Reactable.Tr data={{Age: '23', Name: 'Lee Salminen'}} />
          <Reactable.Tr data={{Age: '28', Position: 'Developer'}} />
        </Reactable.Table>,
        ReactableTestUtils.testNode()
      );
    });

    after(ReactableTestUtils.resetTestEnvironment);

    it('renders the table', function() {
      expect($('table#table.table')).to.exist;
    });

    it('renders the column headers in the table', function() {
      let headers = [];
      $('thead th').each(function() {
        headers.push($(this).text());
      });

      expect(headers).to.eql([ 'Name', 'Age', 'Position' ]);
    });

    it('renders the first row with the correct data', function() {
      ReactableTestUtils.expectRowText(0, ['Griffin Smith', '18', '']);
    });

    it('renders the second row with the correct data', function() {
      ReactableTestUtils.expectRowText(1, ['Lee Salminen', '23', '']);
    });

    it('renders the third row with the correct data', function() {
      ReactableTestUtils.expectRowText(2, ['', '28', 'Developer']);
    });
  });

  describe('adding <Td>s to the <Tr>s', function() {
    context('with only one <Td>', function() {
      before(function() {
        ReactDOM.render(
          <Reactable.Table className='table' id='table'>
            <Reactable.Tr>
              <Reactable.Td column='Name'>Griffin Smith</Reactable.Td>
            </Reactable.Tr>
            <Reactable.Tr>
              <Reactable.Td column='Name'>Lee Salminen</Reactable.Td>
            </Reactable.Tr>
            <Reactable.Tr>
              <Reactable.Td column='Name'>Ian Zhang</Reactable.Td>
            </Reactable.Tr>
          </Reactable.Table>,
          ReactableTestUtils.testNode()
        );
      });

      after(ReactableTestUtils.resetTestEnvironment);

      it('renders the table', function() {
        expect($('table#table.table')).to.exist;
      });

      it('renders the column headers in the table', function() {
        let headers = [];
        $('thead th').each(function() {
          headers.push($(this).text());
        });

        expect(headers).to.eql(['Name']);
      });

      it('renders the first row with the correct data', function() {
        ReactableTestUtils.expectRowText(0, ['Griffin Smith']);
      });

      it('renders the second row with the correct data', function() {
        ReactableTestUtils.expectRowText(1, ['Lee Salminen']);
      });

      it('renders the third row with the correct data', function() {
        ReactableTestUtils.expectRowText(2, ['Ian Zhang']);
      });
    });

    context('with multiple <Td>s', function() {
      context('with plain text', function() {
        before(function() {
          ReactDOM.render(
            <Reactable.Table className='table' id='table'>
              <Reactable.Tr>
                <Reactable.Td column='Name'>Griffin Smith</Reactable.Td>
                <Reactable.Td column='Age'>18</Reactable.Td>
              </Reactable.Tr>
              <Reactable.Tr>
                <Reactable.Td column='Name'>Lee Salminen</Reactable.Td>
                <Reactable.Td column='Age'>23</Reactable.Td>
              </Reactable.Tr>
              <Reactable.Tr>
                <Reactable.Td column='Position'>Developer</Reactable.Td>
                <Reactable.Td column='Age'>28</Reactable.Td>
              </Reactable.Tr>
            </Reactable.Table>,
            ReactableTestUtils.testNode()
          );
        });

        after(ReactableTestUtils.resetTestEnvironment);

        it('renders the table', function() {
          expect($('table#table.table')).to.exist;
        });

        it('renders the column headers in the table', function() {
          let headers = [];
          $('thead th').each(function() {
            headers.push($(this).text());
          });

          expect(headers).to.eql([ 'Name', 'Age', 'Position' ]);
        });

        it('renders the first row with the correct data', function() {
          ReactableTestUtils.expectRowText(0, ['Griffin Smith', '18', '']);
        });

        it('renders the second row with the correct data', function() {
          ReactableTestUtils.expectRowText(1, ['Lee Salminen', '23', '']);
        });

        it('renders the third row with the correct data', function() {
          ReactableTestUtils.expectRowText(2, ['', '28', 'Developer']);
        });
      });
    });

    context('with React.DOM nodes inside', function() {
      before(function() {
        ReactDOM.render(
          <Reactable.Table className='table' id='table'>
            <Reactable.Tr>
              <Reactable.Td column='Name'><b>Griffin Smith</b></Reactable.Td>
              <Reactable.Td column='Age'><em>18</em></Reactable.Td>
            </Reactable.Tr>
            <Reactable.Tr>
              <Reactable.Td column='Name'><b>Lee Salminen</b></Reactable.Td>
              <Reactable.Td column='Age'><em>23</em></Reactable.Td>
            </Reactable.Tr>
            <Reactable.Tr>
              <Reactable.Td column='Position'><b>Developer</b></Reactable.Td>
              <Reactable.Td column='Age'><em>28</em></Reactable.Td>
            </Reactable.Tr>
          </Reactable.Table>,
          ReactableTestUtils.testNode()
        );
      });

      after(ReactableTestUtils.resetTestEnvironment);

      it('renders the table', function() {
        expect($('table#table.table')).to.exist;
      });

      it('renders the column headers in the table', function() {
        let headers = [];
        $('thead th').each(function() {
          headers.push($(this).text());
        });

        expect(headers).to.eql([ 'Name', 'Age', 'Position' ]);
      });

      it('renders the first row with the correct data', function() {
        ReactableTestUtils.expectRowText(0, ['Griffin Smith', '18', '']);
      });

      it('renders the second row with the correct data', function() {
        ReactableTestUtils.expectRowText(1, ['Lee Salminen', '23', '']);
      });

      it('renders the third row with the correct data', function() {
        ReactableTestUtils.expectRowText(2, ['', '28', 'Developer']);
      });
    });

    context('with null <Td>s', function() {
      before(function() {
        ReactDOM.render(
          <Reactable.Table className='table' id='table'>
            <Reactable.Tr>
              <Reactable.Td column='Name'><b>Griffin Smith</b></Reactable.Td>
              {null}
            </Reactable.Tr>
            <Reactable.Tr>
              <Reactable.Td column='Name'><b>Lee Salminen</b></Reactable.Td>
              <Reactable.Td column='Age'><em>23</em></Reactable.Td>
            </Reactable.Tr>
            <Reactable.Tr>
              <Reactable.Td column='Position'><b>Developer</b></Reactable.Td>
              <Reactable.Td column='Age'><em>28</em></Reactable.Td>
            </Reactable.Tr>
          </Reactable.Table>,
          ReactableTestUtils.testNode()
        );
      });

      after(ReactableTestUtils.resetTestEnvironment);

      it('renders the table', function() {
        expect($('table#table.table')).to.exist;
      });

      it('renders the column headers in the table', function() {
        let headers = [];
        $('thead th').each(function() {
          headers.push($(this).text());
        });

        expect(headers).to.eql([ 'Name', 'Age', 'Position' ]);
      });

      it('renders the first row with the correct data', function() {
        ReactableTestUtils.expectRowText(0, ['Griffin Smith', '', '']);
      });

      it('renders the second row with the correct data', function() {
        ReactableTestUtils.expectRowText(1, ['Lee Salminen', '23', '']);
      });

      it('renders the third row with the correct data', function() {
        ReactableTestUtils.expectRowText(2, ['', '28', 'Developer']);
      });
    });

    context('with null <Tr>s', function() {
      before(function() {
        ReactDOM.render(
          <Reactable.Table className='table' id='table'>
            <Reactable.Tr>
              <Reactable.Td column='Name'><b>Griffin Smith</b></Reactable.Td>
              <Reactable.Td column='Age'><em>18</em></Reactable.Td>
            </Reactable.Tr>
            {null}
            <Reactable.Tr>
              <Reactable.Td column='Position'><b>Developer</b></Reactable.Td>
              <Reactable.Td column='Age'><em>28</em></Reactable.Td>
            </Reactable.Tr>
          </Reactable.Table>,
          ReactableTestUtils.testNode()
        );
      });

      after(ReactableTestUtils.resetTestEnvironment);

      it('renders the table', function() {
        expect($('table#table.table')).to.exist;
      });

      it('renders the column headers in the table', function() {
        let headers = [];
        $('thead th').each(function() {
          headers.push($(this).text());
        });

        expect(headers).to.eql([ 'Name', 'Age', 'Position' ]);
      });

      it('renders the first row with the correct data', function() {
        ReactableTestUtils.expectRowText(0, ['Griffin Smith', '18', '']);
      });

      it('renders the second row with the correct data', function() {
        ReactableTestUtils.expectRowText(1, ['', '28', 'Developer']);
      });
    });
  });

  describe('Adding a <Tfoot>', function() {
    before(function() {
      ReactDOM.render(
        <Reactable.Table className='table' id='table' sortable={['Name']} filterable={['Name', 'Age']}
          filterClassName='new-class' >
          <Reactable.Tr className='rowClass1' data={{Name: 'Griffin Smith', Age: '18'}} />
          <Reactable.Tr className='rowClass2' data={{Age: '23', Name: 'Lee Salminen'}} />
          <Reactable.Tr className='rowClass3' data={{Age: '28', Position: 'Developer'}} />

          <Reactable.Tfoot id='tfoot'>
            <tr><td id='tfoot-stuff'>Test</td></tr>
          </Reactable.Tfoot>
        </Reactable.Table>,
        ReactableTestUtils.testNode()
      );
    });

    after(ReactableTestUtils.resetTestEnvironment);

    it('renders the table', function() {
      expect($('#table')).to.exist;
    });

    it('renders the regular data rows', function() {
      ReactableTestUtils.expectRowText(0, ['Griffin Smith', '18', '']);
      ReactableTestUtils.expectRowText(1, ['Lee Salminen', '23', '']);
      ReactableTestUtils.expectRowText(2, ['', '28', 'Developer']);
    });

    it('renders the tfoot', function() {
      expect($('#tfoot')).to.exist;
    });

    it('renders the children of the tfoot', function() {
      expect($('#tfoot-stuff')).to.exist;
    });
  });

  describe('passing through HTML props', function() {
    describe('adding <Tr>s with className to the <Table>', function() {
      before(function() {
        ReactDOM.render(
          <Reactable.Table className='table' id='table'>
            <Reactable.Tr className='rowClass1' data={{Name: 'Griffin Smith', Age: '18'}} />
            <Reactable.Tr className='rowClass2' data={{Age: '23', Name: 'Lee Salminen'}} />
            <Reactable.Tr className='rowClass3' data={{Age: '28', Position: 'Developer'}} />
          </Reactable.Table>,
          ReactableTestUtils.testNode()
        );
      });

      after(ReactableTestUtils.resetTestEnvironment);

      it('renders the table', function() {
        expect($('table#table.table')).to.exist;
      });

      it('renders the column headers in the table', function() {
        let headers = [];
        $('thead th').each(function() {
          headers.push($(this).text());
        });

        expect(headers).to.eql([ 'Name', 'Age', 'Position' ]);
      });

      it('renders the first row with the correct class name', function() {
        ReactableTestUtils.expectRowClass(0, 'rowClass1');
      });

      it('renders the second row with the correct class name', function() {
        ReactableTestUtils.expectRowClass(1, 'rowClass2');
      });

      it('renders the third row with the correct class name', function() {
        ReactableTestUtils.expectRowClass(2, 'rowClass3');
      });
    });

    describe('adding <Td>s with classNames to the <Table>', function() {
      before(function() {
        ReactDOM.render(
          <Reactable.Table className='table' id='table'>
            <Reactable.Tr>
              <Reactable.Td column='Name' className='name-1'>Griffin Smith</Reactable.Td>
              <Reactable.Td column='Age'>18</Reactable.Td>
            </Reactable.Tr>
            <Reactable.Tr>
              <Reactable.Td column='Name' className='name-2'>Lee Salminen</Reactable.Td>
              <Reactable.Td column='Age'>23</Reactable.Td>
            </Reactable.Tr>
            <Reactable.Tr>
              <Reactable.Td column='Position' className='position'>Developer</Reactable.Td>
              <Reactable.Td column='Age'>28</Reactable.Td>
            </Reactable.Tr>
          </Reactable.Table>,
          ReactableTestUtils.testNode()
        );
      });

      after(ReactableTestUtils.resetTestEnvironment);

      it('renders the first column with the correct class name', function() {
        expect($('td.name-1').text()).to.have.equal('Griffin Smith');
      });

      it('renders the second column with the correct class name', function() {
        expect($('td.name-2').text()).to.have.equal('Lee Salminen');
      });

      it('renders the third column with the correct class name', function() {
        expect($('td.position').text()).to.have.equal('Developer');
      });
    });
  });

  describe('adding <Td> with style to the <Table>', function() {
    before(function() {
      let tdStyle = {width: '100px'};
      ReactDOM.render(
        <Reactable.Table className='table' id='table'>
          <Reactable.Tr>
            <Reactable.Td column='Name' className='name-1' style={tdStyle}>Griffin Smith</Reactable.Td>
            <Reactable.Td column='Age'>18</Reactable.Td>
          </Reactable.Tr>
        </Reactable.Table>,
        ReactableTestUtils.testNode()
      );
    });

    after(ReactableTestUtils.resetTestEnvironment);

    it('renders the first column with the width', function() {
      expect($('td.name-1').attr('style')).to.have.match(/width/);
    });
  });

  describe('specifying an array of columns', function() {
    describe('as strings', function() {
      before(function() {
        ReactDOM.render(
          <Reactable.Table className='table' id='table' data={[
            {Name: 'Griffin Smith', Age: '18', HideThis: 'one'},
            {Age: '23', Name: 'Lee Salminen', HideThis: 'two'},
            {Age: '28', Position: 'Developer'}
          ]} columns={['Name', 'Age']} />,
          ReactableTestUtils.testNode()
        );
      });

      after(ReactableTestUtils.resetTestEnvironment);

      it('omits columns not in the list', function() {
        let columns = $('tr.reactable-column-header th');
        expect(columns.length).to.equal(2);
        expect($(columns[0]).text()).to.have.equal('Name');
        expect($(columns[1]).text()).to.have.equal('Age');
      });

      it('adds class name for each column base on its label', function() {
        let columns = $('tr.reactable-column-header th');
        expect($(columns[0]).attr('class')).to.have.equal('reactable-th-name');
        expect($(columns[1]).attr('class')).to.have.equal('reactable-th-age');
      });
    });

    describe('as objects', function() {
      before(function() {
        ReactDOM.render(
          <Reactable.Table className='table' id='table' data={[
            {name: 'Griffin Smith', age: '18', HideThis: 'one'},
            {age: '23', name: 'Lee Salminen', HideThis: 'two'},
            {age: '28', Position: 'Developer'}
          ]} columns={[
            {key: 'name', label: 'Name'},
            {key: 'age', label: 'Age'}
          ]} />,
          ReactableTestUtils.testNode()
        );
      });

      after(ReactableTestUtils.resetTestEnvironment);

      it('omits columns not in the list', function() {
        let columns = $('tr.reactable-column-header th');
        expect(columns.length).to.equal(2);
      });

      it('allows changing the labels of the columns', function() {
        let columns = $('tr.reactable-column-header th');
        expect($(columns[0]).text()).to.have.equal('Name');
        expect($(columns[1]).text()).to.have.equal('Age');
      });

      it('adds class name for each column base on its key', function() {
        let columns = $('tr.reactable-column-header th');
        expect($(columns[0]).attr('class')).to.have.equal('reactable-th-name');
        expect($(columns[1]).attr('class')).to.have.equal('reactable-th-age');
      });
    });
  });

  describe('specifying columns using a <Thead>', function() {
    describe('and an element for the column title', function() {
      before(function() {
        ReactDOM.render(
          <Reactable.Table id='table' data={[
          {Name: Reactable.unsafe('<span id="griffins-name">Griffin Smith</span>'), Age: '18'},
          {Age: '28', Position: Reactable.unsafe('<span id="who-knows-job">Developer</span>')},
          {Age: '23', Name: Reactable.unsafe('<span id="lees-name">Lee Salminen</span>')}
          ]}>
            <Reactable.Thead>
              <Reactable.Th column='Name' id='my-name'>
                <strong>name</strong>
              </Reactable.Th>
            </Reactable.Thead>
          </Reactable.Table>,
          ReactableTestUtils.testNode()
        );
      });

      after(ReactableTestUtils.resetTestEnvironment);

      it('renders only the columns in the Thead', function() {
        expect($('#table tbody tr:first td').length).to.be.above(0);
        expect($('#table thead tr:first th').length).to.be.above(0);
      });

      it('renders the contents of the Th', function() {
        expect($('#table>thead>tr>th>strong').length).to.be.above(0);
      });

      it('passes through the properties of the Th', function() {
        expect($('#table>thead>tr>th').attr('id')).to.have.equal('my-name');
      });
    });

    describe('and a string for the column title', function() {
      before(function() {
        ReactDOM.render(
          <Reactable.Table id='table' data={[
          {Name: Reactable.unsafe('<span id="griffins-name">Griffin Smith</span>'), Age: '18'},
          {Age: '28', Position: Reactable.unsafe('<span id="who-knows-job">Developer</span>')},
          {Age: '23', Name: Reactable.unsafe('<span id="lees-name">Lee Salminen</span>')}
          ]}>
            <Reactable.Thead>
              <Reactable.Th column='Name' id='my-name'>
                name
              </Reactable.Th>
            </Reactable.Thead>
          </Reactable.Table>,
          ReactableTestUtils.testNode()
        );
      });

      after(ReactableTestUtils.resetTestEnvironment);

      it('renders only the columns in the Thead', function() {
        expect($('#table tbody tr:first td').length).to.be.above(0);
        expect($('#table thead tr:first th').length).to.be.above(0);
      });

      it('renders the contents of the Th', function() {
        expect($('#table>thead>tr>th').length).to.be.above(0);
      });

      it('passes through the properties of the Th', function() {
        expect($('#table>thead>tr>th').attr('id')).to.have.equal('my-name');
      });
    });
  });

  describe('table headers', function() {
    describe('with hideTableHeader prop on <Table>', function() {
      before(function() {
        ReactDOM.render(
          <Reactable.Table className='table' id='table' data={[
          {Name: 'Griffin Smith', Age: '18'},
          {Age: '23', Name: 'Lee Salminen'},
          {Age: '28', Position: 'Developer'},
          {Name: 'Leonor Hyatt', Position: null}
          ]} hideTableHeader />,
            ReactableTestUtils.testNode()
        );
      });

      after(ReactableTestUtils.resetTestEnvironment);

      it('renders the table', function() {
        expect($('table#table.table').length).to.be.above(0);
      });

      it('renders the first row with the correct data', function() {
        ReactableTestUtils.expectRowText(0, ['Griffin Smith', '18', '']);
      });

      it('renders the second row with the correct data', function() {
        ReactableTestUtils.expectRowText(1, ['Lee Salminen', '23', '']);
      });

      it('renders the third row with the correct data', function() {
        ReactableTestUtils.expectRowText(2, ['', '28', 'Developer']);
      });

      it('does not show a <Thead>', function() {
        expect($('#table thead').length).to.be.above(0);
      });
    });
  });

  describe('unsafe() strings', function() {
    context('in the <Table> directly', function() {
      before(function() {
        ReactDOM.render(
          <Reactable.Table className='table' id='table' data={[
            {Name: Reactable.unsafe('<span id="griffins-name">Griffin Smith</span>'), Age: '18'},
            {Age: '28', Position: Reactable.unsafe('<span id="who-knows-job">Developer</span>')},
            {Age: '23', Name: Reactable.unsafe('<span id="lees-name">Lee Salminen</span>')}
          ]} sortable={['Name']} />,
          ReactableTestUtils.testNode()
        );
      });

      after(ReactableTestUtils.resetTestEnvironment);

      it('renders the HTML in the table cells', function() {
        let griffins_name = $('span#griffins-name');
        expect(griffins_name.length).to.equal(1);
        expect(griffins_name.text()).to.have.equal('Griffin Smith');

        let lees_name = $('span#lees-name');
        expect(lees_name.length).to.equal(1);
        expect(lees_name.text()).to.have.equal('Lee Salminen');

        let who_knows_job = $('span#who-knows-job');
        expect(who_knows_job.length).to.equal(1);
        expect(who_knows_job.text()).to.have.equal('Developer');
      });

      it('still allows sorting', function() {
        let nameHeader = $('#table thead tr.reactable-column-header th')[0];
        TestUtils.Simulate.click(nameHeader);

        ReactableTestUtils.expectRowText(0, ['28', 'Developer', '']);
        ReactableTestUtils.expectRowText(1, ['18', '', 'Griffin Smith']);
        ReactableTestUtils.expectRowText(2, ['23', '', 'Lee Salminen']);
      });
    });

    context('in column labels', function() {
      before(function() {
        ReactDOM.render(
          <Reactable.Table className='table' id='table' data={[
            {Name: 'Griffin Smith', Age: '18'},
            {Age: '23', Name: 'Lee Salminen'},
            {Age: '28', Position: 'Developer'}
          ]} columns={[
            {key: 'Name', label: Reactable.unsafe('<strong>Name</strong>')},
            {key: 'Age', label: Reactable.unsafe('<em>Age</em>')},
            {key: 'Position', label: Reactable.unsafe('<small>Position</small>')}
          ]} />,
          ReactableTestUtils.testNode()
        );
      });

      after(ReactableTestUtils.resetTestEnvironment);

      it('renders the HTML in the column headers', function() {
        let headers = [];
        $('thead th').each(function() {
          headers.push($(this).html());
        });

        expect(headers).to.eql([
          '<strong>Name</strong>',
          '<em>Age</em>',
          '<small>Position</small>'
        ]);
      });
    });

    context('in the <Tr>s', function() {
      before(function() {
        ReactDOM.render(
          <Reactable.Table className='table' id='table'>
            <Reactable.Tr data={{Name: Reactable.unsafe('<span id="griffins-name">Griffin Smith</span>'), Age: '18'}} />
            <Reactable.Tr data={{Age: '23', Name: Reactable.unsafe('<span id="lees-name">Lee Salminen</span>')}} />
            <Reactable.Tr data={{Age: '28', Position: Reactable.unsafe('<span id="who-knows-job">Developer</span>')}} />
          </Reactable.Table>,
          ReactableTestUtils.testNode()
        );
      });

      after(ReactableTestUtils.resetTestEnvironment);

      it('renders the HTML in the table cells', function() {
        let griffins_name = $('span#griffins-name');
        expect(griffins_name.length).to.equal(1);
        expect(griffins_name.text()).to.have.equal('Griffin Smith');

        let lees_name = $('span#lees-name');
        expect(lees_name.length).to.equal(1);
        expect(lees_name.text()).to.have.equal('Lee Salminen');

        let who_knows_job = $('span#who-knows-job');
        expect(who_knows_job.length).to.equal(1);
        expect(who_knows_job.text()).to.have.equal('Developer');
      });
    });

    context('in the <Td>s', function() {
      before(function() {
        ReactDOM.render(
          <Reactable.Table className='table' id='table'>
            <Reactable.Tr>
              <Reactable.Td column='Name'>{Reactable.unsafe('<span id="griffins-name">Griffin Smith</span>')}</Reactable.Td>
              <Reactable.Td column='Age'>18</Reactable.Td>
            </Reactable.Tr>
            <Reactable.Tr>
              <Reactable.Td column='Name'>{Reactable.unsafe('<span id="lees-name">Lee Salminen</span>')}</Reactable.Td>
              <Reactable.Td column='Age'>23</Reactable.Td>
            </Reactable.Tr>
            <Reactable.Tr>
              <Reactable.Td column='Position'>{Reactable.unsafe('<span id="who-knows-job">Developer</span>')}</Reactable.Td>
              <Reactable.Td column='Age'>28</Reactable.Td>
            </Reactable.Tr>
          </Reactable.Table>,
          ReactableTestUtils.testNode()
        );
      });

      after(ReactableTestUtils.resetTestEnvironment);

      it('renders the HTML in the table cells', function() {
        let griffins_name = $('span#griffins-name');
        expect(griffins_name.length).to.equal(1);
        expect(griffins_name.text()).to.have.equal('Griffin Smith');

        let lees_name = $('span#lees-name');
        expect(lees_name.length).to.equal(1);
        expect(lees_name.text()).to.have.equal('Lee Salminen');

        let who_knows_job = $('span#who-knows-job');
        expect(who_knows_job.length).to.equal(1);
        expect(who_knows_job.text()).to.have.equal('Developer');
      });
    });
  });

  describe('pagination', function() {
    describe('specifying pageButtonLimit', function() {
      before(function() {
        ReactDOM.render(
          <Reactable.Table className='table' id='table' data={[
            {'Name': 'Griffin Smith', 'Age': '18'},
            {'Age': '23', 'Name': 'Lee Salminen'},
            {'Age': '28', 'Position': 'Developer'},
            {'Name': 'Griffin Smith', 'Age': '18'},
            {'Age': '23', 'Name': 'Test Person'},
            {'Name': 'Ian Zhang', 'Age': '28', 'Position': 'Developer'},
            {'Name': 'Griffin Smith', 'Age': '18', 'Position': 'Software Developer'},
            {'Age': '23', 'Name': 'Lee Salminen'},
            {'Age': '28', 'Position': 'Developer'},
            {'Name': 'Griffin Smith', 'Age': '18'},
            {'Age': '23', 'Name': 'Lee Salminen'},
            {'Age': '28', 'Position': 'Developer'},
            {'Name': 'Griffin Smith', 'Age': '18'},
            {'Age': '23', 'Name': 'Test Person'},
            {'Name': 'Ian Zhang', 'Age': '28', 'Position': 'Developer'},
            {'Name': 'Griffin Smith', 'Age': '18', 'Position': 'Software Developer'},
            {'Age': '23', 'Name': 'Lee Salminen'},
            {'Age': '28', 'Position': 'Developer'},
            {'Name': 'Griffin Smith', 'Age': '18'},
            {'Age': '23', 'Name': 'Lee Salminen'},
            {'Age': '28', 'Position': 'Developer'},
            {'Name': 'Griffin Smith', 'Age': '18'},
            {'Age': '23', 'Name': 'Test Person'},
            {'Name': 'Ian Zhang', 'Age': '28', 'Position': 'Developer'},
            {'Name': 'Griffin Smith', 'Age': '18', 'Position': 'Software Developer'},
            {'Age': '23', 'Name': 'Lee Salminen'},
            {'Age': '28', 'Position': 'Developer'}
          ]} itemsPerPage={2} pageButtonLimit={8} />,
          ReactableTestUtils.testNode()
        );
      });

      after(ReactableTestUtils.resetTestEnvironment);

      it('shows no more page buttons than the pageButtonLimit', function() {
        let pageButtons = $('#table tbody.reactable-pagination a.reactable-page-button');
        expect(pageButtons.length).to.equal(8);
      });
    });

    describe('specifying itemsPerPage', function() {
      before(function() {
        ReactDOM.render(
          <Reactable.Table className='table' id='table' data={[
            {'Name': 'Griffin Smith', 'Age': '18'},
            {'Age': '23', 'Name': 'Lee Salminen'},
            {'Age': '28', 'Position': 'Developer'},
            {'Name': 'Griffin Smith', 'Age': '18'},
            {'Age': '23', 'Name': 'Test Person'},
            {'Name': 'Ian Zhang', 'Age': '28', 'Position': 'Developer'},
            {'Name': 'Griffin Smith', 'Age': '18', 'Position': 'Software Developer'},
            {'Age': '23', 'Name': 'Lee Salminen'},
            {'Age': '28', 'Position': 'Developer'}
          ]} itemsPerPage={4} previousPageLabel={'<<'} nextPageLabel={'>>'} />,
          ReactableTestUtils.testNode()
        );
      });

      after(ReactableTestUtils.resetTestEnvironment);

      it('provides buttons for each page', function() {
        let pageButtons = $('#table tbody.reactable-pagination a.reactable-page-button');
        expect(pageButtons.length).to.equal(3);
        expect($(pageButtons[0]).text()).to.have.equal('1');
        expect($(pageButtons[1]).text()).to.have.equal('2');
        expect($(pageButtons[2]).text()).to.have.equal('3');
      });

      it('displays only the first n rows', function() {
        expect($('#table tbody.reactable-data tr').length).to.equal(4);
      });

      it('specifies a class on the currently active page', function() {
        let activePage = $('#table tbody.reactable-pagination a.reactable-page-button.reactable-current-page');
        expect(activePage.length).to.equal(1);
        expect(activePage.text()).to.have.equal('1');
      });

      it('does not show previous button', function() {
        let previousButton = $('#table tbody.reactable-pagination a.reactable-previous-page');
        expect(previousButton.length).to.equal(0);
      });

      it('shows next button', function() {
        let nextButton = $('#table tbody.reactable-pagination a.reactable-next-page');
        expect(nextButton.length).to.equal(1);
        expect(nextButton[0].text).to.equal('>>');
      });

      describe('clicking page buttons', function() {
        beforeEach(function() {
          let page2 = $('#table tbody.reactable-pagination a.reactable-page-button')[1];
          TestUtils.Simulate.click(page2);
        });

        it('loads the next n rows', function() {
          let rows = $('#table tbody.reactable-data tr');
          expect($($(rows[0]).find('td')[0]).text()).to.have.equal('Test Person');
          expect($($(rows[1]).find('td')[0]).text()).to.have.equal('Ian Zhang');
          expect($($(rows[2]).find('td')[0]).text()).to.have.equal('Griffin Smith');
          expect($($(rows[3]).find('td')[0]).text()).to.have.equal('Lee Salminen');
        });

        it('puts an active class on the new active page', function() {
          let activePage = $('#table tbody.reactable-pagination a.reactable-page-button.reactable-current-page');
          expect(activePage.length).to.equal(1);
          expect(activePage.text()).to.have.equal('2');
        });

        it('can go back to the original page', function() {
          let page1 = $('#table tbody.reactable-pagination a.reactable-page-button')[0];
          TestUtils.Simulate.click(page1);

          let rows = $('#table tbody.reactable-data tr');
          expect($($(rows[0]).find('td')[0]).text()).to.have.equal('Griffin Smith');
          expect($($(rows[1]).find('td')[0]).text()).to.have.equal('Lee Salminen');
          expect($($(rows[2]).find('td')[0]).text()).to.have.equal('');
          expect($($(rows[3]).find('td')[0]).text()).to.have.equal('Griffin Smith');
        });

        it('shows previous button', function() {
          let previousButton = $('#table tbody.reactable-pagination a.reactable-previous-page');
          expect(previousButton.length).to.equal(1);
          expect(previousButton[0].text).to.equal('<<');
        });
      });
    });

    describe('specifying more itemsPerPage than items', function() {
      before(function() {
        ReactDOM.render(
          <Reactable.Table className='table' id='table' data={[
            {'Name': 'Griffin Smith', 'Age': '18'},
            {'Age': '23', 'Name': 'Lee Salminen'},
            {'Age': '28', 'Position': 'Developer'},
            {'Name': 'Griffin Smith', 'Age': '18'},
            {'Age': '23', 'Name': 'Test Person'},
            {'Name': 'Ian Zhang', 'Age': '28', 'Position': 'Developer'},
            {'Name': 'Griffin Smith', 'Age': '18', 'Position': 'Software Developer'},
            {'Age': '23', 'Name': 'Lee Salminen'},
            {'Age': '28', 'Position': 'Developer'}
          ]} itemsPerPage={20} />,
          ReactableTestUtils.testNode()
        );
      });

      after(ReactableTestUtils.resetTestEnvironment);

      it('renders all rows', function() {
        expect($('#table tbody.reactable-data tr').length).to.equal(9);
      });

      it('provides buttons for 1 page', function() {
        let pageButtons = $('#table tbody.reactable-pagination a.reactable-page-button');
        expect(pageButtons.length).to.equal(1);
        expect($(pageButtons[0]).text()).to.have.equal('1');
      });

      it('does not show previous and next buttons', function() {
        let previousButton = $('#table tbody.reactable-pagination a.reactable-previous-page');
        let nextButton = $('#table tbody.reactable-pagination a.reactable-next-page');
        expect(previousButton.length + nextButton.length).to.equal(0);
      });
    });

    describe('not specifying itemsPerPage', function() {
      before(function() {
        ReactDOM.render(
          <Reactable.Table className='table' id='table' data={[
            {'Name': 'Griffin Smith', 'Age': '18'},
            {'Age': '23', 'Name': 'Lee Salminen'},
            {'Age': '28', 'Position': 'Developer'},
            {'Name': 'Griffin Smith', 'Age': '18'},
            {'Age': '23', 'Name': 'Test Person'},
            {'Name': 'Ian Zhang', 'Age': '28', 'Position': 'Developer'},
            {'Name': 'Griffin Smith', 'Age': '18', 'Position': 'Software Developer'},
            {'Age': '23', 'Name': 'Lee Salminen'},
            {'Age': '28', 'Position': 'Developer'},
          ]} />,
          ReactableTestUtils.testNode()
        );
      });

      after(ReactableTestUtils.resetTestEnvironment);

      it('renders all rows', function() {
        expect($('#table tbody.reactable-data tr').length).to.equal(9);
      });
    });

    describe('specifying 0 itemsPerPage', function() {
      before(function() {
        ReactDOM.render(
          <Reactable.Table className='table' id='table' data={[
            {'Name': 'Griffin Smith', 'Age': '18'},
            {'Age': '23', 'Name': 'Lee Salminen'},
            {'Age': '28', 'Position': 'Developer'},
            {'Name': 'Griffin Smith', 'Age': '18'},
            {'Age': '23', 'Name': 'Test Person'},
            {'Name': 'Ian Zhang', 'Age': '28', 'Position': 'Developer'},
            {'Name': 'Griffin Smith', 'Age': '18', 'Position': 'Software Developer'},
            {'Age': '23', 'Name': 'Lee Salminen'},
            {'Age': '28', 'Position': 'Developer'}
          ]} itemsPerPage={0} />,
          ReactableTestUtils.testNode()
        );
      });

      after(ReactableTestUtils.resetTestEnvironment);

      it('renders all rows', function() {
        expect($('#table tbody.reactable-data tr').length).to.equal(9);
      });
    });

    describe('onPageChange hook', () => {
      let currentPage
      const callback = page => {
          currentPage = page
      };
      before(() => {
        ReactDOM.render(
          <Reactable.Table className='table' id='table' data={[
            {'Name': 'Griffin Smith', 'Age': '18'},
            {'Age': '23', 'Name': 'Lee Salminen'},
            {'Age': '28', 'Position': 'Developer'},
            {'Name': 'Griffin Smith', 'Age': '18'},
            {'Age': '23', 'Name': 'Test Person'},
            {'Name': 'Ian Zhang', 'Age': '28', 'Position': 'Developer'},
            {'Name': 'Griffin Smith', 'Age': '18', 'Position': 'Software Developer'},
            {'Age': '23', 'Name': 'Lee Salminen'},
            {'Age': '28', 'Position': 'Developer'}
          ]} itemsPerPage={4} onPageChange={callback} />,
          ReactableTestUtils.testNode()
        );
      });

      after(ReactableTestUtils.resetTestEnvironment);

      it('emits the number of the currently selected page (zero based) when onPageChange event is triggered', () => {
        const page1 = $('#table tbody.reactable-pagination a.reactable-page-button')[0];
        const page2 = $('#table tbody.reactable-pagination a.reactable-page-button')[1];
        const page3 = $('#table tbody.reactable-pagination a.reactable-page-button')[2];
        TestUtils.Simulate.click(page2);
        expect(currentPage).to.equal(1);
        TestUtils.Simulate.click(page1);
        expect(currentPage).to.equal(0);
        TestUtils.Simulate.click(page3);
        expect(currentPage).to.equal(2);
      });
    });

    describe('updating the currentPage via a prop passed to the table', function() {
        before(function() {

          let ParentComponent = React.createClass({
            getInitialState: function() {
              return {currentPage: 4}
           },

            render () {
              return (
                <Reactable.Table className='table' id='table' data={[
                    {'Name': 'Griffin Smith', 'Age': '18'},
                    {'Age': '23', 'Name': 'Lee Salminen'},
                    {'Age': '28', 'Position': 'Developer'},
                    {'Name': 'Griffin Smith', 'Age': '18'},
                    {'Age': '23', 'Name': 'Test Person'},
                    {'Name': 'Ian Zhang', 'Age': '28', 'Position': 'Developer'},
                    {'Name': 'Griffin Smith', 'Age': '18', 'Position': 'Software Developer'},
                    {'Age': '23', 'Name': 'Lee Salminen'},
                    {'Age': '28', 'Position': 'Developer'},
                ]} itemsPerPage={2} currentPage={this.state.currentPage} />
              );
           }
         })
          this.component = ReactDOM.render(React.createElement(ParentComponent), ReactableTestUtils.testNode());
       });

        after(ReactableTestUtils.resetTestEnvironment);

        it('allows setting the default currentPage', function() {
            let activePage = $('#table tbody.reactable-pagination ' +
                'a.reactable-page-button.reactable-current-page');
            expect(activePage.length).to.equal(1);
            expect(activePage.text()).to.have.equal('5');
       });

        it('allows updating currentPage using props', function() {
            this.component.setState({currentPage: 2})
            let activePage = $('#table tbody.reactable-pagination ' +
                'a.reactable-page-button.reactable-current-page')
            expect(activePage.length).to.equal(1);
            expect(activePage.text()).to.have.equal('3');
       });
    });
  });

  describe('sorting', function() {
    describe('no default sort', function() {
      before(function() {
        ReactDOM.render(
          <Reactable.Table className='table' id='table' data={[
            {Name: 'Lee Salminen', Age: '23', Position: 'Programmer'},
            {Name: 'Griffin Smith', Age: '18', Position: 'Engineer'},
            {Name: 'Ian Zhang', Age: '28', Position: 'Developer'}
          ]}
            sortable={[
              {
                column: 'Name',
                sortFunction: function(a, b) {
                  // Sort by last name
                  let nameA = a.split(' ');
                  let nameB = b.split(' ');
                  return nameA[1].localeCompare(nameB[1]);
                }
              },
              'Age',
              'Position'
            ]} />,
            ReactableTestUtils.testNode()
        );
      });

      after(ReactableTestUtils.resetTestEnvironment);

      it('renders all rows with no sort', function() {
        ReactableTestUtils.expectRowText(0, ['Lee Salminen', '23', 'Programmer']);
        ReactableTestUtils.expectRowText(1, ['Griffin Smith', '18', 'Engineer']);
        ReactableTestUtils.expectRowText(2, ['Ian Zhang', '28', 'Developer']);
      });

      it('adds reactable-header-sortable to all headers', function() {
        let header = $('#table thead tr.reactable-column-header th')[0];
        expect($(header).hasClass('reactable-header-sortable')).to.have.equal(true);

        header = $('#table thead tr.reactable-column-header th')[1];
        expect($(header).hasClass('reactable-header-sortable')).to.have.equal(true);

        header = $('#table thead tr.reactable-column-header th')[2];
        expect($(header).hasClass('reactable-header-sortable')).to.have.equal(true);
      });

      it('sorts by text in ascending order', function() {
        let positionHeader = $('#table thead tr.reactable-column-header th')[2];
        TestUtils.Simulate.click(positionHeader);

        ReactableTestUtils.expectRowText(0, ['Ian Zhang', '28', 'Developer']);
        ReactableTestUtils.expectRowText(1, ['Griffin Smith', '18', 'Engineer']);
        ReactableTestUtils.expectRowText(2, ['Lee Salminen', '23', 'Programmer']);

        // Make sure the headers have the right classes
        expect($(positionHeader).hasClass('reactable-header-sort-asc')).to.have.equal(true);
      });

      it('sorts by text in descending order', function() {
        let positionHeader = $('#table thead tr.reactable-column-header th')[2];
        TestUtils.Simulate.click(positionHeader);

        ReactableTestUtils.expectRowText(0, ['Lee Salminen', '23', 'Programmer']);
        ReactableTestUtils.expectRowText(1, ['Griffin Smith', '18', 'Engineer']);
        ReactableTestUtils.expectRowText(2, ['Ian Zhang', '28', 'Developer']);

        // Make sure the headers have the right classes
        expect($(positionHeader).hasClass('reactable-header-sort-desc')).to.have.equal(true);
      });

      it('sorts by last name in ascending order', function() {
        let nameHeader = $('#table thead tr.reactable-column-header th')[0];
        TestUtils.Simulate.click(nameHeader);

        ReactableTestUtils.expectRowText(0, ['Lee Salminen', '23', 'Programmer']);
        ReactableTestUtils.expectRowText(1, ['Griffin Smith', '18', 'Engineer']);
        ReactableTestUtils.expectRowText(2, ['Ian Zhang', '28', 'Developer']);

        // Make sure the headers have the right classes
        expect($(nameHeader).hasClass('reactable-header-sort-asc')).to.have.equal(true);
      });

      it('sorts by last name in descending order', function() {
        let nameHeader = $('#table thead tr.reactable-column-header th')[0];
        TestUtils.Simulate.click(nameHeader);

        ReactableTestUtils.expectRowText(0, ['Ian Zhang', '28', 'Developer']);
        ReactableTestUtils.expectRowText(1, ['Griffin Smith', '18', 'Engineer']);
        ReactableTestUtils.expectRowText(2, ['Lee Salminen', '23', 'Programmer']);

        // Make sure the headers have the right classes
        expect($(nameHeader).hasClass('reactable-header-sort-desc')).to.have.equal(true);
      });

      it('sorts by last name in ascending order by enter keydown', function() {
        let nameHeader = $('#table thead tr.reactable-column-header th')[0];
        TestUtils.Simulate.keyDown(nameHeader, {keyCode: 13});

        ReactableTestUtils.expectRowText(0, ['Lee Salminen', '23', 'Programmer']);
        ReactableTestUtils.expectRowText(1, ['Griffin Smith', '18', 'Engineer']);
        ReactableTestUtils.expectRowText(2, ['Ian Zhang', '28', 'Developer']);

        // Make sure the headers have the right classes
        expect($(nameHeader).hasClass('reactable-header-sort-asc')).to.have.equal(true);
      });

      it('does not sort on non-enter keydown', function() {
        let nameHeader = $('#table thead tr.reactable-column-header th')[0];
        TestUtils.Simulate.keyDown(nameHeader, {keyCode: 10});

        ReactableTestUtils.expectRowText(0, ['Lee Salminen', '23', 'Programmer']);
        ReactableTestUtils.expectRowText(1, ['Griffin Smith', '18', 'Engineer']);
        ReactableTestUtils.expectRowText(2, ['Ian Zhang', '28', 'Developer']);

        // Make sure the headers have the right classes
        expect($(nameHeader).hasClass('reactable-header-sort-asc')).to.have.equal(true);
      });
    });

    describe('passing `true` to sortable', function() {
      let component;
      before(function() {
        this.render = () => {
          ReactDOM.render(
            <Reactable.Table className='table' id='table' data={[
                {Name: 'Lee Salminen', Age: '23', Position: 'Programmer'},
                {Name: 'Griffin Smith', Age: '18', Position: 'Engineer'},
                {Name: 'Ian Zhang', Age: '28', Position: 'Developer'}
            ]}
              sortable={true} />,
              ReactableTestUtils.testNode()
          );
        };

        this.render();
      });

      after(ReactableTestUtils.resetTestEnvironment);

      it('sorts by the first column in ascending order', function() {
        let nameHeader = $('#table thead tr.reactable-column-header th')[0];
        TestUtils.Simulate.click(nameHeader);

        ReactableTestUtils.expectRowText(0, ['Griffin Smith', '18', 'Engineer']);
        ReactableTestUtils.expectRowText(1, ['Ian Zhang', '28', 'Developer']);
        ReactableTestUtils.expectRowText(2, ['Lee Salminen', '23', 'Programmer']);

        // Make sure the headers have the right classes
        expect($(nameHeader).hasClass('reactable-header-sort-asc')).to.have.equal(true);
      });

      it('sorts by the first column in descending order', function() {
        let nameHeader = $('#table thead tr.reactable-column-header th')[0];
        TestUtils.Simulate.click(nameHeader);

        ReactableTestUtils.expectRowText(0, ['Lee Salminen', '23', 'Programmer']);
        ReactableTestUtils.expectRowText(1, ['Ian Zhang', '28', 'Developer']);
        ReactableTestUtils.expectRowText(2, ['Griffin Smith', '18', 'Engineer']);

        // Make sure the headers have the right classes
        expect($(nameHeader).hasClass('reactable-header-sort-desc')).to.have.equal(true);
      });

      it('sorts by the second column in ascending order', function() {
        let nameHeader = $('#table thead tr.reactable-column-header th')[1];
        TestUtils.Simulate.click(nameHeader);

        ReactableTestUtils.expectRowText(0, ['Griffin Smith', '18', 'Engineer']);
        ReactableTestUtils.expectRowText(1, ['Lee Salminen', '23', 'Programmer']);
        ReactableTestUtils.expectRowText(2, ['Ian Zhang', '28', 'Developer']);

        // Make sure the headers have the right classes
        expect($(nameHeader).hasClass('reactable-header-sort-asc')).to.have.equal(true);
      });

      it('sorts by the second column in descending order', function() {
        let nameHeader = $('#table thead tr.reactable-column-header th')[1];
        TestUtils.Simulate.click(nameHeader);

        ReactableTestUtils.expectRowText(0, ['Ian Zhang', '28', 'Developer']);
        ReactableTestUtils.expectRowText(1, ['Lee Salminen', '23', 'Programmer']);
        ReactableTestUtils.expectRowText(2, ['Griffin Smith', '18', 'Engineer']);

        // Make sure the headers have the right classes
        expect($(nameHeader).hasClass('reactable-header-sort-desc')).to.have.equal(true);
      });

      it('sorts by the third column in ascending order', function() {
        let positionHeader = $('#table thead tr.reactable-column-header th')[2];
        TestUtils.Simulate.click(positionHeader);

        ReactableTestUtils.expectRowText(0, ['Ian Zhang', '28', 'Developer']);
        ReactableTestUtils.expectRowText(1, ['Griffin Smith', '18', 'Engineer']);
        ReactableTestUtils.expectRowText(2, ['Lee Salminen', '23', 'Programmer']);

        // Make sure the headers have the right classes
        expect($(positionHeader).hasClass('reactable-header-sort-asc')).to.have.equal(true);
      });

      it('sorts by the third column in descending order', function() {
        let positionHeader = $('#table thead tr.reactable-column-header th')[2];
        TestUtils.Simulate.click(positionHeader);

        ReactableTestUtils.expectRowText(0, ['Lee Salminen', '23', 'Programmer']);
        ReactableTestUtils.expectRowText(1, ['Griffin Smith', '18', 'Engineer']);
        ReactableTestUtils.expectRowText(2, ['Ian Zhang', '28', 'Developer']);

        // Make sure the headers have the right classes
        expect($(positionHeader).hasClass('reactable-header-sort-desc')).to.have.equal(true);
      });

      it('Keeps the same sort after rerendering', function() {
        expect(this.render).to.not.throw(Error);

        ReactableTestUtils.expectRowText(0, ['Lee Salminen', '23', 'Programmer']);
        ReactableTestUtils.expectRowText(1, ['Griffin Smith', '18', 'Engineer']);
        ReactableTestUtils.expectRowText(2, ['Ian Zhang', '28', 'Developer']);
      });
    });

    describe('default sort', function() {
      before(function() {
        ReactDOM.render(
          <Reactable.Table className='table' id='table' data={[
            {Name: 'Lee Salminen', Age: '23', Position: 'Programmer'},
            {Name: 'Griffin Smith', Age: '18', Position: 'Engineer'},
            {Name: 'Ian Zhang', Age: '28', Position: 'Developer'}
          ]}
          sortable={[
            {
              column: 'Name',
              sortFunction: function(a, b) {
                  // Sort by last name
                  let nameA = a.split(' ');
                  let nameB = b.split(' ');
                  return nameA[1].localeCompare(nameB[1]);
              }
            },
            'Age',
            'Position'
          ]}
            defaultSort={{column: 'Age', direction: 'desc'}} />,
            ReactableTestUtils.testNode()
        );
      });

      after(ReactableTestUtils.resetTestEnvironment);

      it('renders all rows sorted by default column age descending', function() {
        ReactableTestUtils.expectRowText(0, ['Ian Zhang', '28', 'Developer']);
        ReactableTestUtils.expectRowText(1, ['Lee Salminen', '23', 'Programmer']);
        ReactableTestUtils.expectRowText(2, ['Griffin Smith', '18', 'Engineer']);
      });
    });

    describe('sorting after updating columns and sortable props', () => {
      let parent;

      before(function() {
        let TestParent = React.createFactory(React.createClass({
          getInitialState: function() {
            return ({
              data: [
                {Name: 'Lee Salminen', Age: '23', Position: 'Programmer'},
                {Name: 'Griffin Smith', Age: '18', Position: 'Engineer'},
                {Name: 'Ian Zhang', Age: '28', Position: 'Developer'}
              ],
              sortable: ['Name', 'Age', 'Position'],
              defaultSort: 'Position'
            });
          },
          render: function() {
            return (
              <Reactable.Table
                className='table'
                id='table'
                data={this.state.data}
                sortable={this.state.sortable}
                defaultSort={this.state.defaultSort}
              />
            );
          }
        }));

        parent = ReactDOM.render(TestParent(), ReactableTestUtils.testNode());
      });

      after(ReactableTestUtils.resetTestEnvironment);
    });

    describe('sort descending by default flag', function() {
      before(function() {
        ReactDOM.render(
          <Reactable.Table className='table' id='table' data={[
            {Name: 'Lee Salminen', Age: '23', Position: 'Programmer'},
            {Name: 'Griffin Smith', Age: '18', Position: 'Engineer'},
            {Name: 'Ian Zhang', Age: '28', Position: 'Developer'}
          ]}
          sortable={[
            {
              column: 'Name',
              sortFunction: function(a, b) {
                // Sort by last name
                let nameA = a.split(' ');
                let nameB = b.split(' ');
                return nameA[1].localeCompare(nameB[1]);
              }
            },
            'Age',
            'Position'
          ]}
          defaultSort={{column: 'Age'}}
          defaultSortDescending />,
          ReactableTestUtils.testNode()
        );
      });

      after(ReactableTestUtils.resetTestEnvironment);

      it('renders all rows sorted by default column age descending', function() {
        ReactableTestUtils.expectRowText(0, ['Ian Zhang', '28', 'Developer']);
        ReactableTestUtils.expectRowText(1, ['Lee Salminen', '23', 'Programmer']);
        ReactableTestUtils.expectRowText(2, ['Griffin Smith', '18', 'Engineer']);
      });

      it('sorts by the age column in ascending order', function() {
        let positionHeader = $('#table thead tr.reactable-column-header th')[1];
        TestUtils.Simulate.click(positionHeader);

        ReactableTestUtils.expectRowText(0, ['Griffin Smith', '18', 'Engineer']);
        ReactableTestUtils.expectRowText(1, ['Lee Salminen', '23', 'Programmer']);
        ReactableTestUtils.expectRowText(2, ['Ian Zhang', '28', 'Developer']);

        // Make sure the headers have the right classes
        expect($(positionHeader).hasClass('reactable-header-sort-asc')).to.have.equal(true);
      });
    });

    describe('default sort no direction specified', function() {
      before(function() {
        ReactDOM.render(
          <Reactable.Table className='table' id='table' data={[
            {Name: 'Lee Salminen', Age: '23', Position: 'Programmer'},
            {Name: 'Griffin Smith', Age: '18', Position: 'Engineer'},
            {Name: 'Ian Zhang', Age: '28', Position: 'Developer'}
          ]}
            sortable={[
              {
                column: 'Name',
                sortFunction: function(a, b) {
                  // Sort by last name
                  let nameA = a.split(' ');
                  let nameB = b.split(' ');
                  return nameA[1].localeCompare(nameB[1]);
                }
              },
              'Age',
              'Position'
            ]}
            defaultSort={'Age'} />,
            ReactableTestUtils.testNode()
        );
      });

      after(ReactableTestUtils.resetTestEnvironment);

      it('renders all rows sorted by default column age ascending', function() {
        ReactableTestUtils.expectRowText(0, ['Griffin Smith', '18', 'Engineer']);
        ReactableTestUtils.expectRowText(1, ['Lee Salminen', '23', 'Programmer']);
        ReactableTestUtils.expectRowText(2, ['Ian Zhang', '28', 'Developer']);
      });
    });

    describe('unsortable column', function() {
      before(function() {
        ReactDOM.render(
          <Reactable.Table className='table' id='table' data={[
            {Name: 'Lee Salminen', Age: '23', Position: 'Programmer'},
            {Name: 'Griffin Smith', Age: '18', Position: 'Engineer'},
            {Name: 'Ian Zhang', Age: '28', Position: 'Developer'}
          ]}
            sortable={[
              'Age',
              'Position'
            ]} />,
          ReactableTestUtils.testNode()
        );
      });

      after(ReactableTestUtils.resetTestEnvironment);

      it('leaves columns unsorted', function() {
        let nameHeader = $('#table thead tr.reactable-column-header th')[0];
        TestUtils.Simulate.click(nameHeader);

        ReactableTestUtils.expectRowText(0, ['Lee Salminen', '23', 'Programmer']);
        ReactableTestUtils.expectRowText(1, ['Griffin Smith', '18', 'Engineer']);
        ReactableTestUtils.expectRowText(2, ['Ian Zhang', '28', 'Developer']);
      });

      it("doesn't give non-sortable headers a role=button", function() {
        let nameHeader = $('#table thead tr.reactable-column-header th:first');
        expect($(nameHeader).attr('role')).to.not.have.equal('button');
      });
    });

    [Reactable.Sort.Numeric, Reactable.Sort.NumericInteger].forEach(function(method) {
      describe('numeric sort', function() {
        before(function() {
          ReactDOM.render(
              <Reactable.Table className='table' id='table' data={[
                  {Count: '23'},
                  {Count: '18'},
                  {Count: '28'},
                  {Count: '1.23'},
                  {Count: 'a'},
                  {Count: 'z'},
                  {Count: '123'}
              ]}
                columns={[{key: 'Count', sortable: method}]} />,
                ReactableTestUtils.testNode()
          );
        });

        after(function() {
          ReactableTestUtils.resetTestEnvironment();
        });

        it('sorts columns numerically', function() {
          let sortHeader = $('#table thead tr.reactable-column-header th')[0];
          TestUtils.Simulate.click(sortHeader);

          ReactableTestUtils.expectRowText(0, ['1.23']);
          ReactableTestUtils.expectRowText(1, ['18']);
          ReactableTestUtils.expectRowText(2, ['23']);
          ReactableTestUtils.expectRowText(3, ['28']);
          ReactableTestUtils.expectRowText(4, ['123']);
          ReactableTestUtils.expectRowText(5, ['a']);
          ReactableTestUtils.expectRowText(6, ['z']);
        });
      });
    });

    describe('numeric sort with Tr and Td specified', function() {
      before(function() {
        ReactDOM.render(
          <Reactable.Table
            className='table'
            id='table'
            columns={[{key: 'Count', sortable: Reactable.Sort.Numeric}]}>
            <Reactable.Tr>
              <Reactable.Td column='Count'>23</Reactable.Td>
            </Reactable.Tr>
            <Reactable.Tr>
              <Reactable.Td column='Count'>18</Reactable.Td>
            </Reactable.Tr>
            <Reactable.Tr>
              <Reactable.Td column='Count'>28</Reactable.Td>
            </Reactable.Tr>
            <Reactable.Tr>
              <Reactable.Td column='Count'>1.23</Reactable.Td>
            </Reactable.Tr>
            <Reactable.Tr>
              <Reactable.Td column='Count'>a</Reactable.Td>
            </Reactable.Tr>
            <Reactable.Tr>
              <Reactable.Td column='Count'>z</Reactable.Td>
            </Reactable.Tr>
            <Reactable.Tr>
              <Reactable.Td column='Count'>123</Reactable.Td>
            </Reactable.Tr>
          </Reactable.Table>,
          ReactableTestUtils.testNode()
        );
      });

      after(function() {
        ReactableTestUtils.resetTestEnvironment();
      });

      it('sorts columns numerically', function() {
        let sortHeader = $('#table thead tr.reactable-column-header th')[0];
        TestUtils.Simulate.click(sortHeader);

        ReactableTestUtils.expectRowText(0, ['1.23']);
        ReactableTestUtils.expectRowText(1, ['18']);
        ReactableTestUtils.expectRowText(2, ['23']);
        ReactableTestUtils.expectRowText(3, ['28']);
        ReactableTestUtils.expectRowText(4, ['123']);
        ReactableTestUtils.expectRowText(5, ['a']);
        ReactableTestUtils.expectRowText(6, ['z']);
      });
    });

    describe('numeric sort with Tr and Td specified and custom value', function() {
      before(function() {
        ReactDOM.render(
          <Reactable.Table
            className='table'
            id='table'
            columns={[{key: 'Count', sortable: Reactable.Sort.Numeric}]}>
            <Reactable.Tr>
              <Reactable.Td column='Count' value={23}>twenty-three</Reactable.Td>
            </Reactable.Tr>
            <Reactable.Tr>
              <Reactable.Td column='Count' value={18}>eighteen</Reactable.Td>
            </Reactable.Tr>
            <Reactable.Tr>
              <Reactable.Td column='Count' value={28}>twenty-eight</Reactable.Td>
            </Reactable.Tr>
            <Reactable.Tr>
              <Reactable.Td column='Count' value={1.23}>one point two three</Reactable.Td>
            </Reactable.Tr>
            <Reactable.Tr>
              <Reactable.Td column='Count' value='a'>a</Reactable.Td>
            </Reactable.Tr>
            <Reactable.Tr>
              <Reactable.Td column='Count' value='z'>z</Reactable.Td>
            </Reactable.Tr>
            <Reactable.Tr>
              <Reactable.Td column='Count' value={123}>one hundred twenty-three</Reactable.Td>
            </Reactable.Tr>
          </Reactable.Table>,
          ReactableTestUtils.testNode()
        );
      });

      after(function() {
        ReactableTestUtils.resetTestEnvironment();
      });

      it('sorts columns numerically', function() {
        let sortHeader = $('#table thead tr.reactable-column-header th')[0];
        TestUtils.Simulate.click(sortHeader);

        ReactableTestUtils.expectRowText(0, ['one point two three']);
        ReactableTestUtils.expectRowText(1, ['eighteen']);
        ReactableTestUtils.expectRowText(2, ['twenty-three']);
        ReactableTestUtils.expectRowText(3, ['twenty-eight']);
        ReactableTestUtils.expectRowText(4, ['one hundred twenty-three']);
        ReactableTestUtils.expectRowText(5, ['a']);
        ReactableTestUtils.expectRowText(6, ['z']);
      });
    });

    describe('currency sort', function() {
      before(function() {
        ReactDOM.render(
          <Reactable.Table className='table' id='table' data={[
            {Price: '1.25'},
            {Price: '$1.01'},
            {Price: '1'},
            {Price: '$10,000'},
            {Price: '$10,500'},
            {Price: '$10'},
            {Price: 'a'},
            {Price: 'z'},
            {Price: '$2'},
            {Price: '$.5'},
            {Price: '$0.60'},
            {Price: '.1'}
          ]}
            columns={[{key: 'Price', sortable: Reactable.Sort.Currency}]} />,
            ReactableTestUtils.testNode()
        );
      });

      after(function() {
        ReactableTestUtils.resetTestEnvironment();
      });
    });

    describe('date sort', function() {
        before(function() {
            ReactDOM.render(
                <Reactable.Table className='table' id='table' data={[
                    {'Date': '1/1/2014 11:00 AM'},
                    {'Date': '1/1/2013 11:00 AM'},
                    {'Date': '1/1/2014 4:30 PM'},
                    {'Date': '4/3/2013'},
                    {'Date': 'a'},
                    {'Date': 'z'},
                ]}
                columns={[{key: 'Date', sortable: Reactable.Sort.Date}]} />,
                ReactableTestUtils.testNode()
            );
       });

        after(function() {
            ReactableTestUtils.resetTestEnvironment();
       });

        it('sorts columns by date', function() {
            let sortHeader = $('#table thead tr.reactable-column-header th')[0];
            TestUtils.Simulate.click(sortHeader);

            ReactableTestUtils.expectRowText(0, ['1/1/2013 11:00 AM']);
            ReactableTestUtils.expectRowText(1, ['4/3/2013']);
            ReactableTestUtils.expectRowText(2, ['1/1/2014 11:00 AM']);
            ReactableTestUtils.expectRowText(3, ['1/1/2014 4:30 PM']);
            ReactableTestUtils.expectRowText(4, ['a']);
            ReactableTestUtils.expectRowText(5, ['z']);
       });
   });

    describe('custom sort with React Components', function() {
        before(function() {
            ReactDOM.render(
                <Reactable.Table className='table' id='table' data={[
                    {'Rank': <span className='3'>Third</span>},
                    {'Rank': <span className='1'>First</span>},
                    {'Rank': <span className='2'>Second</span>},
                ]}
                    columns={[{
                        key: 'Rank', sortable: function (a, b) {
                            // sort based on classname
                            return a.props.className.localeCompare(b.props.className);
                       }
                   }]} />,
                ReactableTestUtils.testNode()
            );
       });

        after(function() {
            ReactableTestUtils.resetTestEnvironment();
       });

        it('sorts columns by value', function() {
            let sortHeader = $('#table thead tr.reactable-column-header th')[0];
            TestUtils.Simulate.click(sortHeader);

            ReactableTestUtils.expectRowText(0, ['First']);
            ReactableTestUtils.expectRowText(1, ['Second']);
            ReactableTestUtils.expectRowText(2, ['Third']);
       });
   });

    describe('sorts and calls onSort callback via props', function() {
        let sortColumn = null;

        let callback = function(sortObject) {
            sortColumn = sortObject.column;
       }

        before(function() {
            ReactDOM.render(
                <Reactable.Table className='table' id='table' data={[
                    {'Rank': <span className='3'>Third</span>},
                    {'Rank': <span className='1'>First</span>},
                    {'Rank': <span className='2'>Second</span>},
                    ]}
                    columns={[{
                        key: 'Rank', sortable: function (a, b) {
                            // sort based on classname
                            return a.props.className.localeCompare(b.props.className);
                       }
                   }]}
                    onSort={callback}/>,
                ReactableTestUtils.testNode()
            );
       });

        after(function() {
            ReactableTestUtils.resetTestEnvironment();
       });

        it('returns currentSort object to callback for utilization', function() {
            let sortHeader = $('#table thead tr.reactable-column-header th')[0];
            TestUtils.Simulate.click(sortHeader);

            expect(sortColumn).to.equal('Rank');
       });
   });
  });

  describe('filtering', function() {
      describe('filtering with javascript objects for data', function() {
          let data = [{name:"Lee SomeoneElse", age:18},{name:"Lee Salminen", age:23},{name:"No Age", age:null}]
          let filterBy
          let onFilter = function (filter) {
              filterBy = filter
         }
          before(function () {
              ReactDOM.render(
                  <Reactable.Table className='table' id='table'
                      filterable={['Name', 'Age']}
                      onFilter={onFilter}>
                      <Reactable.Tr>
                          <Reactable.Td column='Name' data={data[0].name}/>
                          <Reactable.Td column='Age' data={data[0].age}/>
                      </Reactable.Tr>
                      <Reactable.Tr>
                          <Reactable.Td column='Name' data={data[1].name}/>
                          <Reactable.Td column='Age' data={data[1].age}/>
                      </Reactable.Tr>
                      <Reactable.Tr>
                          <Reactable.Td column='Name' data={data[2].name}/>
                          <Reactable.Td column='Age' data={data[2].age}/>
                      </Reactable.Tr>
                  </Reactable.Table>,
                  ReactableTestUtils.testNode()
              );
         });

          after(ReactableTestUtils.resetTestEnvironment);

          it('filters case insensitive on specified columns', function() {
              var $filter = $('#table thead tr.reactable-filterer input.reactable-filter-input');

              $filter.val('lee');
              TestUtils.Simulate.keyUp($filter[0]);

              ReactableTestUtils.expectRowText(0, ['Lee SomeoneElse', '18']);
              ReactableTestUtils.expectRowText(1, ['Lee Salminen', '23']);
         });
          it('calls onFilter event handler', function() {
              var $filter = $('#table thead tr.reactable-filterer input.reactable-filter-input');
              let textToSearch = 'lee';

              $filter.val(textToSearch);
              TestUtils.Simulate.keyUp($filter[0]);

              expect(filterBy).to.equal(textToSearch);
         });
     });

      describe('basic case-insensitive filtering', function() {
          before(function() {
              this.component = ReactDOM.render(
                  <Reactable.Table className='table' id='table'
                      filterable={['State', 'Tag']}
                      filterPlaceholder='Filter Results'
                      columns={['State', 'Description', 'Tag']}>
                      <Reactable.Tr>
                          <Reactable.Td column='State'>New York</Reactable.Td>
                          <Reactable.Td column='Description'>this is some text</Reactable.Td>
                          <Reactable.Td column='Tag'>new</Reactable.Td>
                      </Reactable.Tr>
                      <Reactable.Tr>
                          <Reactable.Td column='State'>New Mexico</Reactable.Td>
                          <Reactable.Td column='Description'>lorem ipsum</Reactable.Td>
                          <Reactable.Td column='Tag'>old</Reactable.Td>
                      </Reactable.Tr>
                      <Reactable.Tr>
                          <Reactable.Td column='State'>Colorado</Reactable.Td>
                          <Reactable.Td column='Description'>
                              new description that shouldnt match filter
                          </Reactable.Td>
                          <Reactable.Td column='Tag'>old</Reactable.Td>
                      </Reactable.Tr>
                      <Reactable.Tr>
                          <Reactable.Td column='State'>Alaska</Reactable.Td>
                          <Reactable.Td column='Description'>bacon</Reactable.Td>
                          <Reactable.Td column='Tag'>renewed</Reactable.Td>
                      </Reactable.Tr>
                  </Reactable.Table>,
                  ReactableTestUtils.testNode()
              );
         });

          after(ReactableTestUtils.resetTestEnvironment);

          context('from the filterer field', function() {
              it('filters case insensitive on specified columns', function() {
                  var $filter = $('#table thead tr.reactable-filterer input.reactable-filter-input');

                  $filter.val('new');
                  TestUtils.Simulate.keyUp($filter[0]);

                  ReactableTestUtils.expectRowText(0, ['New York', 'this is some text', 'new']);
                  ReactableTestUtils.expectRowText(1, ['New Mexico', 'lorem ipsum', 'old']);
                  ReactableTestUtils.expectRowText(2, ['Alaska', 'bacon', 'renewed']);
             });

              it('filter placeholder is set', function() {
                  var $filter = $('#table thead tr.reactable-filterer input.reactable-filter-input');
                  expect($filter.attr("placeholder")).to.equal('Filter Results');
             })
         });

          context('from the function', function() {
              before(function() {
                  this.component.filterBy('york');
             });

              it('applies the filtering', function() {
                  ReactableTestUtils.expectRowText(0, ['New York', 'this is some text', 'new']);
             });
          });
        });
      });

      context('filtering with prop and hiding filter input', function() {
        before(function() {
          this.component = ReactDOM.render(
            <Reactable.Table className='table' id='table'
              filterable={['State', 'Tag']}
              filterPlaceholder='Filter Results'
              filterBy='new'
              hideFilterInput
              columns={['State', 'Description', 'Tag']}>
              <Reactable.Tr>
                <Reactable.Td column='State'>New York</Reactable.Td>
                <Reactable.Td column='Description'>this is some text</Reactable.Td>
                <Reactable.Td column='Tag'>new</Reactable.Td>
              </Reactable.Tr>
              <Reactable.Tr>
                <Reactable.Td column='State'>New Mexico</Reactable.Td>
                <Reactable.Td column='Description'>lorem ipsum</Reactable.Td>
                <Reactable.Td column='Tag'>old</Reactable.Td>
              </Reactable.Tr>
            </Reactable.Table>,
            ReactableTestUtils.testNode()
          );
       });

        after(ReactableTestUtils.resetTestEnvironment);

        it('does not render the filter input box', function() {
          expect($('#table thead tr.reactable-filterer input.reactable-filter-input').length).to.equal(0);
        });
      });

      context('filtering and pagination together', function() {
        before(function() {
          ReactDOM.render(
            <Reactable.Table className='table' id='table' data={[
              {'State': 'New York', 'Description': 'this is some text', 'Tag': 'new'},
              {'State': 'New Mexico', 'Description': 'lorem ipsum', 'Tag': 'old'},
              {'State': 'Colorado', 'Description': 'new description that shouldn\'t match filter',
                  'Tag': 'old'},
              {'State': 'Alaska', 'Description': 'bacon', 'Tag': 'renewed'},
            ]}
              filterable={['State', 'Tag']}
              columns={['State', 'Description', 'Tag']}
              itemsPerPage={2} />,
            ReactableTestUtils.testNode()
          );
        });

        after(ReactableTestUtils.resetTestEnvironment);

        afterEach(function() {
          var $filter = $('#table thead tr.reactable-filterer input.reactable-filter-input');
          $filter.val('');
          TestUtils.Simulate.keyUp($filter[0]);
        });

        it('updates the pagination links', function() {
          var $filter = $('#table thead tr.reactable-filterer input.reactable-filter-input');

          $filter.val('colorado');
          TestUtils.Simulate.keyUp($filter[0]);

          let pageButtons = $('#table tbody.reactable-pagination a.reactable-page-button');
          expect(pageButtons.length).to.equal(1);
          expect($(pageButtons[0]).text()).to.have.equal('1');
        });

        it('updates the current page if necessary', function() {
          var $filter = $('#table thead tr.reactable-filterer input.reactable-filter-input');
          var $pageButtons = $('#table tbody.reactable-pagination a.reactable-page-button');

          // Go to the last page
          TestUtils.Simulate.click($pageButtons[1])

          // Then filter so that that page doesn't exist anymore
          $filter.val('colorado');
          TestUtils.Simulate.keyUp($filter[0]);

          ReactableTestUtils.expectRowText(0, [
            'Colorado',
            "new description that shouldn't match filter",
            'old'
          ]);
          let activePage = $('#table tbody.reactable-pagination ' +
              'a.reactable-page-button.reactable-current-page');
          expect(activePage.length).to.equal(1);
          expect(activePage.text()).to.have.equal('1');
        });
      });

      context('with custom filter', function() {
          before(function() {
              this.component = ReactDOM.render(
                  <Reactable.Table className='table' id='table'
                      filterable={[
                          {
                              column: 'Tag',
                              filterFunction: function(contents, filter) {
                                  // return true if tag contains 'x' and the filter
                                  return (
                                      typeof(contents) !== 'undefined' && typeof(filter) !== 'undefined' &&
                                        contents.indexOf('x') > -1 && contents.indexOf(filter) > -1
                                  );
                             },
                         },
                          'State'
                      ]}
                      filterPlaceholder='Filter Results'
                      columns={['State', 'Description', 'Tag']}>
                      <Reactable.Tr>
                          <Reactable.Td column='State'>New York</Reactable.Td>
                          <Reactable.Td column='Description'>this is some text</Reactable.Td>
                          <Reactable.Td column='Tag'>new</Reactable.Td>
                      </Reactable.Tr>
                      <Reactable.Tr>
                          <Reactable.Td column='State'>New Mexico</Reactable.Td>
                          <Reactable.Td column='Description'>lorem ipsum</Reactable.Td>
                          <Reactable.Td column='Tag'>old x</Reactable.Td>
                      </Reactable.Tr>
                      <Reactable.Tr>
                          <Reactable.Td column='State'>Colorado</Reactable.Td>
                          <Reactable.Td column='Description'>lol</Reactable.Td>
                          <Reactable.Td column='Tag'>renewed x</Reactable.Td>
                      </Reactable.Tr>
                      <Reactable.Tr>
                          <Reactable.Td column='State'>Alaska</Reactable.Td>
                          <Reactable.Td column='Description'>bacon</Reactable.Td>
                          <Reactable.Td column='Tag'>new</Reactable.Td>
                      </Reactable.Tr>
                  </Reactable.Table>,
                  ReactableTestUtils.testNode()
              );
         });

          after(ReactableTestUtils.resetTestEnvironment);

          context('from the filterer field', function() {
              it('filters case insensitive on specified columns', function() {
                  var $filter = $('#table thead tr.reactable-filterer input.reactable-filter-input');

                  $filter.val('l');
                  TestUtils.Simulate.keyUp($filter[0]);

                  ReactableTestUtils.expectRowText(0, ['New Mexico', 'lorem ipsum', 'old x']);
                  ReactableTestUtils.expectRowText(1, ['Colorado', 'lol', 'renewed x']);
                  ReactableTestUtils.expectRowText(2, ['Alaska', 'bacon', 'new']);
             });

              it('filter placeholder is set', function() {
                  var $filter = $('#table thead tr.reactable-filterer input.reactable-filter-input');
                  expect($filter.attr("placeholder")).to.equal('Filter Results');
             })
         });

          context('from the function', function() {
              before(function() {
                  this.component.filterBy('l');
             });

              it('applies the filtering', function() {
                  ReactableTestUtils.expectRowText(0, ['New Mexico', 'lorem ipsum', 'old x']);
                  ReactableTestUtils.expectRowText(1, ['Colorado', 'lol', 'renewed x']);
                  ReactableTestUtils.expectRowText(2, ['Alaska', 'bacon', 'new']);
             });

              it('updates the value of the filterer', function() {
                  var $filter = $('#table thead tr.reactable-filterer input.reactable-filter-input');
                  expect($filter.val()).to.have.equal('l');
             });
          });
      });
  });

  describe('directly passing a data array with non-string data', function() {
      before(function() {
          ReactDOM.render(
              <Reactable.Table className='table' id='table' data={[
                  {Name: 'Griffin Smith', Age: 18},
                  {Age: 23, Name: {toString: function() {return 'Lee Salminen'}}},
                  {Age: 28.45, Position: 'Developer'}
              ]} />,
              ReactableTestUtils.testNode()
          );
     });

      after(ReactableTestUtils.resetTestEnvironment);

      it('renders the table', function() {
          expect($('table#table.table')).to.exist;
     });

      it('renders the column headers in the table', function() {
          let headers = [];
          $('thead th').each(function() {
              headers.push($(this).text());
         });

          expect(headers).to.eql([ 'Name', 'Age', 'Position']);
     });

      it('renders the first row with the correct data', function() {
          ReactableTestUtils.expectRowText(0, ['Griffin Smith', '18', '']);
     });

      it('renders the second row with the correct data', function() {
          ReactableTestUtils.expectRowText(1, ['Lee Salminen', '23', '']);
     });

      it('renders the third row with the correct data', function() {
          ReactableTestUtils.expectRowText(2, ['', '28.45', 'Developer']);
     });
  });

  describe('multiple tables on a page', function() {
      before(function() {
          this.parentTestNode = ReactableTestUtils.testNode();
          this.testNode1 = $('<div>').attr('id', 'threatTable-1');
          this.testNode2 = $('<div>').attr('id', 'threatTable-2');

          ReactDOM.render(
              <Reactable.Table className='table' id='table1' data={[
                  {Name: 'Griffin Smith', Age: '18'},
                  {Age: '23', Name: 'Lee Salminen'},
                  {Age: '28', Position: 'Developer'}
              ]} />,
              this.testNode1[0]
          );

          ReactDOM.render(
              <Reactable.Table className='table' id='table2' data={[
                  {Moniker: 'Griffin Smith', Elderliness: '18'},
                  {Elderliness: '23', Moniker: 'Lee Salminen'},
                  {Elderliness: '28', Title: 'Developer'}
              ]} />,
              this.testNode2[0]
          );
     });

      after(function() {
          $(this.parentTestNode).empty().remove();
     });

      it('renders the column headers in the first table', function() {
          let headers = [];
          this.testNode1.find('thead th').each(function() {
              headers.push($(this).text());
         });

          expect(headers).to.eql(['Name', 'Age', 'Position']);
     });

      it('renders the column headers in the second table', function() {
          let headers = [];
          this.testNode2.find('thead th').each(function() {
              headers.push($(this).text());
         });

          expect(headers).to.eql(['Moniker', 'Elderliness', 'Title']);
     });
  });

  describe('handleClick callbacks', function() {
      before(function() {
          this.clicked = false;

          ReactDOM.render(
              <Reactable.Table className='table' id='table'>
                  <Reactable.Tr>
                      <Reactable.Td column='Name' handleClick={function() {
                          this.clicked = true;
                     }.bind(this)}>
                          <b>Griffin Smith</b>
                      </Reactable.Td>
                  </Reactable.Tr>
              </Reactable.Table>,
              ReactableTestUtils.testNode()
          );
          TestUtils.Simulate.click($('td')[0]);
     });

      after(ReactableTestUtils.resetTestEnvironment);

      it('calls the callbacks on click', function() {
          expect(this.clicked).to.eq(true);
     });
  });

  describe('table with no data', () => {
    context('when noDataText prop is null', () => {
      before(function() {
        this.component = ReactDOM.render(
          <Reactable.Table data={[]} columns={['State', 'Description', 'Tag']}></Reactable.Table>,
            ReactableTestUtils.testNode()
        );
     });

      after(ReactableTestUtils.resetTestEnvironment);

      it('does not render the reactable-no-data element', () => {
        expect($('.reactable-no-data').length).to.eq(0);
     });
   });

    context('when initialized without <Tr>s', () => {
      before(function() {
        this.component = ReactDOM.render(
          <Reactable.Table className='table' id='table' columns={['State', 'Description', 'Tag']}
            noDataText='No matching records found.'></Reactable.Table>,
            ReactableTestUtils.testNode()
        );
     });

      after(ReactableTestUtils.resetTestEnvironment);

      it('shows the "no data" message', () => {
        var $text = $('.reactable-no-data').text();
        expect($text).to.eq('No matching records found.');
     });
   });

    context('when filtered without any matches', () => {
      before(function() {
        this.component = ReactDOM.render(
          <Reactable.Table className='table' id='table'
            filterable={['State', 'Tag']}
            filterPlaceholder='Filter Results'
            filterBy='xxxxx'
            noDataText='No matching records found.'
            columns={['State', 'Description', 'Tag']}>
            <Reactable.Tr>
              <Reactable.Td column='State'>New York</Reactable.Td>
              <Reactable.Td column='Description'>this is some text</Reactable.Td>
              <Reactable.Td column='Tag'>new</Reactable.Td>
            </Reactable.Tr>
            <Reactable.Tr>
              <Reactable.Td column='State'>New Mexico</Reactable.Td>
              <Reactable.Td column='Description'>lorem ipsum</Reactable.Td>
              <Reactable.Td column='Tag'>old</Reactable.Td>
            </Reactable.Tr>
            <Reactable.Tr>
              <Reactable.Td column='State'>Colorado</Reactable.Td>
              <Reactable.Td column='Description'>
                  new description that shouldnt match filter
              </Reactable.Td>
              <Reactable.Td column='Tag'>old</Reactable.Td>
            </Reactable.Tr>
            <Reactable.Tr>
              <Reactable.Td column='State'>Alaska</Reactable.Td>
              <Reactable.Td column='Description'>bacon</Reactable.Td>
              <Reactable.Td column='Tag'>renewed</Reactable.Td>
            </Reactable.Tr>
          </Reactable.Table>,
          ReactableTestUtils.testNode()
        );
     });

      after(ReactableTestUtils.resetTestEnvironment)

      it('shows the "no data" message', () => {
        let text = $('.reactable-no-data').text();
        expect(text).to.eq('No matching records found.');
     });
   });

    context('when initialized with an empty array for `data` prop', () => {
      before(function() {
        this.component = ReactDOM.render(
          <Reactable.Table data={[]} className='table' id='table' columns={['State', 'Description', 'Tag']}
            noDataText='No matching records found.'></Reactable.Table>,
            ReactableTestUtils.testNode()
        );
     });

      after(ReactableTestUtils.resetTestEnvironment);

      it('shows the "no data" message', () => {
        var $text = $('.reactable-no-data').text();
        expect($text).to.eq('No matching records found.');
     });
   });
  });
});
