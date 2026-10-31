import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { useTasks } from '../src/hooks/useTasks';
import { useAuthContext } from '../src/contexts/AuthContext';
import { TaskItem } from '../src/components/TaskItem';
import { FilterBar } from '../src/components/FilterBar';
import { EmptyState } from '../src/components/EmptyState';

export default function HomeScreen() {
  const router = useRouter();
  const { signOut } = useAuthContext();
  const {
    tasks,
    allTasksCount,
    pendingCount,
    completedCount,
    filter,
    loading,
    setFilter,
    toggleTask,
    removeTask,
  } = useTasks();

  return (
    <>
      <Stack.Screen
        options={{
          headerRight: () => (
            <View className="flex-row gap-4">
              <TouchableOpacity onPress={() => router.push('/profile')}>
                <Text className="text-3xl">👤</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={signOut}>
                <Text className="text-3xl">🚪</Text>
              </TouchableOpacity>
            </View>
          ),
        }}
      />

      <View className="flex-1 bg-gray-50">
        <FilterBar
          filter={filter}
          onFilterChange={setFilter}
          counts={{
            all: allTasksCount,
            pending: pendingCount,
            completed: completedCount,
          }}
        />

        {loading && tasks.length === 0 ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#4f46e5" />
          </View>
        ) : (
          <FlatList
            data={tasks}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <TaskItem
                task={item}
                onToggle={toggleTask}
                onDelete={removeTask}
              />
            )}
            ListEmptyComponent={<EmptyState filter={filter} />}
            contentContainerStyle={{
              flexGrow: 1,
              paddingTop: 16,
              paddingBottom: 96,
            }}
          />
        )}

        <TouchableOpacity
          className="absolute bottom-6 right-6 w-14 h-14 rounded-full bg-pink-200 items-center justify-center"
          style={{ elevation: 6 }}
          onPress={() => router.push('/form')}
        >
          <Text className="text-white text-3xl font-bold">+</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}