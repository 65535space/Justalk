import { data as joinData, execute as joinExecute } from './commands/join.js';
import { data as leaveData, execute as leaveExecute } from './commands/leave.js';
import { Client, Events, GatewayIntentBits} from 'discord.js';

import config from './config.json' with { type: 'json'};
console.log('token from config', config.LISTENER.TOKEN);
const {TOKEN} = config.LISTENER;

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates]});

client.once(Events.ClientReady, c => {
    console.log(`準備OKです! ${c.user.tag} がログインします`);
});

client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;

    try {
        if (interaction.commandName === joinData.name){
            await joinExecute(interaction);
        } else if (interaction.commandName === leaveData.name){
            await leaveExecute(interaction);
        } else {
            console.error(`未知のコマンドが実行されました: ${interaction.commandName}`);
        }
    } catch(error){
        console.error(error);
        if(interaction.replied || interaction.deferred){
            await interaction.reply({ content: 'コマンド実行時にエラーになりました。', flags: MessageFlags.Ephemeral});
        } else {
            await interaction.followUp({ content: 'コマンド実行時にエラーになりました。', flags: MessageFlags.Ephemeral});
        }
    }
});

client.login(TOKEN);