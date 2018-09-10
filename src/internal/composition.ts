import { ValveType } from '../types'

export function composition(
  f: ValveType.Through | ValveType.Source,
  g: ValveType.Source
): null
export function composition(
  f: ValveType.Sink,
  g: ValveType.Through | ValveType.Sink | ValveType.Source
): null
export function composition(
  f: ValveType.Source,
  g: ValveType.Sink
): ValveType.Stream
export function composition(
  f: ValveType.Source,
  g: ValveType.Through
): ValveType.Source
export function composition(
  f: ValveType.Through,
  g: ValveType.Through
): ValveType.Through
export function composition(
  f: ValveType.Through,
  g: ValveType.Sink
): ValveType.Sink
export function composition(
  f: ValveType.Source | ValveType.Sink | ValveType.Through,
  g: ValveType.Source | ValveType.Sink | ValveType.Through
):
  | ValveType.Source
  | ValveType.Sink
  | ValveType.Through
  | ValveType.Stream
  | null
export function composition(
  f: ValveType.Source | ValveType.Sink | ValveType.Through,
  g: ValveType.Source | ValveType.Sink | ValveType.Through
):
  | ValveType.Source
  | ValveType.Sink
  | ValveType.Through
  | ValveType.Stream
  | null {
  if (f === ValveType.Source) {
    if (g === ValveType.Sink) {
      return ValveType.Stream
    } else {
      return ValveType.Source
    }
  } else if (g === ValveType.Sink) {
    return ValveType.Sink
  } else if (g === ValveType.Through) {
    return ValveType.Through
  }

  return null
}
