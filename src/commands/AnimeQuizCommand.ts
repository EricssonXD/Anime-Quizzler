import { Command } from "../CommandManager";
import { ChatInputCommandInteraction, GuildMember, SlashCommandBuilder } from "discord.js";
import { Bot } from "../Bot";
import { GuildMusicManager } from "../music/GuildMusicManager";


export const ANIME_QUIZ_COMMANDS: Command[] = [
    {
        data: new SlashCommandBuilder()
            .setName("quizzler")
            .setDescription("Quiz Game Related Commands")
            .addSubcommandGroup((group) =>
                group
                    .setName('host')
                    .setDescription('Host a quiz game')
                    .addSubcommand((subcommand) =>
                        subcommand.setName('discord')
                            .setDescription('Host a quiz game in discord mode'),
                    )
                // .addSubcommand((subcommand) =>
                //     subcommand.setName('website')
                //         .setDescription("Host a quiz game in website mode")
                // ),
            )
            .addSubcommand((subcommand) =>
                subcommand
                    .setName('leave')
                    .setDescription('Leave your current quiz game'),
            )
        ,
        execute(interaction, bot) {
            switch (interaction.options.getSubcommand()) {
                case "discord":
                    bot.getGuildQuizGameManager(interaction.guild).hostQuizGameDiscord(interaction);
                    break;
                case "website":
                    bot.getGuildQuizGameManager(interaction.guild).hostQuizGameWeb(interaction);
                    break;
                case "leave":
                    bot.getGuildQuizGameManager(interaction.guild).leaveGame(interaction);
                    break;
                default:
                    interaction.reply({ content: "Invalid subcommand.", ephemeral: true });
            }
        },
        autoReply: false,
    },

];
