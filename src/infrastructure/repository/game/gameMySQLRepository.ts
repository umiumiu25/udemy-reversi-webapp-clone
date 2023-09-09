import mysql from "mysql2/promise";

import { Game } from "../../../domain/model/game/game";
import { GameGateway } from "./gameGateway";
import { GameRepository } from "../../../domain/model/game/gameRepository";

class GameMySQLRepository implements GameRepository {
  async findLatest(conn: mysql.Connection): Promise<Game | undefined> {
    const gameRecord = await GameGateway.findLatest(conn);
    if (!gameRecord) {
      return undefined;
    }

    return new Game(gameRecord.id, gameRecord.startedAt);
  }
  static async findLatest(conn: mysql.Connection): Promise<Game | undefined> {
    return await this.findLatest(conn);
  }

  async save(conn: mysql.Connection, game: Game): Promise<Game> {
    const gameRecord = await GameGateway.insert(conn, game.startedAt);
    return new Game(gameRecord.id, gameRecord.startedAt);
  }
  static async save(conn: mysql.Connection, game: Game): Promise<Game> {
    return await this.save(conn, game);
  }
}

export const gameMySQLRepository = new GameMySQLRepository();
