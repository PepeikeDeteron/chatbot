import React from 'react';
import TextField from '@material-ui/core/TextField';

const TextInput = (props) => {
  return (
    <TextField
      fullWidth={true}
      label={props.label}
      margin={"dense"}
      multiline={props.multiline} // true の場合複数行のテキストを入れる
      row={props.rows} // 指定した数字分の行数にする
      value={props.value}
      type={props.type}
      onChange={props.onChange}
    />
  );
};

export default TextInput;