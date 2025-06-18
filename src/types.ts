export type Cell = 0 | 1 | 2;

export type Board = Cell[][];

export type Position = {
  row: number;
  col: number;
};

export type Block = {
  id: string;
  shape: (0 | 1)[][];
};
