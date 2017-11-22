import typescript from 'rollup-plugin-typescript';


export default {
  output: {
    format: process.env.NODE_ROLLUP_TARGET
  },
  input: 'index.ts',
  external: [
    'lodash'
  ],
  plugins: [
    typescript({
      typescript: require('typescript')
    })
  ]
}
