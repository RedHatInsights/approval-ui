import React, { Fragment, useEffect, useReducer } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { Route, Link, useHistory } from 'react-router-dom';
import { ToolbarGroup, ToolbarItem, Button, Checkbox } from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons';
import { sortable, truncate } from '@patternfly/react-table';
import { fetchWorkflows, sortWorkflows, setFilterValueWorkflows } from '../../redux/actions/workflow-actions';
import AddWorkflow from './add-workflow-modal';
import RemoveWorkflow from './remove-workflow-modal';
import { createRows } from './workflow-table-helpers';
import { TableToolbarView } from '../../presentational-components/shared/table-toolbar-view';
import { TopToolbar, TopToolbarTitle } from '../../presentational-components/shared/top-toolbar';
import { AppTabs } from '../../smart-components/app-tabs/app-tabs';
import { defaultSettings } from '../../helpers/shared/pagination';
import asyncDebounce from '../../utilities/async-debounce';
import { scrollToTop } from '../../helpers/shared/helpers';
import TableEmptyState from '../../presentational-components/shared/table-empty-state';
import routesLinks from '../../constants/routes';
import { useIntl } from 'react-intl';
import commonMessages from '../../messages/common.message';
import worfklowMessages from '../../messages/workflows.messages';
import formMessages from '../../messages/form.messages';
import tableToolbarMessages from '../../messages/table-toolbar.messages';
import EditWorkflow from './edit-workflow-modal';
import WorkflowTableContext from './workflow-table-context';

const columns = (intl, selectedAll, selectAll) => [
  { title: '' },
  { title: <Checkbox onChange={ selectAll } isChecked={ selectedAll } id="select-all"/> },
  { title: intl.formatMessage(worfklowMessages.sequence), transforms: [ sortable ]},
  {
    title: intl.formatMessage(tableToolbarMessages.name),
    transforms: [ sortable ]
  },
  { title: intl.formatMessage(formMessages.description), transforms: [ sortable ], cellTransforms: [ truncate ]},
  { title: intl.formatMessage(formMessages.groups) }
];

const debouncedFilter = asyncDebounce(
  (filter, dispatch, filteringCallback, meta = defaultSettings) => {
    filteringCallback(true);
    dispatch(setFilterValueWorkflows(filter, meta));
    return dispatch(fetchWorkflows(meta))
    .then(() =>
      filteringCallback(false)
    );
  },
  1000
);

const prepareChips = (filterValue, intl) => filterValue ? [{
  category: intl.formatMessage(tableToolbarMessages.name),
  key: 'name',
  chips: [{ name: filterValue, value: filterValue }]
}] : [];

const initialState = (filterValue = '') => ({
  filterValue,
  isFetching: true,
  isFiltering: false,
  selectedWorkflows: [],
  selectedAll: false,
  rows: []
});

const workflowsListState = (state, action) => {
  switch (action.type) {
    case 'setRows':
      return {
        ...state,
        rows: action.payload,
        selectedAll: false
      };
    case 'setFetching':
      return {
        ...state,
        isFetching: action.payload,
        selectedWorkflows: [],
        selectedAll: false
      };
    case 'setFilterValue':
      return { ...state, filterValue: action.payload };
    case 'select':
      return {
        ...state,
        selectedAll: false,
        selectedWorkflows: state.selectedWorkflows.includes(action.payload)
          ? state.selectedWorkflows.filter(id => id !== action.payload)
          : [ ...state.selectedWorkflows, action.payload ]
      };
    case 'selectAll':
      return { ...state, selectedWorkflows: action.payload, selectedAll: true };
    case 'unselectAll':
      return { ...state, selectedWorkflows: [], selectedAll: false };
    case 'setFilteringFlag':
      return { ...state, isFiltering: action.payload, selectedAll: false, selectedWorkflows: []};
    default:
      return state;
  }
};

