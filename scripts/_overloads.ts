/* tslint:disable max-line-length */

import {
  compact,
  first,
  flatten,
  forEach,
  join,
  last,
  map,
  range,
  reduce,
  slice,
  takeRight,
  union,
  uniq
} from 'lodash'

const options = {
  functionName: 'compose',
  number: 16,
  extra: 'E extends ERR',
  extraArgument: 'E'
}

const enum ValveReturns {
  sink = 'ValveSinkFactory',
  source = 'ValveSourceFactory',
  through = 'ValveThroughFactory'
}

const enum ValveArguments {
  sink = 'ValveCompositeSink',
  source = 'ValveCompositeSource',
  through = 'ValveCompositeThrough',
  stream = 'ValveStream'
}

const mapArgReturn = (t: ValveArguments) => {
  switch (t) {
    case ValveArguments.sink:
      return ValveReturns.sink
    case ValveArguments.source:
      return ValveReturns.source
    case ValveArguments.through:
      return ValveReturns.through
    default:
      return t
  }
}

const enum ValveFlow {
  STS, // Source -> [Through...] -> Sink = void
  T, // Through ... = Through
  TS, // [Through...] -> Sink = Sink
  ST // Source -> [Through...] = Source
}

const configuration = (type: ValveFlow) => (
  n: number
): {
  mA: number
  A: number
  returnType: ValveArguments
  gP: number
  gS: number
  start: ValveArguments
  end: ValveArguments
  middle: ValveArguments
} => {
  const getArity = (mA: number) => (mA === 1 ? n : n + mA - 1)

  switch (type) {
    case ValveFlow.STS: {
      const mA = 2
      const A = getArity(mA)
      const gS = A

      // const offset = -1
      const gP = A // + offset

      // 2: 2 (S -> S)
      // 3: 3 (S -> T - S)
      // 4: 4 (S -> T -> T -> S )
      // 5: 5 (S -> T -> T -> T -> S )

      return {
        A,
        end: ValveArguments.sink,
        gP,
        gS,
        mA,
        middle: ValveArguments.through,
        returnType: ValveArguments.stream,
        start: ValveArguments.source
      }
    }

    case ValveFlow.ST: {
      const mA = 2
      const A = getArity(mA)
      const gP = A
      const gS = A
      const offset = 0

      // 2: 2 (S -> T)
      // 3: 3 (S -> T -> T)
      // 4: 4 (S -> T -> T -> T)

      return {
        A,
        end: ValveArguments.through,
        gP,
        gS,
        mA,
        middle: ValveArguments.through,
        returnType: ValveArguments.source,
        start: ValveArguments.source
      }
    }

    case ValveFlow.T: {
      const mA = 1
      const A = getArity(mA)
      const gS = A
      const offset = 1
      const gP = A + offset

      // 1: 2 (T)
      // 2: 3 (T, T)
      // 3: 4 (T, T, T)

      return {
        A,
        end: ValveArguments.through,
        gP,
        gS,
        mA,
        middle: ValveArguments.through,
        returnType: ValveArguments.through,
        start: ValveArguments.through
      }
    }

    case ValveFlow.TS: {
      const mA = 2
      const A = getArity(mA)
      const gP = A + 1
      const gS = A

      // 2: 3 (T, S)
      // 3: 4 (T, T, S)
      // 4: 5 (T, T, T, S)

      return {
        A,
        end: ValveArguments.sink,
        gP,
        gS,
        mA,
        middle: ValveArguments.through,
        returnType: ValveArguments.sink,
        start: ValveArguments.through
      }
    }

    default:
      return
  }
}

function generate(type: ValveFlow) {
  return map(range(1, options.number + 1), n => {
    const { mA, A, gP, gS, returnType, start, end, middle } = configuration(
      type
    )(n)

    const PGenerics = map(range(1, gP + 1), a => `P${a}`)
    // const SGenerics = map(range(1, gS + 1), a => `S${a}`)
    // const SEnum = `ValveStateComposite<[${join(SGenerics, ', ')}]>`

    const getReturnGenerics = () => {
      switch (returnType) {
        case ValveArguments.sink:
          return [first(PGenerics), last(PGenerics)]
        case ValveArguments.source:
          return [last(PGenerics)]
        case ValveArguments.through:
          return [first(PGenerics), last(PGenerics)]
        case ValveArguments.stream:
          return [last(PGenerics)]
      }
    }

    const popReturn = () => {
      const returnTypeString = mapArgReturn(returnType)
      const returnGenerics = `<${join(getReturnGenerics(), ', ')}, ${
        options.extraArgument
      }>`

      return `${returnTypeString}${returnGenerics}`
    }

    const popGenerics = (t: ValveArguments, a: number) => {
      let shift = a

      switch (type) {
        case ValveFlow.STS: {
          if (t !== ValveArguments.source) {
            shift = a - 1
          }
          break
        }

        case ValveFlow.ST: {
          if (t !== ValveArguments.source) {
            shift = a - 1
          }
        }
      }

      switch (t) {
        case ValveArguments.sink:
          // return union(slice(PGenerics, shift - 1, shift), slice(SGenerics, a - 1, a))
          return union(
            slice(PGenerics, shift - 1, shift + 1),
            // slice(SGenerics, a - 1, a)
          )
        case ValveArguments.source:
          return union(
            slice(PGenerics, shift - 1, shift),
            // slice(SGenerics, a - 1, a)
          )
        case ValveArguments.through:
          return union(
            slice(PGenerics, shift - 1, shift + 1),
            // slice(SGenerics, a - 1, a)
          )
      }
    }

    const args = map(range(1, A + 1), a => {
      let t: ValveArguments

      if (a === 1) {
        t = start
      } else if (a === A) {
        t = end
      } else {
        t = middle
      }

      return `A${a}: ${t}<${join(popGenerics(t, a), ', ')}, ${
        options.extraArgument
      }>`
    })

    // console.log('here')
    // return popReturn()
    return `function ${options.functionName}<${join(
      union(PGenerics),
      ', '
    )}, ${options.extra}>(${join(args, ', ')}): ${popReturn()}`
  })
}

//

const comment = (text: string) => `\n /* ${text} */\n`

const strings = compact(
  uniq(
    flatten([
      comment('Source -> Through... -> Sink'),
      generate(ValveFlow.STS),
      comment('Source -> Through ...'),
      generate(ValveFlow.ST),
      comment('Through... -> Sink'),
      generate(ValveFlow.TS),
      comment('Through ...'),
      generate(ValveFlow.T)
    ])
  )
)

console.log(join(strings, '\n'))
