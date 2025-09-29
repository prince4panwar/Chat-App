import React from "react";
import { auth, provider } from "../firebase-config";
import { signInWithPopup } from "firebase/auth";
import Cookies from "universal-cookie";

const cookies = new Cookies();
function Auth({ setIsAuthenticated }) {
  const signInWithGoggle = async () => {
    // Implement Google OAuth sign-in logic here
    try {
      const result = await signInWithPopup(auth, provider);
      // Set the user's token in the browser's cookies
      cookies.set("auth-token", result.user.refreshToken);
      setIsAuthenticated(true);
    } catch (error) {
      console.error("Error during Google Sign-in:", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4">
      <p className="text-black font-semibold text-2xl">
        Sign In With Google To Continue
      </p>
      <button
        onClick={signInWithGoggle}
        className="bg-amber-600 p-3 rounded-lg text-white font-semibold hover:bg-amber-800 transition duration-300 cursor-pointer"
      >
        Sign in with google
      </button>
    </div>
  );
}

export default Auth;
