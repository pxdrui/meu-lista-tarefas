import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Task } from '../types/task';

interface TaskItemProps {
  task: Task;
  onToggle: (id: number, currentCompleted: number) => void;
  onDelete: (id: number) => void;
}

export function TaskItem({ task, onToggle, onDelete }: TaskItemProps) {
  const router = useRouter();
  const done = task.completed === 1;

  function confirmarExclusao() {
    Alert.alert('Excluir tarefa', `Deseja excluir "${task.title}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Excluir', style: 'destructive', onPress: () => onDelete(task.id) },
    ]);
  }

  return (
    <View className="bg-white mx-4 mb-3 p-4 rounded-xl flex-row items-center">
      <TouchableOpacity
        className={`w-7 h-7 rounded-full border-2 items-center justify-center mr-3 ${
          done ? 'bg-pink-200 border-pink-200' : 'border-gray-300'
        }`}
        onPress={() => onToggle(task.id, task.completed)}
      >
        {done && <Text className="text-white text-xs font-bold">✓</Text>}
      </TouchableOpacity>

      <View className="flex-1">
        <Text
          className={`text-base font-semibold ${
            done ? 'text-gray-400 line-through' : 'text-gray-800'
          }`}
        >
          {task.title}
        </Text>
        {task.description ? (
          <Text className="text-sm text-gray-500 mt-1">{task.description}</Text>
        ) : null}
        <Text className="text-xs text-gray-400 mt-1">
          {new Date(task.createdAt).toLocaleString('pt-BR')}
        </Text>
      </View>

      <TouchableOpacity
        className="p-2"
        onPress={() => router.push(`/form?id=${task.id}`)}
      >
        <Text className="text-xl">✏️</Text>
      </TouchableOpacity>

      <TouchableOpacity className="p-2" onPress={confirmarExclusao}>
        <Text className="text-xl">🗑️</Text>
      </TouchableOpacity>
    </View>
  );
}