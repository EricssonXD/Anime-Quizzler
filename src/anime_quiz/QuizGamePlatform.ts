import { Guild } from "discord.js";
import { QuizGame } from "./QuizGame";
import { QuizGameManager } from "./QuizGameManager";

export abstract class QuizGamePlatform {

    constructor(private clientID: string, private manager: QuizGameManager) {

    }

    forceEndQuizGame() {
        // Force end the quiz game
        this.manager.activeGame = null;
    }
}