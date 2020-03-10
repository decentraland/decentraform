export function splitCoords(coordinates: string) {
  return coordinates.split(',').map(_ => parseInt(_, 10));
}
