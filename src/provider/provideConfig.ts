import { CONFIG_KEY } from "./symbols"
import { inject } from "vue"

export default function provideConfig() {
  const config = inject(CONFIG_KEY)
  if (!config) {
    throw Error("Failed to inject config!")
  }
  return config
}
