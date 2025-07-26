import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, User, Auth } from 'firebase/auth';



const app = initializeApp();
const auth: Auth = getAuth(app);

export class LoginService {
    static signIn(email: string, password: string): Promise<User> {
        return signInWithEmailAndPassword(auth, email, password).then(cred => cred.user);
    }

    static signOut(): Promise<void> {
        return signOut(auth);
    }

    static onAuthStateChanged(callback: (user: User | null) => void): () => void {
        return onAuthStateChanged(auth, callback);
    }

    static getCurrentUser(): User | null {
        return auth.currentUser;
    }
}