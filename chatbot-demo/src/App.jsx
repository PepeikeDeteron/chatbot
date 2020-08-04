import React, { useState, useEffect, useCallback }from 'react';
import './assets/styles/style.css';
import { AnswersList, Chats } from './Components/index';
import FormDialog from './Components/Forms/FormDialog';
import { db } from './Firebase/index';

const App = () => {
  const [answers, setAnswers] = useState([]); // 回答コンポーネントに表示するデータ
  const [chats, setChats] = useState([]); // チャットコンポーネントに表示するデータ
  const [currentId, setCurrentId] = useState('init'); // 現在の質問 ID
  const [dataset, setDataset] = useState({}); // Firestore から取ってくる質問と回答のデータセット
  const [open, setOpen] = useState(false);　// 問い合わせフォーム用モーダルの開閉を管理

  const displayNextQuestion = (nextQuestionId, nextDataset) => {
    addChats({
      text: nextDataset.question,
      type: 'question'
    });

      setAnswers(nextDataset.answers)
      setCurrentId(nextQuestionId);
  };

  const selectAnswer = (selectedAnswer, nextQuestionId) => {
    switch (true) {
      case (nextQuestionId === 'contact'):
        handleClickOpen();
        break;

      // nextQuestionId の先頭が https から始まる(それ以降は任意の文字列)場合
      case (/^https:*/.test(nextQuestionId)):
        const a = document.createElement('a');
        a.href = nextQuestionId;
        a.target = '_blank'; // ブラウザの別タブでリンクを開く
        a.click();
        break;

      default:
        addChats({
          text: selectedAnswer,
          type: 'answer'
        });

        // チャットの遅延表示
        setTimeout(() => displayNextQuestion(nextQuestionId, dataset[nextQuestionId]), 1000);
        break;
    }
  };

  // 前回のチャット prevChats に対して今回のチャット chat を追加する
  const addChats = (chat) => {
    setChats(prevChats => {
      return [...prevChats, chat]
    });
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  // 子コンポーネントに渡しているので　useCallback 化する
  const handleClose = useCallback(() => {
    setOpen(false)
  }, [setOpen]);

  // componentDidMount()
  useEffect(() => {
    (async() => {
      const initDataset = {};

      // questions という collection に入っていたドキュメントを全て取得
      await db.collection('questions').get().then((snapshots) => {
        snapshots.forEach(doc => {
          const id = doc.id // questions 内の automation_tool など
          const data = doc.data() // id の中身
          initDataset[id] = data // initDataset というオブジェクトの中に id を key として value である data を追加
        });
      });

      // 取得してきたデータを入れて更新
      setDataset(initDataset);
      // currentId が init のときの NextQuestion -> 最初の質問
      displayNextQuestion(currentId, initDataset[currentId]);
    })();
  }, []);

  // componentDidUpdate()
  useEffect(() => {
    // 最新のチャットが見えるようにスクロール位置の頂点をスクロール領域の最下部に設定
    const scrollArea = document.getElementById('scroll-area')
    if (scrollArea) {
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  });

  return (
    <section className="c-section">
      <div className="c-box">
        <Chats chats={chats} />
        <AnswersList
          answers={answers}
          select={selectAnswer}
        />
        <FormDialog open={open} handleClose={handleClose} />
      </div>
    </section>
  );
}
export default App;


