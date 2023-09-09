import express from "express";
import { StartNewGameUseCase } from "../application/useCase/startNewGameUseCase";
import { gameMySQLRepository } from "../infrastructure/repository/game/gameMySQLRepository";
import { turnMySQLRepository } from "../infrastructure/repository/turn/turnMySQLRepository";
import { FindLastGamesUseCase } from "../application/useCase/findLastGamesUseCase";
import { FindLastGamesMySQLQueryService } from "../infrastructure/query/findLastGamesMySQLQueryService";

export const gameRouter = express.Router();

const startNewGameUseCase = new StartNewGameUseCase(
  gameMySQLRepository,
  turnMySQLRepository,
);

const findLastGamesUseCase = new FindLastGamesUseCase(
  new FindLastGamesMySQLQueryService(),
);

interface GetGamesReponseBody {
  games: {
    id: number;
    darkMoveCount: number;
    lightMoveCount: number;
    winnerDisc: number;
    startedAt: Date;
    endAt: Date;
  }[];
}

gameRouter.get(
  "/api/games",
  async (req, res: express.Response<GetGamesReponseBody>) => {
    const output = await findLastGamesUseCase.run();

    const responseBodyGames = output.map(g => {
      return {
        id: g.gameId,
        darkMoveCount: g.darkMoveCount,
        lightMoveCount: g.lightMoveCount,
        winnerDisc: g.winnerDisc,
        startedAt: g.startedAt,
        endAt: g.endAt,
      };
    });

    const responseBody = {
      games: responseBodyGames,
    };

    res.json(responseBody);
  },
);

gameRouter.post("/api/games", async (req, res) => {
  await startNewGameUseCase.run();

  res.status(201).end();
});
