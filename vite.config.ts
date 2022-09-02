import { fileURLToPath, URL } from "node:url"

import { defineConfig } from "vite"
import vue from "@vitejs/plugin-vue"
import VueTypeImports from "vite-plugin-vue-type-imports"

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), VueTypeImports()],
  publicDir: process.env.NODE_ENV === "production" ? "public" : false,
  build: {
    lib:
      process.env.NODE_ENV === "production"
        ? {
            entry: fileURLToPath(new URL("src/index.ts", import.meta.url)),
            name: "index",
            fileName: "index",
            formats: ["es"]
          }
        : undefined,
    outDir: process.env.NODE_ENV === "production" ? "lib" : "dist",
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into the library
      external: ["vue", /^(dayjs)/]
      // output: {
      //   // Provide global variables to use in the UMD build
      //   // for externalized deps
      //   globals: {
      //     vue: "Vue",
      //     dayjs: "dayjs"
      //   }
      // }
    }
  }
})
