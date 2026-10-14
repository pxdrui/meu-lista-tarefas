import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import * as TaskRepository from '../src/database/taskRepository';

export default function FormScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  const isEditing = !!id; // true se /form?id=5, false se só /form
  const router = useRouter();
  const navigation = useNavigation();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  // Ajusta o título do cabeçalho conforme o modo
  useEffect(() => {
    navigation.setOptions({
      title: isEditing ? 'Editar Tarefa' : 'Nova Tarefa',
    });
  }, [isEditing, navigation]);

  // No modo edição, carrega a tarefa do banco
  useEffect(() => {
    if (!isEditing) return;
    (async () => {
      const task = await TaskRepository.getTaskById(Number(id));
      if (task) {
        setTitle(task.title);
        setDescription(task.description ?? '');
      }
    })();
  }, [id, isEditing]);

  async function salvar() {
    if (title.trim() === '') {
      Alert.alert('Título obrigatório', 'Digite um título para a tarefa.');
      return;
    }

    const desc = description.trim() === '' ? null : description.trim();

    try {
      setSaving(true);
      if (isEditing) {
        await TaskRepository.updateTask({
          id: Number(id),
          title: title.trim(),
          description: desc,
        });
      } else {
        await TaskRepository.createTask({ title: title.trim(), description: desc });
      }
      router.back();
    } catch (error) {
      console.error('Erro ao salvar tarefa:', error);
      Alert.alert('Erro', 'Não foi possível salvar a tarefa.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      className="flex-1"
    >
      <ScrollView
        contentContainerClassName="p-4"
        keyboardShouldPersistTaps="handled"
      >
        <Text className="text-sm font-medium text-gray-700 mb-2">Título *</Text>
        <TextInput
          className="bg-white border border-gray-300 rounded-xl px-4 py-3 text-base text-gray-800 mb-4"
          placeholder="Ex: Estudar para a prova"
          value={title}
          onChangeText={setTitle}
          editable={!saving}
        />

        <Text className="text-sm font-medium text-gray-700 mb-2">
          Descrição
        </Text>
        <TextInput
          className="bg-white border border-gray-300 rounded-xl px-4 py-3 text-base text-gray-800 mb-6"
          placeholder="Detalhes (opcional)"
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
          style={{ minHeight: 100 }}
          editable={!saving}
        />

        <TouchableOpacity
          className={`rounded-xl py-4 ${saving ? 'bg-pink-200' : 'bg-pink-200'}`}
          onPress={salvar}
          disabled={saving}
        >
          <Text className="text-white text-center text-base font-semibold">
            {isEditing ? 'Salvar alterações' : 'Adicionar tarefa'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}