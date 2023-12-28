import { Guild } from "discord.js";
import { QuizGameManagerWeb } from "./QuizGameWeb";
import { QuizGameManagerDiscord } from "./QuizGameDiscord";

export class QuizGameManager {

    private activeGame: QuizGameManagerDiscord | QuizGameManagerWeb | null;


    constructor(private guild: Guild) {

    }

    public hostQuizGameDiscord() {
        if (this.activeGame === null) {
            this.activeGame = new QuizGameManagerDiscord(this.guild);
        }
    }

    public hostQuizGameWeb() {
        if (this.activeGame === null) {
            this.activeGame = new QuizGameManagerWeb(this.guild);
        }
    }

}
