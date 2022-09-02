import { computed } from "vue"

import { colorSchemes } from "../color-schemes"
import useContext from "./useContext"

export default function useColorScheme() {
  const { config } = useContext()
  const { colorScheme } = config
  const colors = computed(() => {
    return typeof colorScheme.value !== "string"
      ? colorScheme.value
      : colorSchemes[colorScheme.value] || colorSchemes.default
  })

  return {
    colors
  }
}
