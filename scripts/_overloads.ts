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
  uniq
} from 'lodash'

const options = {
  functionName: 'valve',
  number: 16,
  extra: 'E = ValveError',
  extraArgument: 'E'
}

const enum ValveReturns {
  sink = 'ValveSinkFactory',
  source = 'ValveSourceFactory',
  through = 'ValveThroughFactory',
  none = 'void'
}

const enum ValveArguments {
  sink = 'ValveCompositeSink',
  source = 'ValveCompositeSource',
  through = 'ValveCompositeThrough'
}

const mapArgReturn = (t: ValveArguments | 'void') => {
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

function generateOverloads(props: {
  start: ValveArguments
  end: ValveArguments
  return?: ValveArguments
  middle: ValveArguments
}) {
  return map(range(1, options.number + 1), n => {
    const generics = map(range(1, n + 1), a => `T${a}`)
    const length = generics.length

    if (props.start === ValveArguments.through && length === 1) {
      return
    }

    const getReturnGenerics = (type: ValveArguments) => {
      switch (type) {
        case ValveArguments.sink:
          return [last(generics)]
        case ValveArguments.source:
          return [last(generics)]
        case ValveArguments.through:
          return [first(generics), last(generics)]
      }
    }

    const popGenerics = (type: ValveArguments, start: number) => {
      switch (type) {
        case ValveArguments.sink:
          return slice(generics, start - 1, start)
        case ValveArguments.source:
          return slice(generics, start - 1, start)
        case ValveArguments.through:
          return slice(generics, start - 1, start + 1)
      }
    }

    const getArity = () => {
      if (props.end === ValveArguments.through && props.start === ValveArguments.through) {
        return n
      } else if (props.end === ValveArguments.sink && props.start === ValveArguments.source) {
        return n + 2
      } else {
        return n + 1
      }
    }

    const popReturn = () => {
      const a = getArity()

      const returnType = a === 1 ? props.start : props.return === undefined ? 'void' : props.return
      const returnTypeString = mapArgReturn(returnType)

      const returnGenerics =
        returnType === 'void'
          ? ''
          : `<${join(getReturnGenerics(returnType), ', ')}, ${options.extraArgument}>`

      return `${returnTypeString}${returnGenerics}`
    }

    const args = map(range(1, getArity()), a => {
      let type: ValveArguments

      if (a === 1) {
        type = props.start
      } else if (a === getArity() - 1) {
        type = props.end
      } else {
        type = props.middle
      }

      let offset = a

      if (
        type === ValveArguments.through &&
        props.start === ValveArguments.source &&
        props.end === ValveArguments.through
      ) {
        offset = offset - 1
      }

      if (
        type !== ValveArguments.source &&
        props.start === ValveArguments.source &&
        props.end === ValveArguments.sink
      ) {
        offset = offset - 1
      }

      return `A${a}: ${type}<${join(popGenerics(type, offset), ', ')}, ${options.extraArgument}>`
    })

    return `export function ${options.functionName}<${join(generics, ', ')}, ${
      options.extra
    }>(${join(args, ', ')}): ${popReturn()}`
  })
}

const enum ValveFlow {
  STS, // Source -> [Through...] -> Sink
  T, // Through ...
  TS, // [Through...] -> Sink
  ST // Source -> [Through...]
}

function generateFlow(type: ValveFlow) {
  switch (type) {
    case ValveFlow.STS: {
      return generateOverloads({
        end: ValveArguments.sink,
        middle: ValveArguments.through,
        // return: ValveArguments.none,
        start: ValveArguments.source
      })

      break
    }

    case ValveFlow.T: {
      return generateOverloads({
        end: ValveArguments.through,
        middle: ValveArguments.through,
        return: ValveArguments.through,
        start: ValveArguments.through
      })

      break
    }

    case ValveFlow.TS: {
      return generateOverloads({
        end: ValveArguments.sink,
        middle: ValveArguments.through,
        return: ValveArguments.sink,
        start: ValveArguments.through
      })

      break
    }

    case ValveFlow.ST: {
      return generateOverloads({
        end: ValveArguments.through,
        middle: ValveArguments.through,
        return: ValveArguments.source,
        start: ValveArguments.source
      })
    }
  }
}

const comment = (text: string) => `\n /* ${text} */\n`

const generate = () => {
  const strings = compact(
    uniq(
      flatten([
        comment('Source -> Through... -> Sink'),
        generateFlow(ValveFlow.STS),
        comment('Through... -> Sink'),
        generateFlow(ValveFlow.TS),
        comment('Source -> Through ...'),
        generateFlow(ValveFlow.ST),
        comment('Through ...'),
        generateFlow(ValveFlow.T)
      ])
    )
  )

  console.log(join(strings, '\n'))
}

generate()
