const test = require('tape');
const {
  Init,
  Update,
  createActionSearchChanged,
  createActionShowMore,
  createActionClearSearch
} = require('./app');

const companies = [
  {name: 'Sony'},
  {name: 'Sony Mobile'},
  {name: 'Sony Mobile1'},
  {name: 'Sony Mobile2'},
  {name: 'Sony Mobile3'},
  {name: 'Sony Mobile4'},
  {name: 'Uasabi Ltd'},
  {name: 'Uasabi Ltd 1'},
];

test('it should filter results', assert => {
  assert.plan(5);

  assert.test('No input', expect(Init(companies), '', Init(companies)));
  assert.test('1 character', expect(Init(companies), 'a', {
    searchString: 'a',
    companies,
    searchResults: [],
    currentPage: 1,
    totalPages: 1,
    resultsPerPage: 5
  }));
  assert.test('2 character', expect(Init(companies), 'aa', {
    searchString: 'aa',
    companies,
    searchResults: [],
    currentPage: 1,
    totalPages: 1,
    resultsPerPage: 5
  }));
  assert.test('Valid search', expect(Init(companies), 'Uas', {
    searchString: 'Uas',
    companies,
    searchResults: [[companies[6], companies[7]]],
    currentPage: 1,
    totalPages: 1,
    resultsPerPage: 5
  }));
  assert.test('Grouped search', expect(Init(companies), 'Sony', {
    searchString: 'Sony',
    companies,
    searchResults: [
      [companies[0], companies[1], companies[2], companies[3], companies[4]],
      [companies[5]]
    ],
    currentPage: 1,
    totalPages: 2,
    resultsPerPage: 5
  }));

  function expect(initState, searchString, finalState) {
    return assert => {
      assert.plan(1);
      const state = Update(initState, createActionSearchChanged(searchString));
      assert.deepEqual(state, finalState);
    };
  }
});

test('it should show more results', assert => {
  assert.plan(2);

  assert.test('Increment page', expect({
    searchString: 'Sony',
    companies,
    searchResults: [
      [companies[0], companies[1], companies[2], companies[3], companies[4]],
      [companies[5]]
    ],
    currentPage: 1,
    totalPages: 2,
    resultsPerPage: 5
  }, {
    searchString: 'Sony',
    companies,
    searchResults: [
      [companies[0], companies[1], companies[2], companies[3], companies[4]],
      [companies[5]]
    ],
    currentPage: 2,
    totalPages: 2,
    resultsPerPage: 5
  }));
  assert.test('Not increment page further', expect({
    searchString: 'Sony',
    companies,
    searchResults: [
      [companies[0], companies[1], companies[2], companies[3], companies[4]],
      [companies[5]]
    ],
    currentPage: 2,
    totalPages: 2,
    resultsPerPage: 5
  }, {
    searchString: 'Sony',
    companies,
    searchResults: [
      [companies[0], companies[1], companies[2], companies[3], companies[4]],
      [companies[5]]
    ],
    currentPage: 2,
    totalPages: 2,
    resultsPerPage: 5
  }));

  function expect(initialState, finalState) {
    return assert => {
      assert.plan(1);
      assert.deepEqual(Update(initialState, createActionShowMore()), finalState);
    };
  }
});

test('it should clear the state', assert => {
  assert.plan(1);

  const state = Update({
    searchString: 'Sony',
    companies,
    searchResults: [
      [companies[0], companies[1], companies[2], companies[3], companies[4]],
      [companies[5]]
    ],
    currentPage: 1,
    totalPages: 2,
    resultsPerPage: 5
  }, createActionClearSearch());

  assert.deepEqual(state, {
    searchString: '',
    companies,
    searchResults: [],
    currentPage: 1,
    totalPages: 1,
    resultsPerPage: 5
  })
});
