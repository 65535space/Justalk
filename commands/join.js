import { SlashCommandBuilder, VoiceChannel } from 'discord.js';
// BOTをVCに参加させるために必要
import { joinVoiceChannel } from '@discordjs/voice';

import config from '../config.json' with { type: 'json'};

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
        guildId: config.guildId,
        channelId: config.LISTENER.VC_ID,
        adapterCreator: interaction.guild.voiceAdapterCreator,
    });
    await interaction.reply('参加しました！');
}
