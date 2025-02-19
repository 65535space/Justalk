# Justalk
勝手に喋るdiscord bot</br>

実行手順
1. config.jsonを追加する
2. npm initする
```
npm init -y
```
3. packageをいれる
```
npm install
```
4. 必要なIdをconfig.jsonに記入する
```json
{
    "applicationId": "",
    "guildId": "",
    "LISTENER": {
    "CLIENT_ID": "",
    "TOKEN": "",
    "VC_ID": ""
    }
}
```

便利だと感じたパッケージ
depcheck プロジェクト内で実際に使用されていないパッケージを検出するツール
```
npm install depcheck
npx depcheck
```

気になったこと（単語など）
EventEmitter
イベント駆動型プログラミング
Opus
コーデック
バインディング
util