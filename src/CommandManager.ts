import { CacheType, ChatInputCommandInteraction, REST, Routes, SlashCommandBuilder, TextInputStyle } from "discord.js";
import { SharedNameAndDescription } from "@discordjs/builders";
import { RESTPostAPIChatInputApplicationCommandsJSONBody } from "discord-api-types/v10";
import { Bot } from "./Bot";

import fs from 'node:fs';
import path from 'node:path';

import { UTILITY_COMMANDS } from "./commands/UtilityCommands";
import { PLAY_COMMANDS } from "./commands/PlayCommands";
import { MUSIC_CONTROL_COMMANDS } from "./commands/MusicControlCommands";
import { PLAYLIST_CONTROL_COMMANDS } from "./commands/PlayListControlCommands";
import { ANIME_QUIZ_COMMANDS } from "./commands/AnimeQuizCommand";

export type CommandExecutable = (interaction: ChatInputCommandInteraction, bot: Bot) => string | void | Promise<string | void>;
export type CommandBuilder = SharedNameAndDescription & { toJSON(): RESTPostAPIChatInputApplicationCommandsJSONBody };

export interface Command {
  data: CommandBuilder;
  execute: CommandExecutable;
  type?: 'DiscordCommand';
}



export class CommandManager {

  static RELOAD_COMMAND: Command = {
    data: new SlashCommandBuilder()
      .setName("reload")
      .setDescription("Reload all commands."),
    async execute(interaction, bot) {
      console.log(`Reloading commands for guild ${interaction.guildId}.`);
      try {
        const foldersPath = path.join(__dirname, 'commands');
        const commandFiles = fs.readdirSync(foldersPath);

        for (const file of commandFiles) {
          const filePath = path.join(foldersPath, file);
          delete require.cache[require.resolve(filePath)];
          const commandFile = await import(filePath)
          // const commandFile = require(filePath);
          for (const key in commandFile) {
            if (isCommandArray(commandFile[key])) {
              for (const command of commandFile[key]) {
                if ('data' in command && 'execute' in command) {
                  this.commands.delete(command.data.name);
                  this.commands.set(command.data.name, command);
                } else {
                  console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
                }
              }

            }
          }

        }


        console.log(`Successfully reloaded ${69} commands.`);
      } catch (error) {
        return `There was an error while reloading a command:\n\`${error.message}\``;
        console.error(error);
      }
      return "Commands Reloaded";
    }
  }

  private static readonly COMMANDS: Command[] = [this.RELOAD_COMMAND, ...UTILITY_COMMANDS, ...PLAY_COMMANDS, ...MUSIC_CONTROL_COMMANDS, ...PLAYLIST_CONTROL_COMMANDS, ...ANIME_QUIZ_COMMANDS];
  private readonly commands = new Map<string, Command>();


  constructor(private token: string) {
    for (const command of CommandManager.COMMANDS) {
      this.commands.set(command.data.name, command);
    }
  }

  public execute(interaction: ChatInputCommandInteraction, bot: Bot) {
    return this.getCommand(interaction.commandName).execute(interaction, bot);
  }

  private getCommand(command: string): Command {
    if (this.commands.has(command)) {
      return this.commands.get(command);
    } else {
      throw new Error("Unknown command.");
    }
  }

  public async registerCommands(guildId: string, botUserId: string): Promise<void> {
    console.log(`Registering commands for guild ${guildId}.`);
    const rest = new REST({ version: '10' }).setToken(this.token);
    try {
      const data = await rest.put(
        Routes.applicationGuildCommands(botUserId, guildId),
        { body: CommandManager.COMMANDS.map(command => command.data.toJSON()) },
      ) as any;

      console.log(`Successfully registered ${data.length} commands.`);
    } catch (error) {
      console.error(error);
    }
  }




}

function isCommandArray(obj: any): obj is Command[] {
  return Array.isArray(obj) && obj.every(item => item.type === 'DiscordCommand');
}