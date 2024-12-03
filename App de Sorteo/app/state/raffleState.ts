export const initialState = {
  prizes: [],
  participants: [],
  winners: []
}

export function reducer(state: any, action: any) {
  switch (action.type) {
    case 'ADD_PRIZE':
      return {
        ...state,
        prizes: [...state.prizes, action.payload]
      }
    case 'SET_PARTICIPANTS':
      return {
        ...state,
        participants: action.payload
      }
    case 'ADD_WINNER':
      return {
        ...state,
        winners: [...state.winners, action.payload],
        prizes: state.prizes.slice(1)
      }
    default:
      return state
  }
}

