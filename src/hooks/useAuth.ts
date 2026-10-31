import { useState, useEffect, useCallback } from 'react';
import {
  signInWithEmailAndPassword as firebaseSignIn,
  createUserWithEmailAndPassword as firebaseSignUp,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithCredential,
  type User,
} from 'firebase/auth';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';
import { auth } from '../services/firebaseConfig';
import { AuthUser, UseAuthReturn } from '../types/auth';

WebBrowser.maybeCompleteAuthSession();

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? '';

  const [request, response, promptAsync] = Google.useAuthRequest({
    webClientId,
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ?? webClientId,
    androidClientId:
      process.env.EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID ?? webClientId,
  });

  // Quando o Google devolve o id_token, entra no Firebase com ele
  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential).catch((error) => {
        console.error('Erro ao fazer login com Google:', error);
        alert('Erro ao fazer login com Google. Tente novamente.');
      });
    }
  }, [response]);

  // Observa login, logout e sessão restaurada ao abrir o app
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      auth,
      (firebaseUser: User | null) => {
        if (firebaseUser) {
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
          });
        } else {
          setUser(null);
        }
        setLoading(false);
      },
    );
    return unsubscribe;
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      await firebaseSignIn(auth, email, password);
    } catch (error: any) {
      throw new Error(getErrorMessage(error.code));
    }
  }, []);

  const signUp = useCallback(async (email: string, password: string) => {
    try {
      await firebaseSignUp(auth, email, password);
    } catch (error: any) {
      throw new Error(getErrorMessage(error.code));
    }
  }, []);

  const signInWithGoogle = useCallback(async () => {
    if (!request) {
      alert('Configuração do Google ainda não está pronta. Aguarde...');
      return;
    }
    await promptAsync();
  }, [request, promptAsync]);

  const signOut = useCallback(async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
      alert('Erro ao sair. Tente novamente.');
    }
  }, []);

  return { user, loading, signIn, signUp, signInWithGoogle, signOut };
}

function getErrorMessage(code: string): string {
  const messages: Record<string, string> = {
    'auth/invalid-credential': 'Email ou senha incorretos.',
    'auth/user-not-found': 'Email não cadastrado.',
    'auth/wrong-password': 'Senha incorreta.',
    'auth/email-already-in-use': 'Este email já está em uso.',
    'auth/weak-password': 'A senha deve ter pelo menos 6 caracteres.',
    'auth/invalid-email': 'Email inválido.',
    'auth/too-many-requests': 'Muitas tentativas. Tente novamente mais tarde.',
    'auth/network-request-failed': 'Erro de conexão. Verifique sua internet.',
  };
  return messages[code] || 'Erro ao processar sua solicitação.';
}