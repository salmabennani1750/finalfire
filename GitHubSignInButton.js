import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "./firebase";

function handleGitHubSignIn() {
  const provider = new GithubAuthProvider();
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      console.log("User signed in with GitHub:", user);
    })
    .catch((err) => {
      console.error(err instanceof Error ? err.message : "An unknown error occurred");
    });
}

document.getElementById("githubSignInButton").addEventListener("click", handleGitHubSignIn);
