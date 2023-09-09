import { DomainError } from "../../error/domainError.js";
import { Disc, isOppositeDisc } from "./disc.js";
import { Move } from "./move.js";
import { Point } from "./point.js";

export class Board {
  private _walledDiscs: Disc[][];

  constructor(private _discs: Disc[][]) {
    this._walledDiscs = this.wallDiscs();
  }

  get discs() {
    return this._discs;
  }

  place(move: Move): Board {
    // 1 盤面に置けるかチェック

    // 空のマス目ではない場合、置くことはできない
    if (this._discs[move.point.y][move.point.x] !== Disc.Empty) {
      throw new DomainError(
        "SelectedPointIsNotEmpty",
        "Selected point is not empty",
      );
    }
    // ひっくり返せる点をリストアップ
    const flipPoints = this.listFlipPoints(move);

    // ひっくり返せる点がない場合、置くことはできない
    if (flipPoints.length === 0) {
      throw new DomainError("FlipPointsIsEmpty", "Flip points is empty");
    }

    // 1.1 盤面をコピー
    const newDiscs = this._discs.map((line) => line.map((disc) => disc));
    // 2 石を置く
    newDiscs[move.point.y][move.point.x] = move.disc;
    // 3 ひっくり返す
    flipPoints.forEach((p) => {
      newDiscs[p.y][p.x] = move.disc;
    });

    return new Board(newDiscs);
  }

  private listFlipPoints(move: Move): Point[] {
    const flipPoints: Point[] = [];

    // 番兵を考慮して+1する
    const walledX = move.point.x + 1;
    const walledY = move.point.y + 1;

    const checkFlipPoints = (xMove: number, yMove: number) => {
      const flipCandidate: Point[] = [];

      // １つ動いた位置から開始
      let cursorX = walledX + xMove;
      let cursorY = walledY + yMove;

      // 手と逆の色の石がある間、１つずつ見ていく
      while (isOppositeDisc(move.disc, this._walledDiscs[cursorY][cursorX])) {
        // 番兵を考慮して-1する
        flipCandidate.push(new Point(cursorX - 1, cursorY - 1));
        cursorX += xMove;
        cursorY += yMove;
        // 次の手が同じ色の石なら、ひっくり返す石が確定
        if (move.disc === this._walledDiscs[cursorY][cursorX]) {
          flipPoints.push(...flipCandidate);
          break;
        }
      }
    };
    // 上
    checkFlipPoints(0, -1);
    // 左上
    checkFlipPoints(-1, -1);
    // 左
    checkFlipPoints(-1, 0);
    // 左下
    checkFlipPoints(-1, 1);
    // 下
    checkFlipPoints(0, 1);
    // 右下
    checkFlipPoints(1, 1);
    // 右
    checkFlipPoints(1, 0);
    // 右上
    checkFlipPoints(1, -1);

    return flipPoints;
  }

  existValidMove(disc: Disc): boolean {
    for (let y = 0; y < this._discs.length; y++) {
      const line = this._discs[y];

      for (let x = 0; x < line.length; x++) {
        const discOnBoard = line[x];

        // 空ではない点は無視
        if (discOnBoard !== Disc.Empty) {
          continue;
        }

        const move = new Move(disc, new Point(x, y));
        const flipPoints = this.listFlipPoints(move);

        // ひっくり返せる点がある場合、置ける場所がある。
        if (flipPoints.length !== 0) {
          return true;
        }
      }
    }

    return false;
  }

  count(disc: Disc): number {
    return this._discs
      .map((line) => line.filter((discOnBoard) => discOnBoard === disc).length)
      .reduce((v1, v2) => v1 + v2, 0);
  }

  private wallDiscs(): Disc[][] {
    const walled: Disc[][] = [];

    const topAndBottomWall = Array(this._discs[0].length + 2).fill(Disc.Wall);

    walled.push(topAndBottomWall);

    this._discs.forEach((line) => {
      const walledLine = [Disc.Wall, ...line, Disc.Wall];
      walled.push(walledLine);
    });

    walled.push(topAndBottomWall);

    return walled;
  }
}

const E = Disc.Empty;
const D = Disc.Dark;
const L = Disc.Light;

const INITIAL_DISCS = [
  [E, E, E, E, E, E, E, E],
  [E, E, E, E, E, E, E, E],
  [E, E, E, E, E, E, E, E],
  [E, E, E, D, L, E, E, E],
  [E, E, E, L, D, E, E, E],
  [E, E, E, E, E, E, E, E],
  [E, E, E, E, E, E, E, E],
  [E, E, E, E, E, E, E, E],
];

export const initialBoard = new Board(INITIAL_DISCS);
