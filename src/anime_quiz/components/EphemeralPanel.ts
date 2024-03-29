import {
  ButtonInteraction,
  ButtonStyle,
  ChatInputCommandInteraction,
  ComponentType,
  InteractionCollector,
  Message,
  MessageCreateOptions,
  MessageEditOptions,
} from "discord.js";

export abstract class Panel {
  private message: Promise<Message>;
  private collector: InteractionCollector<ButtonInteraction>;

  public start(interaction: ChatInputCommandInteraction) {

    // await interaction.reply('This is a test message', ephemeral = True)  

    // await asyncio.sleep(5)
    // await interaction.edit_original_message('This message has now been edited')

    // this.message = channel.send(this.buildMessage());
    this.message.then(async message => {
      this.collector = message.createMessageComponentCollector({ componentType: ComponentType.Button })
      this.collector.on("collect", async (interaction: ButtonInteraction) => {
        try {
          await interaction.deferUpdate();
          await this.handleButtonInteraction(interaction.customId, interaction);
        } catch (err) {
          console.error(err);
        }
      });

      this.collector.on("end", collected => {
        console.log("Panel collector closed.");
      });
    });
    this.startInternal();
  }

  protected abstract startInternal(): void;

  protected abstract handleButtonInteraction(id: string, interaction: ButtonInteraction): Promise<void>

  public destroy() {
    this.destroyInternal();
    this.collector?.stop();
    this.message?.then(message => message.delete()).catch(e => console.error(e));
  }

  protected abstract destroyInternal(): void;

  protected update() {
    try {
      const content = this.buildMessage();
      this.message = this.message.then(message => message.edit(content));
    } catch (e) {
      console.error(e);
    }
  }

  protected abstract buildMessage(): MessageCreateOptions & MessageEditOptions;
}