const Workflows = () => {
  const { workflows: { data, meta }, sortBy, filterValueRedux } = useSelector(
    ({ workflowReducer: { workflows, sortBy, filterValue: filterValueRedux }}) => ({ workflows, sortBy, filterValueRedux })
    , shallowEqual
  );
  const [{ filterValue, isFetching, isFiltering, selectedWorkflows, selectedAll, rows }, stateDispatch ] = useReducer(
    workflowsListState,
    initialState(filterValueRedux)
  );

  const dispatch = useDispatch();
  const history = useHistory();
  const intl = useIntl();

  const setSelectedWorkflows = (id) => stateDispatch({ type: 'select', payload: id });

  const updateWorkflows = (pagination) => {
    stateDispatch({ type: 'setFetching', payload: true });
    return dispatch(fetchWorkflows(pagination))
    .then(() => stateDispatch({ type: 'setFetching', payload: false }))
    .catch(() => stateDispatch({ type: 'setFetching', payload: false }));
  };

  useEffect(() => {
    updateWorkflows(defaultSettings);
    scrollToTop();
  }, []);

  useEffect(() => {
    stateDispatch({ type: 'setRows', payload: createRows(data) });
  }, [ data ]);

  const handleFilterChange = (value) => {
    stateDispatch({ type: 'setFilterValue', payload: value });
    debouncedFilter(
      value,
      dispatch,
      (isFiltering) => stateDispatch({ type: 'setFilteringFlag', payload: isFiltering }),
      { ...meta, offset: 0 }
    );
  };

  const onSort = (_e, index, direction, { property }) => {
    dispatch(sortWorkflows({ index, direction, property }));
    return updateWorkflows();
  };

  const routes = () => <Fragment>
    <Route exact path={ routesLinks.workflows.add } render={ props => <AddWorkflow { ...props }
      postMethod={ updateWorkflows } /> }/>
    <Route exact path={ routesLinks.workflows.edit } component={ EditWorkflow }/>
    <Route exact path={ routesLinks.workflows.remove }
      render={ props => <RemoveWorkflow
        { ...props }
        ids={ selectedWorkflows }
        fetchData={ updateWorkflows }
      /> }
    />
  </Fragment>;

  const actionResolver = () => [
    {
      title: intl.formatMessage(worfklowMessages.edit),
      component: 'button',
      onClick: (_event, _rowId, workflow) =>
        history.push({ pathname: routesLinks.workflows.edit, search: `?workflow=${workflow.id}` })
    },
    {
      title: intl.formatMessage(commonMessages.delete),
      component: 'button',
      onClick: (_event, _rowId, workflow) =>
        history.push({ pathname: routesLinks.workflows.remove, search: `?workflow=${workflow.id}` })
    }
  ];

  const selectAllFunction = () => selectedAll
    ? stateDispatch({ type: 'unselectAll' })
    : stateDispatch({ type: 'selectAll', payload: data.map(wf => wf.id) });

  const anyWorkflowsSelected = selectedWorkflows.length > 0;

  const toolbarButtons = () => <ToolbarGroup className={ `pf-u-pl-lg top-toolbar` }>
    <ToolbarItem>
      <Link id="add-workflow-link" to={ { pathname: routesLinks.workflows.add } }>
        <Button
          variant="primary"
          aria-label={ intl.formatMessage(formMessages.create) }
        >
          { intl.formatMessage(formMessages.create) }
        </Button>
      </Link>
    </ToolbarItem>
    <ToolbarItem>
      <Link
        id="remove-multiple-workflows"
        className={ anyWorkflowsSelected ? '' : 'disabled-link' }
        to={ { pathname: routesLinks.workflows.remove } }
      >
        <Button
          variant="secondary"
          isDisabled={ !anyWorkflowsSelected }
          aria-label={ intl.formatMessage(worfklowMessages.deleteApprovalTitle) }
        >
          { intl.formatMessage(commonMessages.delete) }
        </Button>
      </Link>
    </ToolbarItem>
  </ToolbarGroup>;

  return (
    <Fragment>
      <TopToolbar>
        <TopToolbarTitle title={ intl.formatMessage(commonMessages.approvalTitle) }/>
        <AppTabs/>
      </TopToolbar>
      <WorkflowTableContext.Provider value={ { selectedWorkflows, setSelectedWorkflows } }>
        <TableToolbarView
          sortBy={ sortBy }
          onSort={ onSort }
          rows={ rows }
          columns={ columns(intl, selectedAll, selectAllFunction) }
          fetchData={ updateWorkflows }
          routes={ routes }
          actionResolver={ actionResolver }
          titlePlural={ intl.formatMessage(worfklowMessages.approvalProcesses) }
          titleSingular={ intl.formatMessage(worfklowMessages.approvalProcess) }
          pagination={ meta }
          toolbarButtons={ toolbarButtons }
          filterValue={ filterValue }
          onFilterChange={ handleFilterChange }
          isLoading={ isFetching || isFiltering }
          renderEmptyState={ () => (
            <TableEmptyState
              title={ filterValue === ''
                ? intl.formatMessage(worfklowMessages.noApprovalProcesses)
                : intl.formatMessage(tableToolbarMessages.noResultsFound)
              }
              Icon={ SearchIcon }
              PrimaryAction={ () =>
                filterValue !== '' ? (
                  <Button onClick={ () => handleFilterChange('') } variant="link">
                    { intl.formatMessage(tableToolbarMessages.clearAllFilters) }
                  </Button>
                ) : null
              }
              description={
                filterValue === ''
                  ? intl.formatMessage(worfklowMessages.noApprovalProcesses)
                  : intl.formatMessage(tableToolbarMessages.clearAllFiltersDescription)
              }
            />
          ) }
          activeFiltersConfig={ {
            filters: prepareChips(filterValue, intl),
            onDelete: () => handleFilterChange('')
          } }
        />
      </WorkflowTableContext.Provider>
    </Fragment>
  );
};

export default Workflows;
