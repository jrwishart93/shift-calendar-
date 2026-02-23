"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  browserLocalPersistence,
  onAuthStateChanged,
  setPersistence,
  signInWithEmailAndPassword,
  signOut as firebaseSignOut,
  type User,
} from "firebase/auth";

import { getFirebaseAuth } from "@/lib/firebase";
import { signUp as signUpWithSetup, type SignUpResult } from "@/lib/signup";

type AuthError = Error | null;

type UseAuthResult = {
  currentUser: User | null;
  loading: boolean;
  error: AuthError;
  signUp: (email: string, password: string, displayName: string, accessCode?: string) => Promise<SignUpResult>;
  signIn: (email: string, password: string) => Promise<User>;
  signOut: () => Promise<void>;
};

export function useAuth(): UseAuthResult {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AuthError>(null);

  useEffect(() => {
    const auth = getFirebaseAuth();

    setPersistence(auth, browserLocalPersistence).catch((persistenceError) => {
      console.error("Failed to enable local auth persistence:", persistenceError);
    });

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signUp = useCallback(async (email: string, password: string, displayName: string, accessCode?: string) => {
    setError(null);
    try {
      const result = await signUpWithSetup(email, password, displayName, accessCode);
      return result;
    } catch (err) {
      const normalizedError = err instanceof Error ? err : new Error("Sign up failed");
      setError(normalizedError);
      throw normalizedError;
    }
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    setError(null);
    try {
      const auth = getFirebaseAuth();
      const credential = await signInWithEmailAndPassword(auth, email, password);
      console.log("Sign in successful.");
      return credential.user;
    } catch (err) {
      const normalizedError = err instanceof Error ? err : new Error("Sign in failed");
      setError(normalizedError);
      throw normalizedError;
    }
  }, []);

  const signOut = useCallback(async () => {
    setError(null);
    try {
      const auth = getFirebaseAuth();
      await firebaseSignOut(auth);
      console.log("Signed out successfully.");
    } catch (err) {
      const normalizedError = err instanceof Error ? err : new Error("Sign out failed");
      setError(normalizedError);
      throw normalizedError;
    }
  }, []);

  return useMemo(
    () => ({
      currentUser,
      loading,
      error,
      signUp,
      signIn,
      signOut,
    }),
    [currentUser, error, loading, signIn, signOut, signUp],
  );
}
