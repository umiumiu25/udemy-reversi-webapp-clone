import mysql from "mysql2/promise";

import { SquareRecord } from "./squareRecord";

export class SquareGateway {
  static async findForTurnId(
    conn: mysql.Connection,
    turnId: number,
  ): Promise<SquareRecord[]> {
    const squaresSelectResult = await conn.execute<mysql.RowDataPacket[]>(
      "select id, turn_id, x, y, disc from squares where turn_id = ?",
      [turnId],
    );
    const records = squaresSelectResult[0];

    return records.map(
      (record) =>
        new SquareRecord(
          record.id,
          record.turn_id,
          record.x,
          record.y,
          record.disc,
        ),
    );
  }

  static async insertAll(
    conn: mysql.Connection,
    turnId: number,
    board: number[][],
  ) {
    const squareCount = board
      .map((line) => line.length)
      .reduce((v1, v2) => v1 + v2, 0);

    const squareInsertSql =
      "insert into squares (turn_id, x, y, disc) values " +
      Array.from(Array(squareCount))
        .map(() => "(?, ?, ?, ?)")
        .join(", ");

    const squareInsertValues: any[] = [];
    board.forEach((line, y) => {
      line.forEach((disc, x) => {
        squareInsertValues.push(turnId);
        squareInsertValues.push(x);
        squareInsertValues.push(y);
        squareInsertValues.push(disc);
      });
    });

    await conn.execute(squareInsertSql, squareInsertValues);
  }
}
