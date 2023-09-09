import mysql from "mysql2/promise";

import { GameResult } from "../../../domain/model/gameResult/gameResult";
import { GameResultGateway } from "./gameResultGateway";
import { toWinnerDisc } from "../../../domain/model/gameResult/winnerDisc";
import { GameResultRepository } from "../../../domain/model/gameResult/gameResultRepository";

class GameResultMySQLRepository implements GameResultRepository {
  async findForGameId(
    conn: mysql.Connection,
    gameId: number,
  ): Promise<GameResult | undefined> {
    const gameResultRecord = await GameResultGateway.findForGameId(
      conn,
      gameId,
    );

    if (!gameResultRecord) {
      return undefined;
    }

    return new GameResult(
      gameResultRecord.gameId,
      toWinnerDisc(gameResultRecord.winnerDisc),
      gameResultRecord.endAt,
    );
  }
  static async findForGameId(
    conn: mysql.Connection,
    gameId: number,
  ): Promise<GameResult | undefined> {
    return await this.findForGameId(conn, gameId);
  }

  async save(conn: mysql.Connection, gameResult: GameResult) {
    await GameResultGateway.insert(
      conn,
      gameResult.gameId,
      gameResult.winnerDisc,
      gameResult.endAt,
    );
  }
  static async save(conn: mysql.Connection, gameResult: GameResult) {
    await this.save(conn, gameResult);
  }
}

export const gameResultMySQLRepository = new GameResultMySQLRepository();
