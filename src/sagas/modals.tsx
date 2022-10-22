import { put, takeLatest } from 'redux-saga/effects';
import { CLOSE_MODAL, OPEN_MODAL, SET_MODAL_DATA } from '../redux/actions/index';

function* openModal({ name, fn }: any) {
  yield put({
    type: SET_MODAL_DATA,
    name,
    data: {
      isVisible: true,
      fn
    }
  });
}

function* closeModal({ name }: any) {
  yield put({
    type: SET_MODAL_DATA,
    name,
    data: {
      isVisible: false
    }
  });
}

function* modals() {
  yield takeLatest(OPEN_MODAL, openModal);
  yield takeLatest(CLOSE_MODAL, closeModal);
}

export default modals;
