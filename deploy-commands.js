import { REST, Routes } from 'discord.js';

import { data } from './commands/join.js';

import config from './config.json' with { type: 'json'};
const {TOKEN} = config.LISTENER;

// 登録コマンドを呼び出してリスト形式で登録
const commands = [data.toJSON()];

// DiscordのAPIには現在version10を指定
const rest = new REST({version: '10'}).setToken(TOKEN);

// Discordサーバーにコマンドを登録
(async () => {
    try {
        await rest.put(
            Routes.applicationGuildCommands(config.applicationId, config.guildId),
            {body: commands},
        );
        console.log('サーバー固有のコマンドが登録されました！');
    } catch (error){
        console.error('コマンドの登録中にエラーが発生しました:', error);
    }
})();