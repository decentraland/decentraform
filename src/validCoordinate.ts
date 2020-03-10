export function validCoordinate(coordinate: string) {
  return coordinate.match(/^-?[0-9]+,-?[0-9]+$/g)
}
