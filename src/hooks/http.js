import { useReducer, useCallback } from 'react';

const INITIAL_STATE = {
  loading: false,
  error: null,
  data: null,
  extra: null,
  identifier: null
};

const httpReducer = (curHttpState, action) => {
  switch (action.type) {
    case 'SEND':
      return {
        loading: true,
        error: null,
        data: null,
        extra: null,
        identifier: action.identifier
      };
    case 'RESPONSE':
      return {
        ...curHttpState,
        loading: false,
        data: action.responseData,
        extra: action.extra
      };
    case 'ERROR':
      return { loading: false, error: action.errorMessage };
    case 'CLEAR':
      return INITIAL_STATE;
    default:
      throw new Error('Should not get here!');
  }
};

const useHttp = () => {
  const [httpState, dispatchHttp] = useReducer(httpReducer, INITIAL_STATE);

  const clear = useCallback(() => dispatchHttp({ type: 'CLEAR' }), []);

  const sendRequest = useCallback(
    (url, method, body, reqExtra, reqIdentifier) => {
      dispatchHttp({ type: 'SEND', identifier: reqIdentifier });
      fetch(url, {
        method,
        body,
        headers: { 'Content-Type': 'application/' }
      })
        .then(response => {
          return response.json();
        })
        .then(responseData => {
          dispatchHttp({ type: 'RESPONSE', responseData, extra: reqExtra });
        })
        .catch(error => {
          dispatchHttp({
            type: 'ERROR',
            errorMessage: 'Something went wrong!'
          });
        });
    },
    []
  );
  return {
    isLoading: httpState.loading,
    data: httpState.data,
    error: httpState.error,
    sendRequest,
    reqExtra: httpState.extra,
    reqIdentifier: httpState.identifier,
    clear
  };
};

export default useHttp;
