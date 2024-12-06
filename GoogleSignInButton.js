import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "./firebase";

function handleGoogleSignIn() {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      console.log("User signed in with Google:", user);
    })
    .catch((err) => {
      console.error(err instanceof Error ? err.message : "An unknown error occurred");
    });
}

document.getElementById("googleSignInButton").addEventListener("click", handleGoogleSignIn);
