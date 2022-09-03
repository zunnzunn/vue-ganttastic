import { computed } from "vue"

import { colorSchemes } from "../color-schemes"
import provideConfig from "../provider/provideConfig"

export default function useColorScheme() {
  const { colorScheme } = provideConfig()
  const colors = computed(() => {
    return typeof colorScheme.value !== "string"
      ? colorScheme.value
      : colorSchemes[colorScheme.value] || colorSchemes.default
  })

  return { colors }
}
