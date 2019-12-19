import { createRows } from '../../../smart-components/workflow/workflow-table-helpers';
import ExpandableContent from '../../../smart-components/workflow/expandable-content';

describe('workflow table helpers', () => {
  it('should create rows correctly', () => {
    const data = [{
      id: '1',
      name: 'foo',
      description: 'bar',
      group_refs: [ 'group_refs' ]
    }, {
      name: 'should be in result',
      id: '2',
      description: 'baz',
      group_refs: [ 'group_refs' ]
    }, {
      name: 'Always approve',
      id: 3,
      description: 'should not be in result'
    }];

    const expectedData = [{
      cells: [ 'foo', 'bar' ],
      id: '1',
      isOpen: false,
      selected: false,
      tableItem: {
        description: 'bar',
        group_refs: [ 'group_refs' ],
        id: '1',
        name: 'foo'
      }
    }, {
      cells: [{
        title: <ExpandableContent
          groupNames={ [] }
          isOpen={ false }
          row={  { description: 'bar',
            group_refs: [ 'group_refs' ],
            id: '1',
            name: 'foo'
          } }
        />
      }],
      parent: 0
    }, {
      cells: [ 'should be in result', 'baz' ],
      id: '2',
      isOpen: false,
      selected: false,
      tableItem: {
        description: 'baz',
        group_refs: [ 'group_refs' ],
        id: '2',
        name: 'should be in result'
      }
    }, {
      cells: [{
        title: <ExpandableContent
          groupNames={ [] }
          isOpen={ false }
          row={ {
            description: 'baz',
            group_refs: [ 'group_refs' ],
            id: '2',
            name: 'should be in result'
          }
          }
        />
      }],
      parent: 2
    }];
    expect(createRows(data, 'result')).toEqual(expectedData);
  });
});
