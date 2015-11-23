import { ADD_TAG, EDIT_TAG_TITLE, FILE_LOADED } from '../constants/ActionTypes'
import { tag } from 'store/initialState'

const initialState = [tag]

export default function tags (state = initialState, action) {
  switch (action.type) {
    case ADD_TAG:
      return [{
        id: state.reduce((maxId, tag) => Math.max(tag.id, maxId), -1) + 1,
        title: action.title
      }, ...state]

    case EDIT_TAG_TITLE:
      return state.map(tag =>
        tag.id === action.id ? Object.assign({}, tag, {title: action.title}) : tag
      )

    case FILE_LOADED:
      return action.data.tags

    default:
      return state
  }
}