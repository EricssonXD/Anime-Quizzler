export class QuizGameSettings {
    public numberOfQuestions: number;
    public scoringType: GameScoringType;


    constructor(settings?: QuizGameSettingsInterface) {
        this.numberOfQuestions = settings.numberOfQuestions ?? 30;
        this.scoringType = settings.scoringType ?? GameScoringType.points;
    }

    public set(settings: QuizGameSettingsInterface) {
        this.numberOfQuestions = settings.numberOfQuestions ?? this.numberOfQuestions;
        this.scoringType = settings.scoringType ?? this.scoringType;
    }
}

export interface QuizGameSettingsInterface {
    numberOfQuestions?: number,
    scoringType?: GameScoringType
}

export enum GameScoringType {
    quickdraw = "quickdraw",
    lives = "lives",
    points = "points"
}