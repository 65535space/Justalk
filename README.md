# Justalk
勝手に喋るdiscord bot</br>
・10秒静寂期間の後、Botが発話（音声再生）
・Botの会話内容を履歴に残す（最大5件）
・豊富な会話セットからランダムで話題を出す
・CloudTextToSpeechを使用

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