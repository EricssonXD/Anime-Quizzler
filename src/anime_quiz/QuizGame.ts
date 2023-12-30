import { GameScoringType, QuizGameSettings } from "./QuizGameSettings";



export class QuizGame {

    private players = new Map<String, PlayerInfo>();

    constructor(players: string[], private settings: QuizGameSettings) {
        // Constructor logic here
        for (const player of players) {
            this.addPlayer(player);
        }

    }

    private addPlayer(player: string) {
        // Logic here
        this.players.set(player, { id: player, score: 0 });
    }

    public leaveGame(player: string) {
        // Logic here
        this.players.delete(player);
        return this.players.size === 0
    }

    public answerQuestion(player: string, answer: number) {
        // Logic here
        const playerInfo = this.players.get(player);
        if (playerInfo) {
            playerInfo.currentAnswer = answer;
        }
    }

    public checkAnswer(answer: number) {
        // Logic here
        for (const player of this.players.values()) {
            if (player.currentAnswer === answer) {
                this.updateScores(player, true);
            }
        }
    }

    private updateScores(player: PlayerInfo, isCorrect: boolean) {
        // Logic here
        switch (this.settings.scoringType) {
            case GameScoringType.quickdraw:
                if (isCorrect) player.score++;
                break;

            case GameScoringType.lives:
                if (isCorrect) player.score--;
                break;

            case GameScoringType.points:
                if (isCorrect) player.score++;
                break;

            default:
                break;
        }
    }



}

interface PlayerInfo {
    id: string,
    score: number,
    currentAnswer?: number | null,
}