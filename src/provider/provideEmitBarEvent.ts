import { inject } from "vue"
import { EMIT_BAR_EVENT_KEY } from "./symbols.js"

export default function provideEmitBarEvent() {
  const emitBarEvent = inject(EMIT_BAR_EVENT_KEY)
  if (!emitBarEvent) {
    throw Error("Failed to inject emitBarEvent!")
  }
  return emitBarEvent
}
