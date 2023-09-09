import express from "express";

import { FindLatestGameTurnByTurnCountUseCase } from "../application/useCase/findLatestGameTurnByTurnCountUseCase";
import { RegisterTurnUseCase } from "../application/useCase/registerTurnUseCase";
import { Point } from "../domain/model/turn/point";
import { toDisc } from "../domain/model/turn/disc";
import { turnMySQLRepository } from "../infrastructure/repository/turn/turnMySQLRepository";
import { gameMySQLRepository } from "../infrastructure/repository/game/gameMySQLRepository";
import { gameResultMySQLRepository } from "../infrastructure/repository/gameResult/gameResultMySQLRepository";

export const turnRouter = express.Router();

const findLatestGameTurnByTurnCountUseCase =
  new FindLatestGameTurnByTurnCountUseCase(
    turnMySQLRepository,
    gameMySQLRepository,
    gameResultMySQLRepository,
  );

const registerTurnUseCase = new RegisterTurnUseCase(
  turnMySQLRepository,
  gameMySQLRepository,
  gameResultMySQLRepository,
);

interface TurnGetResponseBody {
  turnCount: number;
  board: number[][];
  nextDisc: number | null;
  winnerDisc: number | null;
}

turnRouter.get(
  "/api/games/latest/turns/:turnCount",
  async (req, res: express.Response<TurnGetResponseBody>) => {
    const turnCount = parseInt(req.params.turnCount);

    const output = await findLatestGameTurnByTurnCountUseCase.run(turnCount);

    const responseBody = {
      turnCount: output.turnCount,
      board: output.board,
      nextDisc: output.nextDisc ?? null,
      winnerDisc: output.winnerDisc ?? null,
    };

    res.json(responseBody);
  },
);

interface TurnPostRequestBody {
  turnCount: number;
  move: {
    disc: number;
    x: number;
    y: number;
  };
}

turnRouter.post(
  "/api/games/latest/turns",
  async (req: express.Request<{}, {}, TurnPostRequestBody>, res) => {
    const turnCount = req.body.turnCount;
    const disc = toDisc(req.body.move.disc);
    const point = new Point(req.body.move.x, req.body.move.y);

    await registerTurnUseCase.run(turnCount, disc, point);

    res.status(201).end();
  },
);
