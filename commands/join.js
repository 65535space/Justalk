import { SlashCommandBuilder} from 'discord.js';
// BOTをVCに参加させるために必要
import { entersState, joinVoiceChannel, VoiceConnectionStatus, getVoiceConnection, createAudioPlayer, createAudioResource} from '@discordjs/voice';
// import config from '../config.json' with { type: 'json'};
import { GoogleGenerativeAI } from "@google/generative-ai";
// Import other required libraries
import { writeFile } from 'node:fs/promises';
// Imports the Google Cloud client library
import { TextToSpeechClient } from '@google-cloud/text-to-speech';

// GENERATIVE_AI_API_KEY は環境変数に設定しておく
const geminiApiKey = process.env.GEMINI_API_KEY
const genAI = new GoogleGenerativeAI(geminiApiKey);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
let nowtime = new Date();

const randomTopics = [
    "food", "travel", "technology", "movies", "sports", "history", "space", 
    "music", "books", "games", "art", "science", "health", "fashion", "news",
    "education", "relationships", "psychology", "finance", "fitness", "weather",
    "social media", "memes", "celebrities", "DIY", "photography", "pets", "nature"
];
const foodTopics = [
    "pizza", "sushi", "chocolate", "coffee", "fast food", "vegan", "barbecue", 
    "ramen", "curry", "burgers", "wine", "desserts", "tea", "seafood", 
    "homemade cooking", "spicy food", "snacks", "street food", "breakfast", "brunch"
];
const travelTopics = [
    "beaches", "mountains", "road trips", "air travel", "backpacking", "hotels",
    "famous landmarks", "cultural experiences", "national parks", "cruises",
    "adventure travel", "luxury travel", "travel hacks", "best cities", 
    "hidden travel gems", "solo travel", "family vacations", "historical places"
];
const movieTopics = [
    "action movies", "comedy", "horror", "science fiction", "romance", 
    "classic films", "animated movies", "Marvel vs DC", "film soundtracks",
    "underrated movies", "best movie directors", "Netflix recommendations", 
    "K-dramas", "anime movies", "Oscar-winning films", "movie theories"
];
const gameTopics = [
    "RPG games", "shooter games", "open-world games", "classic arcade games", 
    "board games", "mobile gaming", "esports", "multiplayer games", "indie games", 
    "VR gaming", "retro gaming", "game soundtracks", "best game stories", 
    "speedrunning", "video game characters", "battle royale games"
];
const bookTopics = [
    "fantasy books", "mystery novels", "sci-fi books", "romantic novels", 
    "historical fiction", "self-improvement books", "biographies", 
    "best-selling books", "classic literature", "poetry", "manga", 
    "book recommendations", "books turned into movies", "philosophy books"
];
const sportsTopics = [
    "soccer", "basketball", "tennis", "baseball", "Formula 1", "Olympics",
    "cycling", "swimming", "boxing", "MMA", "golf", "table tennis", "skiing",
    "rock climbing", "badminton", "rugby", "marathons", "wrestling", "cricket"
];
const techTopics = [
    "AI", "blockchain", "cybersecurity", "smartphones", "robotics", 
    "virtual reality", "augmented reality", "programming languages", 
    "tech startups", "gadgets", "machine learning", "space technology",
    "biotechnology", "electric cars", "quantum computing"
];
const musicTopics = [
    "pop music", "rock bands", "K-pop", "hip-hop", "jazz", "classical music",
    "EDM", "indie music", "live concerts", "guitar", "piano", "favorite singers",
    "underrated artists", "music trends", "best albums", "lyrics analysis"
];
const spaceTopics = [
    "black holes", "aliens", "Mars exploration", "NASA", "space travel",
    "astrophysics", "solar system", "exoplanets", "astronaut training",
    "satellites", "space debris", "moon missions", "cosmic events", "dark matter"
];
const psychologyTopics = [
    "personality types", "dream meanings", "emotional intelligence",
    "mental health", "happiness tips", "motivation", "self-improvement",
    "relationships", "mindfulness", "stress management", "habits of successful people",
    "confidence boosting", "time management", "introverts vs extroverts"
];
const allTopics = [
    ...randomTopics, 
    ...foodTopics, 
    ...travelTopics, 
    ...movieTopics, 
    ...gameTopics, 
    ...bookTopics, 
    ...sportsTopics, 
    ...techTopics, 
    ...musicTopics, 
    ...spaceTopics, 
    ...psychologyTopics
];

let randomTopic;
// GeminiのAIに渡すプロンプト
let prompt;
let aiResult;
let conversationHistory = [];


// Creates a client
const client = new TextToSpeechClient();
// 音声ファイルを再生するためのプレイヤーを作成
const player = createAudioPlayer();
let audioResource;

async function quickStart(aiText) {
    // The text to synthesize
    const text = aiText;
  
    // Construct the request
    const request = {
      input: {text: text},
      // Select the language and SSML voice gender (optional)
      voice: {languageCode: 'ja-JP' ,name: 'ja-JP-Standard-C' ,ssmlGender: 'MALE'},
      // select the type of audio encoding
      audioConfig: {audioEncoding: 'MP3'},
    };
  
    // Performs the text-to-speech request
    const [response] = await client.synthesizeSpeech(request);
  
    // Save the generated binary audio content to a local file
    await writeFile('audio-data/output.mp3', response.audioContent, 'binary');
    console.log('Audio content written to file: audio-data/output.mp3');
}

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
            console.log(`ね、今喋ったでしょ？静かにしなさいよね！`);
            // タイムアウトをリセット
            clearTimeout(timeoutId);
            nowtime = Date.now() / 1000;
            console.log(`clearTimeoutTime: ${nowtime}`);
        });

        receiver.speaking.on('end', async ()=>{
            console.log(`喋り終わったわね！ならよしですわ～！`);
            // 現在時刻の取得+タイムアウトするまでの時間を設定（上書きされ続ける）
            startTimer();
            // nowtime = Date.now() / 1000;
            // console.log(`nowtime: ${nowtime}`);
            // timeoutCounter = nowtime + 20;
            // console.log(`timeoutCounter: ${timeoutCounter}`);
        });

    }catch(error){
        console.error(error);

        await interaction.followUp('Failed to join voice channel within 10 seconds, please try again later!');
    }

    // タイムアウト後、AIが発言する処理
    function startTimer(){
        timeoutId = setTimeout(async () => {
            nowtime = Date.now() / 1000;
            console.log(`timeoutCounter: ${nowtime}`);
            randomTopic = allTopics[Math.floor(Math.random() * allTopics.length)];
            prompt = `Here is the conversation so far: ${conversationHistory.join(" ")}. 
            Create a one-sentence conversation starter related to ${randomTopic}. 
            Avoid repeating previous topics and ensure the response is unique. Please reply in Japanese only.`;
            aiResult = await model.generateContent(prompt, { temperature: 0.8 });
            await quickStart(aiResult.response.text());
            //TODO: AIの発言をVCで流す
            connection.subscribe(player);
            audioResource = createAudioResource('audio-data/output.mp3');
            player.play(audioResource);
            conversationHistory.push(aiResult.response.text());
            if (conversationHistory.length > 5) {
                conversationHistory.shift();
            }
            console.log(aiResult.response.text());
        }, 10_000);
    }

    await interaction.followUp('参加しました！');
}
