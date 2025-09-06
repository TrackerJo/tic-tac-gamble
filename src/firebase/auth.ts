import { getAuth, signInAnonymously } from "firebase/auth";
import { app } from "./init";

const auth = getAuth(app);

export async function signInAnon() {
    const user = await signInAnonymously(auth);
    localStorage.setItem('userId', user.user.uid);


}