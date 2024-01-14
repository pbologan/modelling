export interface Data {
  time: number;
  expN: number;
  logN: number;
  r: number;
  K: number;
}

export function calculate(n: number, r: number, time: number) {
  return Math.round(n * Math.exp(r * time));
}
