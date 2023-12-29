import { CacheType, ChatInputCommandInteraction, Guild } from "discord.js";
import { QuizGameManagerWeb } from "./QuizGameWeb";
import { QuizGameManagerDiscord } from "./QuizGameDiscord";
import { QuizGame } from "./QuizGame";
import { QuizGameSettings } from "./QuizGameSettings";

export class QuizGameManager {

    private activeGameManager: QuizGameManagerDiscord | QuizGameManagerWeb | null = null;

    public activeGame: QuizGame | null = null;

    public gameSettings: QuizGameSettings = new QuizGameSettings();

    constructor(public guild: Guild) {

    }

    public hostQuizGameDiscord(interaction: ChatInputCommandInteraction) {
        if (this.activeGameManager === null) {
            console.log("Start Hosting Discord Quiz Game");
            this.activeGameManager = new QuizGameManagerDiscord(interaction.user.id, this);
        } else {
            console.log("Already hosting a game.");
        }
    }

    public hostQuizGameWeb(interaction: ChatInputCommandInteraction) {
        console.log(this.activeGameManager);
        if (this.activeGameManager === null) {
            console.log("Start Hosting Web Quiz Game");
            this.activeGameManager = new QuizGameManagerWeb(interaction.user.id, this);
        } else {
            console.log("Already hosting a game.");
        }
    }

    public leaveGame(interaction: ChatInputCommandInteraction) {

    }

    public forceEndQuizGame(interaction: ChatInputCommandInteraction) {

        if (this.activeGameManager !== null) {
            this.activeGameManager.forceEndQuizGame();
            this.activeGameManager = null;
        }
    }

}
