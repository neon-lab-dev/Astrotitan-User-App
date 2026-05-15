import { Colors } from "@/constants/theme";
import { useColorScheme } from "./use-color-scheme.web";

export function useTheme() {
  const scheme = useColorScheme() ?? "light";
  return Colors[scheme];
}
