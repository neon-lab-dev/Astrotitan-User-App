import { Stack } from "expo-router";

export default function AstrologerLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "none",
      }}
    />
  );
}