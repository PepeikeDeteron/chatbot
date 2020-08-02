import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import { Chat } from './index';

const useStyles = makeStyles(() => (
  createStyles({
    "chats": {
      height: 400,
      padding: 0,
      overflow: "auto", // height 以上の要素が出たときにスクロールバーを出現させる
    }
  })
));

const Chats = (props) => {
  const classes = useStyles();

  return (
    <List className={classes.chats}>
      {props.chats.map((value, index) => {
         return <Chat text={value.text} type={value.type} key={index.toString()} />
      })}
    </List>
  );
};

export default Chats;