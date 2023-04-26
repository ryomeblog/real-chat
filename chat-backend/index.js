const {
  PutCommand,
  ScanCommand,
} = require('@aws-sdk/lib-dynamodb');
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIO = require('socket.io');
const docClient = require('./DynamoDB');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
  cors: {
    origin: '*', // フロントエンドのURLを設定する
    methods: ['GET', 'POST'],
  },
});

app.use(cors());

io.on('connection', (socket) => {
  console.log('user connected');

  // 新しいメッセージが送信されたときの処理
  socket.on('send_message', async (message) => {
    console.log('Message Received: ', message);

    // DynamoDBにメッセージを保存するパラメータ
    const params = {
      TableName: process.env.DYNAMO_CHAT_TABLE,
      Item: {
        'username': message.username,
        'timestamp': new Date().getTime(),
        'content': message.content,
      },
    };

    try {
      // DynamoDBへメッセージを保存
      await docClient.send(new PutCommand(params));
    } catch (error) {
      console.error('Error saving message: ', error);
    }

    // DynamoDBから全件メッセージ取得パラメータ
    const params2 = {
      TableName: process.env.DYNAMO_CHAT_TABLE,
    };

    try {
      // DynamoDBから全件メッセージを取得
      const messages = await docClient.send(new ScanCommand(params2));
      console.log('Messages: ', messages);
      // メッセージを全員に共有
      io.emit('new_message', messages.Items.sort((a, b) => (a.timestamp - b.timestamp)));
    } catch (error) {
      console.error('Error saving message: ', error);
    }

  });

  // ユーザーが切断したときの処理
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});


const PORT = process.env.PORT || 8000;

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
