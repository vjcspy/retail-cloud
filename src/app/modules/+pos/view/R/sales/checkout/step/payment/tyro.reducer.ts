import {ActionReducer} from "@ngrx/store";
import {Payment3rd, PosStepStateRecord} from "../step.state";
import {PosStepActions} from "../step.actions";
import {List} from "immutable";
import {TyroActions} from "./tyro.actions";

export const tyroReducer: ActionReducer<PosStepStateRecord> = (state, action) => {
  switch (action.type) {
    case PosStepActions.ACTION_ADD_PAYMENT_METHOD_TO_ORDER:
      const payment = action.payload['payment'];
      if (payment['type'] === 'tyro') {
        return state.update('listPayment3rdData', (list: List<Payment3rd>) => list.push({
                                                                                          type: 'tyro',
                                                                                          isPaySuccess: false,
                                                                                          inUse: true,
                                                                                          additionData: Object.assign({
                                                                                                                        message: '',
                                                                                                                        questions: []
                                                                                                                      }, payment['payment_data'])
                                                                                        }));
      } else {
        return state;
      }
    
    case TyroActions.ACTION_SELECT_ANSWER:
      return state.update('listPayment3rdData', (list: List<Payment3rd>) => {
        const tyroPaymentIndex = list.findIndex((p) => p['type'] === 'tyro');
        if (tyroPaymentIndex > -1) {
          return list.update(tyroPaymentIndex, (p) => {
            let _newP = Object.assign({}, {...p});
            if (_newP['additionData'].hasOwnProperty('questions')) {
              _newP['additionData']['questions'] = [];
            }
            return _newP;
          });
        }
      });
    
    default:
      return state;
  }
};
