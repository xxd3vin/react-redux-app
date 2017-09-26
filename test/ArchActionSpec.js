import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import nock from 'nock';

const middlewares = [thunk];
const mockStore = configureMockStore(middlewares);

import * as actions from '../src/actions/arch';
import * as types from '../src/constants/ActionTypes';

describe('async actions', () => {
  afterEach(() => {
    nock.cleanAll()
  })

  it('creates FETCH_TODOS_SUCCESS when fetching todos has been done', () => {
    nock('undefined://127.0.0.1:3009undefined/')
      .get('/dept/query')
      .reply(200, { body: {
        success: true,
        message: null,
        data: []
      }})

    const expectedActions = [
      { type: types.LOAD_TABLEDATA },
      { type: types.LOAD_TABLEDATA_SUCCESS, body: { todos: ['do something']  } }
    ]
    const store = mockStore({ todos: [] })
debugger;
    return store.dispatch(actions.fetchTableBodyData('dept', 15, 0, 1, []))
      .then(() => { // return of async actions
        debugger;
        console.log('xxdebug', store.getActions());
        //assert.equal(store.getActions(), expectedActions);
      })
  })
})
