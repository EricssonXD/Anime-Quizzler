import { Command } from "../CommandManager";
import { ChatInputCommandInteraction, GuildMember, SlashCommandBuilder } from "discord.js";
import { Bot } from "../Bot";
import { GuildMusicManager } from "../music/GuildMusicManager";


export const ANIME_QUIZ_COMMANDS: Command[] = [
    {
        data: new SlashCommandBuilder()
            .setName("quizgame")
            .setDescription("Host a quiz game")
            .addStringOption(option =>
                option.setName("mode")
                    .setDescription("The mode of quiz game to host")
                    .setRequired(true)
                    .addChoices(
                        { name: 'Discord', value: 'discord' },
                        { name: 'Web', value: 'web' },
                    )
            ),
        execute(interaction, bot) {
            const gameMode = interaction.options.getString('mode');
            if (gameMode === 'discord') {
                bot.getGuildQuizGameManager(interaction.guild).hostQuizGameDiscord();
            } else if (gameMode === 'web') {
                bot.getGuildQuizGameManager(interaction.guild).hostQuizGameWeb();
            }
            return "Paused.";
        }
    },

];
