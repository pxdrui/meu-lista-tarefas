import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { useAuthContext } from '../src/contexts/AuthContext';

export default function LoginScreen() {
  const router = useRouter();
  const { loading: authLoading, signIn, signInWithGoogle } = useAuthContext();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Campos obrigatórios', 'Preencha email e senha.');
      return;
    }
    try {
      setLoading(true);
      await signIn(email.trim(), password); // o _layout redireciona sozinho
    } catch (error: any) {
      Alert.alert('Erro ao fazer login', error.message || 'Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    try {
      setLoading(true);
      await signInWithGoogle();
    } catch (error: any) {
      Alert.alert('Erro com Google', error.message || 'Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  if (authLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-pink-50">
        <ActivityIndicator size="large" color="#f9a8d4" />
        <Text className="mt-4 text-pink-900">Verificando autenticação...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1"
    >
      <ScrollView
        contentContainerClassName="flex-1"
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 bg-pink-50 px-6 justify-center">
          <Text className="text-4xl font-bold text-pink-900 mb-2">
            Bem-vindo! 👋
          </Text>
          <Text className="text-base text-pink-700 mb-8">
            Faça login para acessar suas tarefas
          </Text>

          <Text className="text-sm font-medium text-pink-900 mb-2">Email</Text>
          <TextInput
            className="bg-white border border-pink-200 rounded-xl px-4 py-3 mb-6"
            placeholder="seu@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
          />

          <Text className="text-sm font-medium text-pink-900 mb-2">Senha</Text>
          <TextInput
            className="bg-white border border-pink-200 rounded-xl px-4 py-3 mb-6"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
          />

          <TouchableOpacity
            className={`rounded-xl py-4 mb-4 ${
              loading ? 'bg-pink-100' : 'bg-pink-200'
            }`}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#831843" />
            ) : (
              <Text className="text-pink-900 text-center text-base font-semibold">
                Entrar
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-white border border-pink-200 rounded-xl py-4 mb-6"
            onPress={handleGoogleLogin}
            disabled={loading}
          >
            <Text className="text-pink-900 text-center text-base font-semibold">
              🔍 Entrar com Google
            </Text>
          </TouchableOpacity>

          <View className="flex-row items-center justify-center">
            <Text className="text-pink-700 text-sm">Não tem uma conta? </Text>
            <TouchableOpacity
              onPress={() => router.push('/register')}
              disabled={loading}
            >
              <Text className="text-pink-600 text-sm font-semibold">
                Cadastre-se
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}