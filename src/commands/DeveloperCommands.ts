import { Command } from "../CommandManager";
import { ActionRowBuilder, ChatInputCommandInteraction, ComponentType, GuildMember, MessageActionRowComponentBuilder, SlashCommandBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, createComponent, createComponentBuilder } from "discord.js";


export const DEVELOPER_COMMANDS: Command[] = [
    {
        data: new SlashCommandBuilder()
            .setName("registercommands")
            .setDescription("Register Commands for this Guild"),
        execute(interaction, bot) {
            if (interaction.user.id == process.env.OWNER) {
                bot.commandManger.registerCommands(interaction.guildId, bot.client.user.id);
            }
            return "Registered Commands.";
        }
    },
    {
        data: new SlashCommandBuilder()
            .setName("test")
            .setDescription("Test Command 1"),
        async execute(interaction, bot) {
            // autoDeleteMessage(interaction, bot);
            // delayedEdit(interaction, bot);
            selecMenu(interaction, bot);
        },
        autoReply: false,
    },
    {
        data: new SlashCommandBuilder()
            .setName("test2")
            .setDescription("Display music control panel."),
        execute(interaction, bot) {
            return "Displaying music panel.";
        }
    },
    {
        data: subcommandTest(),
        execute(interaction, bot) {
            return "Displaying music panel.";
        }
    },
];

async function autoDeleteMessage(interaction: ChatInputCommandInteraction, bot: any) {
    await interaction.reply({ content: 'Done!', ephemeral: true });
    await interaction.deleteReply();
}

async function delayedEdit(interaction: ChatInputCommandInteraction, bot: any) {
    await interaction.reply({ content: 'Done!', ephemeral: true });
    setTimeout(() => {
        interaction.editReply('Edited!');
    }, 3000);
}

async function selecMenu(interaction: ChatInputCommandInteraction, bot: any) {
    const select = new StringSelectMenuBuilder()
        .setCustomId('starter')
        .setPlaceholder('Make a selection!')
        .addOptions(
            new StringSelectMenuOptionBuilder()
                .setLabel('Bulbasaur')
                .setDescription('The dual-type Grass/Poison Seed Pokémon.')
                .setValue('bulbasaur'),
            new StringSelectMenuOptionBuilder()
                .setLabel('Charmander')
                .setDescription('The Fire-type Lizard Pokémon.')
                .setValue('charmander'),
            new StringSelectMenuOptionBuilder()
                .setLabel('Squirtle')
                .setDescription('The Water-type Tiny Turtle Pokémon.')
                .setValue('squirtle'),
        );
    const row = new ActionRowBuilder<MessageActionRowComponentBuilder>()
        .addComponents(select);

    const collectorFilter = (i: { user: { id: string; }; }) => i.user.id === interaction.user.id;

    const collector = (await interaction.reply({
        content: 'Choose your starter!',
        components: [row],
        ephemeral: true,
    })).createMessageComponentCollector({ componentType: ComponentType.StringSelect, time: 5000, filter: collectorFilter });


    collector.on('collect', i => {
        i.update({ content: `You chose ${i.values[0]}!`, components: [row] });
    });

    collector.on('end', i => {
        console.log("ended")
        interaction.deleteReply();
        collector.dispose(interaction)
    });
    // collector.on('dispose', i => {
    //     console.log("Disposed")
    //     interaction.deleteReply();
    // });

}

function subcommandTest() {
    const pointsCommand = new SlashCommandBuilder()
        .setName('points')
        .setDescription('Lists or manages user points')

        // Add a manage group
        .addSubcommandGroup((group) =>
            group
                .setName('manage')
                .setDescription('Shows or manages points in the server')
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('user_points')
                        .setDescription("Alters a user's points")
                        .addUserOption((option) =>
                            option.setName('user').setDescription('The user whose points to alter').setRequired(true),
                        )
                        .addStringOption((option) =>
                            option
                                .setName('action')
                                .setDescription('What action should be taken with the users points?')
                                .addChoices(
                                    { name: 'Add points', value: 'add' },
                                    { name: 'Remove points', value: 'remove' },
                                    { name: 'Reset points', value: 'reset' },
                                )
                                .setRequired(true),
                        )
                        .addIntegerOption((option) => option.setName('points').setDescription('Points to add or remove')),
                ),
        )

        // Add an information group
        .addSubcommandGroup((group) =>
            group
                .setName('info')
                .setDescription('Shows information about points in the guild')
                .addSubcommand((subcommand) =>
                    subcommand.setName('total').setDescription('Tells you the total amount of points given in the guild'),
                )
                .addSubcommand((subcommand) =>
                    subcommand
                        .setName('user')
                        .setDescription("Lists a user's points")
                        .addUserOption((option) =>
                            option.setName('user').setDescription('The user whose points to list').setRequired(true),
                        ),
                ),
        );

    return pointsCommand;
}