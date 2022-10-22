import { AnyAction } from 'redux'
import { DIAGRAM_UPDATE } from '../constants/actions';
import { mocks } from '../../mock/mocks';
import { DiagramInterface } from '../../interfaces/diagram';

const initialState: DiagramInterface = mocks;

export const diagrams = (state = initialState, action: AnyAction) => {
  switch (action.type) {
    case DIAGRAM_UPDATE:
      return action.payload
    default:
      return state
  }
}