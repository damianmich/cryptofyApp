import { message } from "antd";
import { AppDispatch } from ".";
import { authActions } from "./auth-slice";

export const userAuthentication = (
  signInsignUp: boolean,
  enteredEmail: string,
  enteredPassword: string
) => {
  return async (dispatch: AppDispatch) => {
    const fetchData = async () => {
      const response = await fetch(
        signInsignUp
          ? `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyD7iYRBxMFOl9wjdKr3zW7mdkyNr2NDdcE`
          : `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyD7iYRBxMFOl9wjdKr3zW7mdkyNr2NDdcE`,
        {
          method: "POST",
          body: JSON.stringify({
            email: enteredEmail,
            password: enteredPassword,
            returnSecureToken: true,
          }),
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = await response.json();
      if (!response.ok) {
        let errorMessage = "Authentication is field!";
        if (data && data.error && data.error.message) {
          errorMessage = data.error.message;
          message.error(errorMessage);
          throw new Error(errorMessage);
        }
      }

      return data;
    };
    try {
      const authData = await fetchData();
      message.success(signInsignUp ? "Login successful" : "Sign up successful");
      dispatch(
        authActions.login({
          idToken: authData.idToken,
          localId: authData.localId,
        })
      );
    } catch (error: any) {
      // alert(error);
    }
  };
};
