import { computed } from "vue"

import { colorSchemes } from "../color-schemes"
import useConfig from "./useConfig"

export default function useColorScheme() {
  const { colorScheme } = useConfig()
  const colors = computed(() => {
    return typeof colorScheme.value !== "string"
      ? colorScheme.value
      : colorSchemes[colorScheme.value] || colorSchemes.default
  })

  return { colors }
}
