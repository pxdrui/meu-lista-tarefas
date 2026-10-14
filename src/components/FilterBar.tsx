import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { TaskFilter } from '../types/task';

interface FilterBarProps {
  filter: TaskFilter;
  onFilterChange: (filter: TaskFilter) => void;
  counts: { all: number; pending: number; completed: number };
}

const OPTIONS: { value: TaskFilter; label: string }[] = [
  { value: 'all', label: 'Todas' },
  { value: 'pending', label: 'Pendentes' },
  { value: 'completed', label: 'Concluídas' },
];

export function FilterBar({ filter, onFilterChange, counts }: FilterBarProps) {
  return (
    <View className="flex-row bg-white p-2 mx-4 mt-4 rounded-xl">
      {OPTIONS.map((option) => {
        const active = filter === option.value;
        return (
          <TouchableOpacity
            key={option.value}
            className={`flex-1 py-2 rounded-lg ${
              active ? 'bg-pink-200' : 'bg-transparent'
            }`}
            onPress={() => onFilterChange(option.value)}
          >
            <Text
              className={`text-center text-sm font-semibold ${
                active ? 'text-white' : 'text-gray-600'
              }`}
            >
              {option.label} ({counts[option.value]})
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}