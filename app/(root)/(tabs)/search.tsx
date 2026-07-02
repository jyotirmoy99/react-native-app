import FilterChip from "@/components/FilterChip";
import FilterModal from "@/components/FilterModal";
import PropertyCard from "@/components/PropertyCard";
import { supabase } from "@/lib/supabase";
import { escapePostgRESTSearch, formatPrice } from "@/lib/utils";
import { useFilterStore } from "@/store/filterStore";
import { Property } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SearchScreen() {
  const [results, setResults] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const { openFilters } = useLocalSearchParams<{ openFilters?: string }>();

  const {
    type,
    search,
    bedrooms,
    bathrooms,
    minPrice,
    maxPrice,
    setType,
    setSearch,
    setMinPrice,
    setMaxPrice,
    setBedrooms,
    setBathrooms,
  } = useFilterStore((state) => state);

  const activeFiltersCount = [
    type !== null,
    bedrooms !== null,
    bathrooms !== null,
    minPrice !== null,
    maxPrice !== null,
  ].filter(Boolean).length;

  const fetchResults = async () => {
    setLoading(true);

    try {
      let query = supabase.from("properties").select("*");

      if (search) {
        const escapedSearch = escapePostgRESTSearch(search);
        query = query.or(
          `title.ilike.%${escapedSearch}%,city.ilike.%${escapedSearch}%`,
        );
      }

      if (type) {
        query = query.eq("type", type);
      }

      if (bedrooms) {
        query = query.eq("bedrooms", bedrooms);
      }

      if (bathrooms) {
        query = query.eq("bathrooms", bathrooms);
      }

      if (minPrice) {
        query = query.gte("price", minPrice);
      }

      if (maxPrice) {
        query = query.lte("price", maxPrice);
      }

      const { data, error } = await query.order("created_at", {
        ascending: false,
      });

      if (error) {
        throw error;
      }

      setResults(data ?? []);
    } catch (error) {
      console.error("Error fetching properties:", error);

      // TODO: Show toast message
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (openFilters === "true") {
      setShowFilters(true);
    }
  }, [openFilters]);

  useEffect(() => {
    fetchResults();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, type, bedrooms, bathrooms, minPrice, maxPrice]);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-5 pt-4 pb-3">
        <Text className="text-2xl font-bold text-gray-900 mb-4">
          Find Property
        </Text>

        <View className="flex-row items-center gap-3">
          <View
            className="flex-1 flex-row items-center bg-white rounded-2xl px-4 gap-3"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.06,
              shadowRadius: 6,
              elevation: 2,
            }}
          >
            <Ionicons name="search-outline" size={18} color="#9ca3af" />
            <TextInput
              className="flex-1 py-3 text-gray-800"
              placeholder="Search by title or city..."
              placeholderTextColor="#9ca3af"
              value={search}
              onChangeText={setSearch}
              autoCapitalize="none"
            />

            {/* Close search option */}
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch("")}>
                <Ionicons name="close-circle" size={18} color="#9ca3af" />
              </TouchableOpacity>
            )}
          </View>

          {/* Filter button */}
          <TouchableOpacity
            className={`w-12 h-12 rounded-2xl items-center justify-center ${
              activeFiltersCount > 0 ? "bg-blue-600" : "bg-white"
            }`}
            onPress={() => setShowFilters(!showFilters)}
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.06,
              shadowRadius: 6,
              elevation: 2,
            }}
          >
            <Ionicons
              name="filter-outline"
              size={20}
              color={activeFiltersCount > 0 ? "#fff" : "#374151"}
            />

            {activeFiltersCount > 0 && (
              <View className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full items-center justify-center">
                <Text className="text-white text-xs font-bold">
                  {activeFiltersCount}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* Filter chips */}
        {activeFiltersCount > 0 && (
          <View className="flex-row flex-wrap gap-2 mt-3">
            {type && <FilterChip text={type} onRemove={() => setType(null)} />}

            {bedrooms !== null && (
              <FilterChip
                text={
                  bedrooms === 4
                    ? "4+ beds"
                    : `${bedrooms} bed${bedrooms > 1 ? "s" : ""}`
                }
                icon="bed-outline"
                onRemove={() => setBedrooms(null)}
              />
            )}

            {bathrooms !== null && (
              <FilterChip
                text={
                  bathrooms === 4
                    ? "4+ baths"
                    : `${bathrooms} bath${bathrooms > 1 ? "s" : ""}`
                }
                icon="water-outline"
                onRemove={() => setBathrooms(null)}
              />
            )}

            {(minPrice !== null || maxPrice !== null) && (
              <FilterChip
                text={
                  minPrice && maxPrice
                    ? `${formatPrice(minPrice)} – ${formatPrice(maxPrice)}`
                    : minPrice
                      ? `From ${formatPrice(minPrice)}`
                      : `Up to ${formatPrice(maxPrice!)}`
                }
                icon="cash-outline"
                onRemove={() => {
                  setMinPrice(null);
                  setMaxPrice(null);
                }}
              />
            )}
          </View>
        )}
      </View>

      {/* Search results */}
      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => <PropertyCard property={item} />}
        ListHeaderComponent={
          <Text className="text-sm text-gray-400 mb-4">
            {loading ? "Searching..." : `${results.length} properties found`}
          </Text>
        }
        ListEmptyComponent={
          !loading ? (
            <View className="items-center py-20">
              <Ionicons name="search-outline" size={48} color="#D1D5DB" />
              <Text className="text-gray-400 mt-4 text-base">
                No properties found
              </Text>
              <Text className="text-gray-300 text-sm mt-1">
                Try a different search or adjust filters
              </Text>
            </View>
          ) : (
            <ActivityIndicator size="large" color="#2563EB" className="py-20" />
          )
        }
      />

      {/* Filter modal */}
      <FilterModal
        visible={showFilters}
        onClose={() => setShowFilters(false)}
      />
    </SafeAreaView>
  );
}
