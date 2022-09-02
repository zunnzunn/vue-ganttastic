import { CONTEXT } from "../models/symbols"
import { inject } from "vue"

export default function useContext() {
  const context = inject(CONTEXT)
  if (!context) {
    throw Error("Failed to inject context!")
  }
  return context
}
