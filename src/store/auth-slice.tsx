import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: { isLogged: false, token: "", localId: "" as any },
  reducers: {
    login(state, action) {
      state.isLogged = true;
      state.token = action.payload.idToken;
      state.localId = action.payload.email;

      localStorage.setItem("token", action.payload.idToken);
      localStorage.setItem("localId", action.payload.localId);
    },
    logout(state) {
      state.isLogged = false;
      state.token = "";
      state.localId = "";
      localStorage.removeItem("token");
      localStorage.removeItem("localId");
    },
    initialStoredToken(state) {
      const storedLocalId = localStorage.getItem("localId");
      const storedToken = localStorage.getItem("token");
      if (storedToken) {
        state.token = storedToken;
        state.localId = storedLocalId;
        state.isLogged = true;
      }
    },
  },
});

export const authActions = authSlice.actions;
export default authSlice;
