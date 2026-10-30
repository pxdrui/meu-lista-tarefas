import { useEffect, useState } from 'react';
import {
  ScrollView,
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { File, Paths } from 'expo-file-system';
import { CameraCapture } from '../src/components/CameraCapture';
import { useProfile } from '../src/hooks/useProfile';

export default function ProfileScreen() {
  const router = useRouter();
  const { profile, loading, saveProfile } = useProfile();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);

  // Preenche o formulário quando o perfil carrega do banco
  useEffect(() => {
    if (profile) {
      setName(profile.name);
      setEmail(profile.email);
      setPhotoUri(profile.photoUri);
    }
  }, [profile]);

  // O uri da câmera é temporário: copia para o diretório permanente
  function handlePhotoCapture(tempUri: string) {
    const destino = new File(Paths.document, `profile-${Date.now()}.jpg`);
    new File(tempUri).copy(destino);
    setPhotoUri(destino.uri);
    setShowCamera(false);
  }

  async function handleSave() {
    if (!name.trim() || !email.trim()) {
      Alert.alert('Atenção', 'Preencha nome e email.');
      return;
    }
    await saveProfile({ name: name.trim(), email: email.trim(), photoUri });
    router.back();
  }

  if (showCamera) {
    return (
      <CameraCapture
        onCapture={handlePhotoCapture}
        onClose={() => setShowCamera(false)}
      />
    );
  }

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Carregando...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-gray-50"
      contentContainerClassName="p-6 items-center"
    >
      <TouchableOpacity onPress={() => setShowCamera(true)} className="mb-6">
        {photoUri ? (
          <Image
            source={{ uri: photoUri }}
            className="w-40 h-40 rounded-full"
          />
        ) : (
          <View className="w-40 h-40 rounded-full bg-gray-200 items-center justify-center">
            <Text className="text-5xl">👤</Text>
          </View>
        )}
        <Text className="text-indigo-600 text-center mt-2">
          {photoUri ? 'Trocar foto' : 'Tirar foto'}
        </Text>
      </TouchableOpacity>

      <TextInput
        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 mb-4"
        placeholder="Nome"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 mb-6"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TouchableOpacity
        className="w-full bg-indigo-600 py-3 rounded-lg"
        onPress={handleSave}
      >
        <Text className="text-white font-bold text-center">Salvar</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}