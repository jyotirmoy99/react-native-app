import { Slot } from "expo-router";
import "../global.css";

export default function RootLayout() {
  // Slot is basically children component in React Native
  // There are two types of Navigation:
  // 1. Stack: Screen place on top of each other
  // 2. Tabs: Click on tab for switching screens
  // If we don't want any of these navigation then we use Slot
  return <Slot />;
}
