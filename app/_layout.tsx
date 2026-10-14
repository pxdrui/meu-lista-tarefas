import '../global.css'; 
import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#ed64a6' },
        headerTintColor: '#ffffff',
        contentStyle: { backgroundColor: '#f9fafb' },
      }}
    >
      <Stack.Screen name="index" options={{ title: '📋 Minhas Tarefas' }} />
      <Stack.Screen name="form" options={{ title: 'Nova Tarefa' }} />
    </Stack>
  );
}