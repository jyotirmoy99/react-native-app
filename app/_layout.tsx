import { ClerkProvider } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { Slot } from "expo-router";
// import { View } from "react-native";
import "../global.css";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error("Add your Clerk Publishable Key to the .env file");
}

export default function RootLayout() {
  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <Slot />
      {/* <View className="bg-violet-500 w-full h-40"></View>
      <View className="bg-indigo-500 w-full h-40"></View>
      <View className="bg-blue-500 w-full h-40"></View>
      <View className="bg-green-500 w-full h-40"></View>
      <View className="bg-yellow-500 w-full h-40"></View>
      <View className="bg-orange-500 w-full h-40"></View>
      <View className="bg-red-500 w-full h-40"></View> */}
    </ClerkProvider>
  );
}
