import mysql from "mysql2/promise";

import { Turn } from "../../../domain/model/turn/turn";
import { TurnGateway } from "./turnGateway";
import { SquareGateway } from "./squareGateway";
import { toDisc } from "../../../domain/model/turn/disc";
import { MoveGateway } from "./moveGateway";
import { Move } from "../../../domain/model/turn/move";
import { Point } from "../../../domain/model/turn/point";
import { Board } from "../../../domain/model/turn/board";
import { DomainError } from "../../../domain/error/domainError";
import { TurnRepository } from "../../../domain/model/turn/turnRepository";

class TurnMySQLRepository implements TurnRepository {
  async findForGameIdAndTurnCount(
    conn: mysql.Connection,
    gameId: number,
    turnCount: number,
  ): Promise<Turn> {
    const turnRecord = await TurnGateway.findForGameIdAndTurnCount(
      conn,
      gameId,
      turnCount,
    );
    if (!turnRecord) {
      throw new DomainError(
        "SpecifiedTurnNotFound",
        "Specified turn not found.",
      );
    }

    const squareRecords = await SquareGateway.findForTurnId(
      conn,
      turnRecord.id,
    );

    const board = Array.from(Array(8)).map(() => Array.from(Array(8)));
    squareRecords.forEach((s) => (board[+s.y][+s.x] = s.disc));

    const moveRecord = await MoveGateway.findForTurnId(conn, turnRecord.id);
    let move: Move | undefined;
    if (moveRecord) {
      move = new Move(
        toDisc(moveRecord.disc),
        new Point(moveRecord.x, moveRecord.y),
      );
    }

    const nextDisc =
      turnRecord.nextDisc === null ? undefined : toDisc(turnRecord.nextDisc);

    return new Turn(
      gameId,
      turnCount,
      nextDisc,
      move,
      new Board(board),
      turnRecord.endAt,
    );
  }
  static async findForGameIdAndTurnCount(
    conn: mysql.Connection,
    gameId: number,
    turnCount: number,
  ): Promise<Turn> {
    return await this.findForGameIdAndTurnCount(conn, gameId, turnCount);
  }

  async save(conn: mysql.Connection, turn: Turn) {
    const turnRecord = await TurnGateway.insert(
      conn,
      turn.gameId,
      turn.turnCount,
      turn.nextDisc,
      turn.endAt,
    );

    await SquareGateway.insertAll(conn, turnRecord.id, turn.board.discs);

    if (turn.move) {
      await MoveGateway.insert(
        conn,
        turnRecord.id,
        turn.move.disc,
        turn.move.point.x,
        turn.move.point.y,
      );
    }
  }
  static async save(conn: mysql.Connection, turn: Turn) {
    await this.save(conn, turn);
  }
}

export const turnMySQLRepository = new TurnMySQLRepository();
