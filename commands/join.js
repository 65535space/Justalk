import { SlashCommandBuilder} from 'discord.js';
// BOTをVCに参加させるために必要
import { entersState, joinVoiceChannel, VoiceConnectionStatus, getVoiceConnection} from '@discordjs/voice';

// import config from '../config.json' with { type: 'json'};


export const data = new SlashCommandBuilder()
    .setName('join')
    .setDescription('VCに参加します');
export async function execute(interaction) {
    await interaction.deferReply();
    let connection = getVoiceConnection(interaction.guildId);
    let timeoutId = 0;
    // let timeoutCounter = 0;
    // let nowtime = new Date();

    const channel = interaction.member.voice.channel;
    
    console.log("デバッグ: getVoiceConnection の結果:", getVoiceConnection(interaction.guildId));    

    if (!channel) {
        await interaction.followUp('You need to be in a voice channel to use this command!');
        return;
    }
    
    // チャンネル内にいない場合の処理(以前のコード)
    // if (interaction.member?.voice.channel) {
    //     await interaction.followUp('Join a voice channel and then try that again!');
    //     return;
    // }

    if (!connection || connection.state.status === VoiceConnectionStatus.Disconnected) {
        console.log("Bot は VC にいません。接続を試みます...");
        
        connection = joinVoiceChannel({
            guildId: interaction.guildId,
            channelId: interaction.member.voice.channel.id,
            adapterCreator: interaction.guild.voiceAdapterCreator,
            selfDeaf: false,
            selfMute: true,
        });
        console.log("デバッグ: joinVoiceChannel の結果:", connection);
    } else {
        console.log("よく見て、ここにいるよ（VC内）");
    }

    // VCに参加する処理(以前のコード)
     
    // const connection = joinVoiceChannel({
    //     guildId: config.guildId,
    //     channelId: config.LISTENER.VC_ID,
    //     adapterCreator: interaction.guild.voiceAdapterCreator,
    // });

    try{
        await entersState(connection, VoiceConnectionStatus.Ready, 20_000);
        const receiver = connection.receiver;
    
        receiver.speaking.on('start', async ()=>{
            console.log(`ね、今喋ったでしょ？静かにしなさいよ！`);
            //TODO: タイムアウトをリセット
            clearTimeout(timeoutId);
            //TODO: タイムアウトした際に、喋っている人に通知を送る
            
        });

        receiver.speaking.on('end', async ()=>{
            console.log(`喋り終わったわね！ならよしですわ～！`);
            //TODO: 現在時刻の取得+タイムアウトするまでの時間を設定（上書きされ続ける）
            startTimer();
            // nowtime = Date.now() / 1000;
            // console.log(`nowtime: ${nowtime}`);
            // timeoutCounter = nowtime + 20;
            // console.log(`timeoutCounter: ${timeoutCounter}`);
        });

    }catch(error){
        console.error(error);

        await interaction.followUp('Failed to join voice channel within 20 seconds, please try again later!');
    }

    function startTimer(){
        timeoutId = setTimeout(() => {
            console.log(`タイムアウトしました！`);
        }, 5_000);
    }

    await interaction.followUp('参加しました！');
}
