import { Guild } from "discord.js";
import { QuizGame } from "./QuizGame";

export abstract class QuizGamePlatform {

    constructor(private guild: Guild) {

    }

}