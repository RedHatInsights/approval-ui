import React from 'react';

import ExpandableContent from './expandable-content';

export const handleRow = (row, isOpen) => {
  return [{ title: <ExpandableContent isOpen={ isOpen } row={ row }/> }];
};

export const createRows = (data) =>
  data.filter(item => {
    return (item.name !== 'Always approve');
  }).reduce((acc,
    { id,
      name,
      description,
      group_refs }, key) => ([
    ...acc, {
      id,
      isOpen: false,
      selected: false,
      cells: [ name, description ],
      tableItem: { id, name, description, group_refs }
    }, {
      parent: key * 2,
      cells: handleRow({ id, name, description, group_refs }, false)
    }
  ]), []);

