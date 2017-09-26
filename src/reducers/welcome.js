// import { welcomeType } from '../actions/actionType';

const initWelcomeState = {
  UserInfoWidget: {
    numbers: {
      'total_user_number': 0,
      'active_user_number': 0,
      'inactive_user_number': 0,
      'forbidden_user_number': 0,
      'unknown_user_number': 0
    }
  }
};

/**
 * welcome
 * Created by better on 16/1/26.
 */
export default function welcome(state = initWelcomeState, action) {
  switch (action.type) {
    default:
      return state;
  }
}
