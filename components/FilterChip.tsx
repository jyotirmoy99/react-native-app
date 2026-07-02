import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface FilterChipProps {
  text: string;
  onRemove: () => void;
  icon?: React.ComponentProps<typeof Ionicons>["name"];
}

export default function FilterChip({ text, onRemove, icon }: FilterChipProps) {
  return (
    <View className="flex-row items-center bg-blue-50 border border-blue-200 rounded-full px-3 py-1 gap-1">
      {icon && <Ionicons name={icon} size={11} color="#1D4ED8" />}
      <Text className="text-blue-700 text-xs font-semibold capitalize">
        {text}
      </Text>
      <TouchableOpacity onPress={onRemove}>
        <Ionicons name="close" size={12} color="#1D4ED8" />
      </TouchableOpacity>
    </View>
  );
}
