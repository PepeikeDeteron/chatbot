import * as functions from 'firebase-functions';
import * as admin from "firebase-admin";
admin.initializeApp();
const db = admin.firestore();

// レスポンスを返すための関数 (Cloud Functions 内でのみ呼び出すので export はつけない)
const sendResponse = (response: functions.Response, statusCode: number, body: any) => {
    response.send({
        statusCode,
        body: JSON.stringify(body)
    });
};

// https.onRequest メソッドで API を作成
export const addDataset = functions.https.onRequest(async (req: any, res: any) => { // async -> 非同期処理を扱う
    if (req.method !== 'POST') { // データを追加する際は POST メソッドで API を叩く
        sendResponse(res, 405, {error: 'Invalid Request'});
    } else {
        const dataset = req.body;
        // JSON 形式の dataset はオブジェクト型なので Object.keys で dataset の key を取りだし key の配列をループで回す
        for (const key of Object.keys(dataset)) {
            const data = dataset[key];
            await db.collection('questions').doc(key).set(data); // await -> 非同期処理を逐次実行
        }
        sendResponse(res, 200, {message: 'Successfully added dataset'});
    }
});
