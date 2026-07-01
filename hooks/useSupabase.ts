import { createClientSupabaseClient } from "@/lib/supabase";
import { useAuth } from "@clerk/expo";
import { useMemo } from "react";

export function useSupabase() {
  const { getToken } = useAuth();

  const client = useMemo(
    () => createClientSupabaseClient(() => getToken()),
    [getToken],
  );

  return client;
}
