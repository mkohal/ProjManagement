import { createSlice } from "@reduxjs/toolkit";

const AUTH_STORAGE_KEY = "syncora_auth";

const loadInitialState = () => {
  if (typeof window === "undefined") {
    return {
      user: null,
      accessToken: null,
      refreshToken: null,
    };
  }

  const persistedValue = window.localStorage.getItem(AUTH_STORAGE_KEY);

  if (!persistedValue) {
    return {
      user: null,
      accessToken: null,
      refreshToken: null,
    };
  }

  try {
    return JSON.parse(persistedValue);
  } catch {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);

    return {
      user: null,
      accessToken: null,
      refreshToken: null,
    };
  }
};

const persistState = (state) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(state));
};

const clearPersistedState = () => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(AUTH_STORAGE_KEY);
};

const initialState = loadInitialState();

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (state, action) => {
      state.user = action.payload.user ?? null;
      state.accessToken = action.payload.accessToken ?? null;
      state.refreshToken = action.payload.refreshToken ?? null;
      persistState(state);
    },
    setUser: (state, action) => {
      state.user = action.payload ?? null;
      persistState(state);
    },
    clearCredentials: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      clearPersistedState();
    },
  },
});

export const { setCredentials, setUser, clearCredentials } = authSlice.actions;

export default authSlice.reducer;
