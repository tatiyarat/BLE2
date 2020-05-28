
export const GET_NAME = 'GET_NAME';
export const GET_NAME_SUCCESS = 'GET_NAME_SUCCESS';
export const GET_NAME_FAIL = 'GET_NAME_FAIL';



export default function reducer(state = { location: "?" }, action) {
    switch (action.type) {
      case GET_NAME:
        return { ...state, loading: true };
      case GET_NAME_SUCCESS:
        return { ...state, loading: false, data: action.payload.data };
      case GET_NAME_FAIL:
        return {
          ...state,
          loading: false,
          error: 'Error while fetching repositories'
        };
      default:
        return state;
    }
  }