import { Command } from "../CommandManager";
import { ChatInputCommandInteraction, GuildMember, SlashCommandBuilder } from "discord.js";
import { Bot } from "../Bot";
import { GuildMusicManager } from "../music/GuildMusicManager";


export const ANIME_QUIZ_COMMANDS: Command[] = [
    {
        data: new SlashCommandBuilder()
            .setName("test")
            .setDescription("Pauses the song."),
        execute(interaction, bot) {
            bot.getGuildMusicManager(interaction.guild).pause();
            return "Paused.";
        }
    },
    {
        data: new SlashCommandBuilder()
            .setName("test2")
            .setDescription("Display music control panel."),
        execute(interaction, bot) {
            bot.getGuildMusicManager(interaction.guild).displayMusicPanel(interaction.channel);
            return "Displaying music panel.";
        }
    },
];
