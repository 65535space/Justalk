import { data, execute } from './commands/join.js';
import { Client, Events, GatewayIntentBits} from 'discord.js';

import config from './config.json' with { type: 'json' };
const { token } = config;

const client = new Client({ intents: [GatewayIntentBits.Guilds]});

client.once(Events.ClientReady, c => {
    console.log(`準備OKです! ${c.user.tag} がログインします`);
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    if(interaction.commandName === data.name){
        try {
            await execute(interaction);
        } catch(error){
            console.error(error);
            if(interaction.replied || interaction.deferred){
                await interaction.followUp({ content: 'コマンド実行時にエラーになりました。', ephemeral: true});
            } else {
                await interaction.reply({ content: 'コマンド実行時にエラーになりました。', ephemeral: true});
            }
        }
    }else {
        console.error(`${interaction.commandName}というコマンドには対応していません。`);
    }
});

client.login(token);