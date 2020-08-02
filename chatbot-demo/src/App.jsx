import React from 'react';
import defaultDataset from './dataset';
import './assets/styles/style.css';
import { AnswersList, Chats } from './Components/index';

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      answers: [], // 回答コンポーネントに表示するデータ
      chats: [], // チャットコンポーネントに表示するデータ
      currentId: 'init', // 現在の質問 ID
      dataset: defaultDataset, // 質問と回答のデータセット
      open: false // 問い合わせフォーム用モーダルの開閉を管理
    };
    this.selectAnswer = this.selectAnswer.bind(this);
  }

  displayNextQuestion = (nextQuestionId) => {
    const chats = this.state.chats;
    chats.push({
      text: this.state.dataset[nextQuestionId].question,
      type: 'question'
    });

    this.setState({
      answers: this.state.dataset[nextQuestionId].answers,
      chats: chats,
      currentId: nextQuestionId
    });
  };

  selectAnswer = (selectedAnswer, nextQuestionId) => {
    switch(true) {
      case(nextQuestionId === 'init'):
        setTimeout(() => this.displayNextQuestion(nextQuestionId), 500);
        break;

      // nextQuestionId の先頭が https から始まる(それ以降は任意の文字列)場合
      case(/^https:*/.test(nextQuestionId)):
        const a = document.createElement('a');
        a.href = nextQuestionId;
        a.target = '_blank'; // ブラウザの別タブでリンクを開く
        a.click();
        break;
      default:
        const chats = this.state.chats;
        chats.push({ // 更新していくために現在の状態をプッシュする
          text: selectedAnswer,
          type: 'answer'
        });

        this.setState({
          chats: chats
        });

        // チャットの遅延表示
        setTimeout(() => this.displayNextQuestion(nextQuestionId), 1000);
        break;
    }
  };

  componentDidMount() {
    const initAnswer = "";
    this.selectAnswer(initAnswer, this.state.currentId);
  }

  // 最新のチャットが見えるようにスクロール位置の頂点をスクロール領域の最下部に設定
  componentDidUpdate(prevProps, prevState, snapshot) {
    const scrollArea = document.getElementById('scroll-area')
    if (scrollArea) {
      scrollArea.scrollTop = scrollArea.scrollHeight;
    }
  }

  render() {
    return (
      <section className="c-section">
        <div className="c-box">
          <Chats chats={this.state.chats} />
          <AnswersList
            answers={this.state.answers}
            select={this.selectAnswer}
          />
        </div>
      </section>
    );
  }
}


