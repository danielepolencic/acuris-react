const React = require('react');
const e = React.createElement;

module.exports = {
  App,
  Update,
  Init,
  createActionSearchChanged,
  createActionShowMore,
  createActionClearSearch,
  createActionInit,
  Dispatch,
  Consume,
  isEmpty
};

function Dispatch(queue) {
  return (message) => {
    return queue.push(message);
  };
}

function Consume(queue) {
  return () => {
    return queue.pop();
  };
}

function isEmpty(queue) {
  return () => queue.length === 0;
}

function App({state, dispatch}) {
  return e('div', null, [
    e(Search, {searchString: state.searchString, dispatch}),
    e(Table, {searchResults: state.searchResults, currentPage: state.currentPage}),
  ].concat(state.currentPage < state.totalPages ? e(ShowMore, {dispatch}) : []));
}

function Search({searchString, dispatch}) {
  return e('div', null, [
    e('input', {
      onChange: event => dispatch(createActionSearchChanged(event.target.value))
    }),
    e('button', {onClick: () => dispatch(createActionClearSearch())}, 'Clear')
  ]);
}

function ShowMore({dispatch}) {
  return e('button', {
    onClick: () => dispatch(createActionShowMore())
  }, `Show more`);
}

function Table({searchResults, currentPage}) {
  const rows = range(currentPage)
    .reduce((acc, it) => acc.concat(searchResults[it]), [])
    .map((it, i) => e(CompanyRow, {company: it}, null));
  return e('table', null, [
    e('thead', null, [
      e('tr', null, [
        e('th', null, 'Name'),
        e('th', null, 'Type'),
        e('th', null, 'Headquarter')
      ]),
    ]),
    e('tbody', null, searchResults.length > 0 ? rows : null
    )
  ]);
}

function CompanyRow({company}) {
  return e('tr', {key: company.id}, [
    e('td', null, company.name),
    e('td', null, [
      formatListedEntity(company.isListedEntity),
      formatPEVCHouse(company.isPEVCHouse)
    ].join('\n')),
    e('td', null, company.geography.state)
  ]);
}

function formatListedEntity(isListedEntity) {
  return isListedEntity ? `Listed Entity` : ''
}

function formatPEVCHouse(isPEVCHouse) {
  return isPEVCHouse ? `PEVC House`: '';
}

const SEARCH_CHANGED = 'SEARCH_CHANGED';
const SHOW_MORE_RESULTS = 'SHOW_MORE_RESULTS';
const CLEAR_SEARCH = 'CLEAR_SEARCH';
const INIT = 'INIT';

function createActionInit() {
  return {type: INIT};
}

function createActionSearchChanged(string) {
  return {type: SEARCH_CHANGED, payload: string};
}

function createActionShowMore() {
  return {type: SHOW_MORE_RESULTS};
}

function createActionClearSearch() {
  return {type: CLEAR_SEARCH};
}

function Init(companies) {
  return {
    searchString: '',
    companies,
    searchResults: [],
    currentPage: 1,
    totalPages: 1,
    resultsPerPage: 5
  };
}

function Update(state, message) {
  switch(message.type) {
  case SEARCH_CHANGED: {
    const searchString = message.payload;
    const results = searchString.length > 2 ?
      state.companies.filter(it => it.name.startsWith(searchString)) : [];
    const totalPages = Math.floor(results.length / state.resultsPerPage) + (results.length % state.resultsPerPage === 0 ? 0 : 1);
    const groupedPages = range(totalPages).reduce((acc, it) => {
      const index = it * state.resultsPerPage;
      acc.push(results.slice(index, index + state.resultsPerPage));
      return acc;
    }, []);
    return Object.assign({}, state, {
      searchString,
      searchResults: groupedPages,
      currentPage: 1,
      totalPages: Math.max(totalPages, 1)
    });
  }
  case SHOW_MORE_RESULTS:
    const currentPage = state.currentPage + 1;
    return Object.assign({}, state, {currentPage: Math.min(currentPage, state.totalPages)});
  case CLEAR_SEARCH:
    return Object.assign({}, state, {searchString: '', searchResults: [], currentPage: 1, totalPages: 1});
  default:
    return state;
  }
}

function range(max) {
  return Array.apply(null, Array(max)).map((_, i) => i);
}
