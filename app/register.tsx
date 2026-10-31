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

export default function RegisterScreen() {
  const router = useRouter();
  const { signUp, loading: authLoading } = useAuthContext();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleRegister() {
    if (!email.trim() || !password.trim() || !confirmPassword.trim()) {
      Alert.alert('Campos obrigatórios', 'Preencha todos os campos.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Senha muito curta', 'Use pelo menos 6 caracteres.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Senhas não coincidem', 'As senhas digitadas são diferentes.');
      return;
    }
    try {
      setLoading(true);
      await signUp(email.trim(), password); // faz login automático
    } catch (error: any) {
      Alert.alert('Erro ao criar conta', error.message || 'Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  if (authLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-pink-50">
        <ActivityIndicator size="large" color="#f9a8d4" />
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
            Criar conta 🚀
          </Text>
          <Text className="text-base text-pink-700 mb-8">
            Cadastre-se para organizar suas tarefas
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
            placeholder="Mínimo 6 caracteres"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
          />

          <Text className="text-sm font-medium text-pink-900 mb-2">
            Confirmar senha
          </Text>
          <TextInput
            className="bg-white border border-pink-200 rounded-xl px-4 py-3 mb-6"
            placeholder="Digite a senha novamente"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
          />

          <TouchableOpacity
            className={`rounded-xl py-4 mb-6 ${
              loading ? 'bg-pink-100' : 'bg-pink-200'
            }`}
            onPress={handleRegister}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#831843" />
            ) : (
              <Text className="text-pink-900 text-center text-base font-semibold">
                Criar conta
              </Text>
            )}
          </TouchableOpacity>

          <View className="flex-row items-center justify-center">
            <Text className="text-pink-700 text-sm">Já tem uma conta? </Text>
            <TouchableOpacity onPress={() => router.back()} disabled={loading}>
              <Text className="text-pink-600 text-sm font-semibold">
                Entrar
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}