import * as types from '../constants/DemoActionTypes';
import fetch from 'isomorphic-fetch';
import _ from 'lodash';

export function updateDemoEditForm1FieldValue(label, value) {
  return (dispatch, getState) => {
    const { demo: { editFormData1 } } = getState();
    const id = _.findIndex(editFormData1, field => field.label === label);
    // TODO(chenyangf@yonyou.com): Dont touch state when value not changed.
    dispatch({
      type: types.UPDATE_DEMO_EDIT_FORM1_FIELD_VALUE,
      id,
      payload: value
    });
  };
};

export function initDemoEditForm1Data(formData) {
  return dispatch => {
    dispatch({
      type: types.INIT_DEMO_EDIT_FORM1_DATA,
      formData
    });
  };
};

export function updateDemoEditForm2FieldValue(label, value) {
  return (dispatch, getState) => {
    const { demo: { editFormData2 } } = getState();
    const id = _.findIndex(editFormData2, field => field.label === label);
    // TODO(chenyangf@yonyou.com): Dont touch state when value not changed.
    dispatch({
      type: types.UPDATE_DEMO_EDIT_FORM2_FIELD_VALUE,
      id,
      payload: value
    });
  };
};

export function initDemoEditForm2Data(formData) {
  return dispatch => {
    dispatch({
      type: types.INIT_DEMO_EDIT_FORM2_DATA,
      formData
    });
  };
};
