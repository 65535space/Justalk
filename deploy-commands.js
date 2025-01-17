import { REST, Routes } from 'discord.js';

import { data } from './commands/join.js';

// 環境変数としてapplicationId, guildId, tokenの3つが必要
import { applicationId, guildId, token } from './config.json';

// 登録コマンドを呼び出してリスト形式で登録
const commands = [data.toJSON()];

// DiscordのAPIには現在version10を指定
const rest = new REST({version: '10'}).setToken(token);

// Discordサーバーにコマンドを登録
(async () => {
    try {
        await rest.put(
            Routes.applicationGuildCommands(applicationId, guildId),
            {body: commands},
        );
        console.log('サーバー固有のコマンドが登録されました！');
    } catch (error){
        console.error('コマンドの登録中にエラーが発生しました:', error);
    }
})();