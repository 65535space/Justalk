import { REST, Routes } from 'discord.js';

import { data as joinData} from './commands/join.js';
import { data as leaveData} from './commands/leave.js'; 

const token = process.env.JUSTALK_TOKEN;

// 登録コマンドを呼び出してリスト形式で登録
const commands = [joinData.toJSON(), leaveData.toJSON()];

// DiscordのAPIには現在version10を指定
const rest = new REST({version: '10'}).setToken(token);

// Discordサーバーにコマンドを登録
(async () => {
    try {
        // Botが参加している全てのサーバーリストを取得
        const guilds = await rest.get(Routes.userGuilds());
        // guildsの中身を確認
        // console.log('Botが参加しているサーバー',guilds);

        // 現在のアプリケーション情報を取得
        const application = await rest.get(Routes.oauth2CurrentApplication());
        // applicationDataの中身を確認
        // console.log('application', application);
        for (const guild of guilds) {
            await rest.put(
                // 全てのサーバーにコマンドを登録
                Routes.applicationGuildCommands(application.id, guild.id),
                {body: commands},
            );
        }

        console.log('サーバー固有のコマンドが登録されました！');
    } catch (error){
        console.error('コマンドの登録中にエラーが発生しました:', error);
    }
})();