import vue from "rollup-plugin-vue"
import typescript from "rollup-plugin-typescript"
import postcss from "rollup-plugin-postcss" // v4.0.0
import peerDepsExternal from "rollup-plugin-peer-deps-external"

export default [
  {
    input: "src/index.ts",
    output: [
      {
        format: "esm",
        file: "dist/library.mjs"
      }
    ],
    plugins: [
      vue({
        preprocessStyles: true
      }),
      postcss(),
      peerDepsExternal(),
      typescript({
        tsconfig: false,
        experimentalDecorators: true,
        module: "es2015"
      })
    ]
  }
]
