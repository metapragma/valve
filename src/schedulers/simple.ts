import {
  ValveStream
} from '../types'

export function simpleScheduler <R, S, E>(stream: ValveStream<R, S, E>): ValveStream<R, S, E> {
  const n = (tick: () => boolean): void => {
    let loop = true

    while (loop) {
      loop = tick()
    }

    // const next = () => process.nextTick(() => {
    //   if (loop) {
    //     loop = tick()
    //
    //     next()
    //   }
    // })

    // next()
  }

  stream.schedule(n)

  return stream
}

