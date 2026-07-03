import { useAuth } from "@clerk/expo";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { useSupabase } from "./useSupabase";

export function useSavedProperty(propertyId: string, onUnsave?: () => void) {
  const { userId } = useAuth();
  const authSupabase = useSupabase();

  const [isSaved, setIsSaved] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  const checkIfSaved = useCallback(async () => {
    if (!userId || !propertyId) {
      setIsSaved(false);
      return;
    }

    const { data, error } = await authSupabase
      .from("saved_properties")
      .select("id")
      .eq("user_clerk_id", userId)
      .eq("property_id", propertyId)
      .maybeSingle();

    if (error) {
      console.error("Error checking saved property:", error);
      return;
    }

    setIsSaved(!!data);
  }, [userId, propertyId, authSupabase]);

  useEffect(() => {
    checkIfSaved();
  }, [checkIfSaved]);

  useFocusEffect(
    useCallback(() => {
      checkIfSaved();
    }, [checkIfSaved]),
  );

  const toggleSaveProperty = async () => {
    if (!userId || !propertyId || saveLoading) return;

    setSaveLoading(true);

    try {
      if (isSaved) {
        // Unsave property
        const { data, error } = await authSupabase
          .from("saved_properties")
          .delete()
          .eq("user_clerk_id", userId)
          .eq("property_id", propertyId)
          .select("id")
          .maybeSingle();

        if (error) {
          console.error("Error unsaving property:", error);
          return;
        }

        if (data) {
          setIsSaved(false);
          onUnsave?.();
        }
      } else {
        // Save property
        const { data, error } = await authSupabase
          .from("saved_properties")
          .insert({
            user_clerk_id: userId,
            property_id: propertyId,
          })
          .select("id")
          .maybeSingle();

        if (error) {
          console.error("Error saving property:", error);
          return;
        }

        if (data) {
          setIsSaved(true);
        }
      }
    } finally {
      setSaveLoading(false);
    }
  };

  return { isSaved, toggleSaveProperty, saveLoading };
}
