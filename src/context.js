import React, { createContext, useContext, useMemo, useReducer } from "react";

const SET_WALLET = "SET_WALLET";
const LOG_OUT = "LOG_OUT";
const SET_LOADING = "SET_LOADING";
const SET_LOADING_MESSAGE = "SET_LOADING_MESSAGE";

const LoadingContext = createContext();
const UserContext = createContext();

const userReducer = (state, action) => {
  switch (action.type) {
    case SET_WALLET: {
      const { walletKey } = action.payload;
      return {
        loggedIn: walletKey ? true : false,
        walletKey,
      };
    }
    default:
      throw new Error(`Action is not supported: ${action.type}`);
  }
};

const loadingReducer = (state, action) => {
  switch (action.type) {
    case SET_LOADING: {
      const { loading } = action.payload;
      return { ...state, loading };
    }
    case SET_LOADING_MESSAGE: {
      const { loadingMessage } = action.payload;
      return { ...state, loadingMessage };
    }
    default:
      throw new Error(`Action not supported: ${action.type}`);
  }
};

export const UserProvider = (props) => {
  const [state, dispatch] = useReducer(userReducer, { loggedIn: false, walletKey: null });

  // useMemo to optimize the context value
  const value = useMemo(() => ({ state, dispatch }), [state]);

  return <UserContext.Provider value={value} {...props} />;
};

export const useUserContext = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUserContext must be used inside a UserProvider");
  }

  const { state, dispatch } = context;
  const { loggedIn, walletKey } = state;

  const setWalletKey = (walletKey) => {
    dispatch({ type: SET_WALLET, payload: { walletKey } });
  };

  return { loggedIn, walletKey, setWalletKey };
};

export const LoadingProvider = (props) => {
  const [state, dispatch] = useReducer(loadingReducer, {
    loading: true,
    loadingMessage: "Loading...",
  });
  const value = useMemo(() => ({ state, dispatch }), [state]);

  return <LoadingContext.Provider value={value} {...props} />;
};

export const useLoadingContext = () => {
  const context = useContext(LoadingContext);

  if (!context) {
    throw new Error("useLoadingContext must be used inside a LoadingProvider");
  }

  const { state, dispatch } = context;
  const { loading, loadingMessage } = state;

  const setLoadingMessage = (loadingMessage = "Loading...") => {
    dispatch({ type: SET_LOADING_MESSAGE, payload: { loadingMessage } });
  };

  const setLoading = (loading) => {
    dispatch({ type: SET_LOADING, payload: { loading } });
  };

  return { loading, loadingMessage, setLoading, setLoadingMessage };
};
