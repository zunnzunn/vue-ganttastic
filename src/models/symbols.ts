import { InjectionKey, Ref } from "vue"

const INJECTION_KEYS = {
  chartStartKey: Symbol("chartStartKey") as InjectionKey<Ref<string>>,
  chartEndKey: Symbol("chartEndKey") as InjectionKey<Ref<string>>,
  widthKey: Symbol("widthKey") as InjectionKey<Ref<number>>,
  precisionKey: Symbol("precisionKey") as InjectionKey<Ref<"hour" | "day" | "month">>,
  pushOnOverlapKey: Symbol("pushOnOverlapKey") as InjectionKey<Ref<boolean>>
}

export default INJECTION_KEYS
