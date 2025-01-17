import { SlashCommandBuilder, VoiceChannel } from 'discord.js';
// BOTをVCに参加させるために必要
import { joinVoiceChannel } from '@discordjs/voice';
import { LISTENER } from '../config.json';
import { createDiscordJSAdapter } from '../adapter.js';

export const data = new SlashCommandBuilder()
    .setName('join')
    .setDescription('VCに参加します');
export async function execute(interaction) {
    const channel = interaction.member.voice.channel;
    if (!channel) {
        await interaction.reply('You need to be in a voice channel to use this command!');
        return;
    }
    // VCに参加する処理
    const connection = joinVoiceChannel({
        guildId: interaction.guild.id,
        channelId: LISTENER.VC_ID,
        adapterCreator: createDiscordJSAdapter(channel),
    });
    await interaction.reply('参加しました！');
}
