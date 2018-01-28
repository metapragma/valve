import { hasEnded } from './hasEnded'

export function isDataAvailable<P, E>(
  end: boolean | E,
  _: P | undefined
): _ is P {
  return !(hasEnded(end))
}
