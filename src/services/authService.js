import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

export class AuthService {
  // Sign up with email and password
  static async signUp(email, password, userData = {}) {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Update user profile with display name
      if (userData.fullName) {
        await updateProfile(user, {
          displayName: userData.fullName,
        });
      }

      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        fullName: userData.fullName || '',
        phone: userData.phone || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      return { user, success: true };
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  // Sign in with email and password
  static async signIn(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return { user: userCredential.user, success: true };
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  // Sign out
  static async signOut() {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  // Reset password
  static async resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      return { success: true };
    } catch (error) {
      throw this.handleAuthError(error);
    }
  }

  // Get current user
  static getCurrentUser() {
    return auth.currentUser;
  }

  // Listen to auth state changes
  static onAuthStateChange(callback) {
    return onAuthStateChanged(auth, callback);
  }

  // Get user profile from Firestore
  static async getUserProfile(uid) {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        return userDoc.data();
      }
      return null;
    } catch (error) {
      throw new Error('Failed to fetch user profile');
    }
  }

  // Update user profile
  static async updateUserProfile(uid, updates) {
    try {
      await setDoc(doc(db, 'users', uid), {
        ...updates,
        updatedAt: new Date().toISOString(),
      }, { merge: true });
      return { success: true };
    } catch (error) {
      throw new Error('Failed to update user profile');
    }
  }

  // Handle Firebase auth errors
  static handleAuthError(error) {
    switch (error.code) {
      case 'auth/user-not-found':
        return new Error('No account found with this email address');
      case 'auth/wrong-password':
        return new Error('Incorrect password');
      case 'auth/email-already-in-use':
        return new Error('An account with this email already exists');
      case 'auth/weak-password':
        return new Error('Password should be at least 6 characters');
      case 'auth/invalid-email':
        return new Error('Invalid email address');
      case 'auth/too-many-requests':
        return new Error('Too many failed attempts. Please try again later');
      default:
        return new Error('Authentication failed. Please try again');
    }
  }
}

export default AuthService; 