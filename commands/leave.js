import {SlashCommandBuilder} from 'discord.js';
// BOTをVCに参加させるために必要
import {getVoiceConnection} from '@discordjs/voice';

// import config from '../config.json' with { type: 'json'};


export const data = new SlashCommandBuilder()
    .setName('leave')
    .setDescription('VCから退出します');
export async function execute(interaction) {
    const connection = getVoiceConnection(interaction.guildId);

	if (!connection) {
		await interaction.reply({ content: 'Not in a voice channel in this server!', flags: MessageFlags.Ephemeral });

		return;
	}

	connection.destroy();

	await interaction.reply({ content: 'Left the channel!', ephemeral: true });
}
