import { PropertyType, useFilterStore } from "@/store/filterStore";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const TYPES: { label: string; value: PropertyType }[] = [
  { label: "All", value: null },
  { label: "Apartment", value: "apartment" },
  { label: "House", value: "house" },
  { label: "Villa", value: "villa" },
  { label: "Studio", value: "studio" },
];

const BEDS = [
  { label: "Any", value: null },
  { label: "1", value: 1 },
  { label: "2", value: 2 },
  { label: "3", value: 3 },
  { label: "4+", value: 4 },
];

const BATHS = [
  { label: "Any", value: null },
  { label: "1", value: 1 },
  { label: "2", value: 2 },
  { label: "3", value: 3 },
  { label: "4+", value: 4 },
];

const PRICE_PRESETS = [
  { label: "Under ₹50L", min: null, max: 5000000 },
  { label: "₹50L – ₹1Cr", min: 5000000, max: 10000000 },
  { label: "₹1Cr – ₹2Cr", min: 10000000, max: 20000000 },
  { label: "Above ₹2Cr", min: 20000000, max: null },
];

const chip = (active: boolean) =>
  `px-4 py-2 rounded-full border ${
    active ? "bg-blue-600 border-blue-600" : "bg-white border-gray-200"
  }`;

const chipText = (active: boolean) =>
  `text-sm font-semibold ${active ? "text-white" : "text-gray-600"}`;

export default function FilterModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const {
    type,
    bedrooms,
    bathrooms,
    minPrice,
    maxPrice,
    setType,
    setMinPrice,
    setMaxPrice,
    setBedrooms,
    setBathrooms,
    resetFilters,
  } = useFilterStore();

  const [localMin, setLocalMin] = useState<string>(
    minPrice ? String(minPrice) : "",
  );
  const [localMax, setLocalMax] = useState<string>(
    maxPrice ? String(maxPrice) : "",
  );

  // Sync local price fields with store values when modal opens or store values change
  useEffect(() => {
    if (visible) {
      setLocalMin(minPrice ? String(minPrice) : "");
      setLocalMax(maxPrice ? String(maxPrice) : "");
    }
  }, [visible, minPrice, maxPrice]);

  const activeCount = [type, bedrooms, bathrooms, minPrice, maxPrice].filter(
    (v) => v !== null,
  ).length;

  const handleReset = () => {
    setLocalMin("");
    setLocalMax("");
    resetFilters();
    onClose();
  };

  const shadowStyle = {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
  };

  const handleApply = () => {
    setMinPrice(localMin ? Number(localMin) : null);
    setMaxPrice(localMax ? Number(localMax) : null);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
      presentationStyle="pageSheet"
    >
      <View className="flex-1 bg-gray-50">
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 pt-6 pb-4 bg-white border-b border-gray-100">
          <TouchableOpacity onPress={onClose} className="p-1">
            <Ionicons name="close" size={22} color="#374151" />
          </TouchableOpacity>

          <Text className="text-lg font-bold text-gray-900">Filters</Text>
          <TouchableOpacity onPress={handleReset} className="p-1">
            <Text className="text-blue-600 font-semibold text-sm">Reset</Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
          showsVerticalScrollIndicator={false}
        >
          {/* Property Type */}
          <Text className="text-base font-bold text-gray-800 mb-3">
            Property Type
          </Text>
          <View className="flex-row flex-wrap gap-2 mb-6">
            {TYPES.map((t) => (
              <TouchableOpacity
                key={String(t.value)}
                onPress={() => setType(t.value)}
                className={chip(type === t.value)}
                style={shadowStyle}
              >
                <Text className={chipText(type === t.value)}>{t.label}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Bedrooms */}
          <Text className="text-base font-bold text-gray-800 mb-3">
            Bedrooms
          </Text>
          <View className="flex-row flex-wrap gap-2 mb-6">
            {BEDS.map((b) => (
              <TouchableOpacity
                key={String(b.value)}
                onPress={() => setBedrooms(b.value)}
                className={`flex-1 items-center py-3 rounded-2xl border ${
                  bedrooms === b.value
                    ? "bg-blue-600 border-blue-600"
                    : "bg-white border-gray-200"
                }`}
                style={shadowStyle}
              >
                <Text
                  className={`text-sm font-bold ${
                    bedrooms === b.value ? "text-white" : "text-gray-600"
                  }`}
                >
                  {b.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Bathrooms */}
          <Text className="text-base font-bold text-gray-800 mb-3">
            Bathrooms
          </Text>
          <View className="flex-row flex-wrap gap-2 mb-6">
            {BATHS.map((b) => (
              <TouchableOpacity
                key={String(b.value)}
                onPress={() => setBathrooms(b.value)}
                className={`flex-1 items-center py-3 rounded-2xl border ${
                  bathrooms === b.value
                    ? "bg-blue-600 border-blue-600"
                    : "bg-white border-gray-200"
                }`}
                style={shadowStyle}
              >
                <Text
                  className={`text-sm font-bold ${
                    bathrooms === b.value ? "text-white" : "text-gray-600"
                  }`}
                >
                  {b.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Price Range */}
          <Text className="text-base font-bold text-gray-800 mb-3">
            Price Range (₹)
          </Text>
          <View className="flex-row gap-3 mb-3">
            {[
              {
                label: "Min Price",
                value: localMin,
                onChange: setLocalMin,
                placeholder: "0",
              },
              {
                label: "Max Price",
                value: localMax,
                onChange: setLocalMax,
                placeholder: "1000000",
              },
            ].map(({ label, value, onChange, placeholder }) => (
              <View key={label} className="flex-1">
                <Text className="text-xs text-gray-500 mb-1.5 font-medium">
                  {label}
                </Text>
                <View
                  className="flex-row items-center bg-white rounded-2xl px-3 border border-gray-200"
                  style={shadowStyle}
                >
                  <Text className="text-gray-400 text-sm mr-1">₹</Text>
                  <TextInput
                    className="flex-1 py-3 text-gray-800"
                    placeholder={placeholder}
                    placeholderTextColor="#9CA3AF"
                    keyboardType="numeric"
                    value={value}
                    onChangeText={onChange}
                  />
                </View>
              </View>
            ))}
          </View>

          {/* Price Presets */}
          <View className="flex-row flex-wrap gap-2">
            {PRICE_PRESETS.map((preset) => {
              const isActive =
                minPrice === preset.min && maxPrice === preset.max;

              return (
                <TouchableOpacity
                  key={preset.label}
                  onPress={() => {
                    setLocalMin(preset.min ? String(preset.min) : "");
                    setLocalMax(preset.max ? String(preset.max) : "");
                    setMinPrice(preset.min);
                    setMaxPrice(preset.max);
                  }}
                  className={`px-3 py-1.5 rounded-full border ${
                    isActive
                      ? "bg-blue-50 border-blue-300"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <Text
                    className={`text-xs font-medium ${
                      isActive ? "text-blue-600" : "text-gray-500"
                    }`}
                  >
                    {preset.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        {/* Apply Button */}
        <View className="px-5 pb-8 pt-4 bg-white border-t border-gray-100">
          <TouchableOpacity
            onPress={handleApply}
            className="bg-blue-600 rounded-2xl py-4 items-center"
            style={{
              shadowColor: "#2563EB",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 4,
            }}
          >
            <Text className="text-white font-bold text-base">
              Apply Filters{activeCount > 0 ? ` (${activeCount})` : ""}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
