import {
  INIT_DEMO_EDIT_FORM1_DATA, UPDATE_DEMO_EDIT_FORM1_FIELD_VALUE,
  INIT_DEMO_EDIT_FORM2_DATA, UPDATE_DEMO_EDIT_FORM2_FIELD_VALUE
} from '../constants/DemoActionTypes';

import update from 'react-addons-update';

const initState = {
  editFormData1: [],
  editFormData2: []
};

export default function arch(state = initState, action) {
  switch (action.type) {
    case UPDATE_DEMO_EDIT_FORM1_FIELD_VALUE:
      // Update single value inside specific array item
      // http://stackoverflow.com/questions/35628774/how-to-update-single-value-inside-specific-array-item-in-redux
      return update(state, { 
        editFormData1: { 
          [action.id]: {
            value: {$set: action.payload}
          }
        }
      });
    case INIT_DEMO_EDIT_FORM1_DATA:
      return {...state,
        editFormData1: action.formData
      }
    case UPDATE_DEMO_EDIT_FORM2_FIELD_VALUE:
      // Update single value inside specific array item
      // http://stackoverflow.com/questions/35628774/how-to-update-single-value-inside-specific-array-item-in-redux
      return update(state, { 
        editFormData2: { 
          [action.id]: {
            value: {$set: action.payload}
          }
        }
      });
    case INIT_DEMO_EDIT_FORM2_DATA:
      return {...state,
        editFormData2: action.formData
      }
    default:
      //console.log('[Demo reduer] Unknown action type:', action.type);
      return state;
  }
}
