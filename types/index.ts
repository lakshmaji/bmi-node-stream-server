export type Noop = () => void;
export const noop: Noop = () => Math.random();

export interface HasStreamProperties {
  length: number;
}
