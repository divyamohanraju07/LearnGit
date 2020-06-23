import React from 'react'
import AceEditor from 'react-ace'
import 'brace/mode/javascript';
import 'brace/theme/monokai';
import 'brace/ext/language_tools';
import 'brace/theme/xcode';
import 'brace/snippets/javascript';

let aceOnBlur = (onBlur) => (_event, editor) => {
    const value = editor.getValue();
    onBlur(value);
};

export default function ReduxAce(props) {
    const {
        input,
        theme = 'monokai',
        mode = 'javascript',
        fontSize = 14,
        tabSize = 2,
        width = "80%",
        height = "13vh",
        ...custom
    } = props;

    return (
        <AceEditor
            // className={className}
            mode={mode}
            theme={theme}
            enableBasicAutocompletion={true}
            showPrintMargin={false}
            tabSize={tabSize}
            fontSize={fontSize}
            // setOptions={options}
            width={width}
            height={height}
            name={input.name}
            onBlur={aceOnBlur(input.onBlur)}
            onChange={input.onChange}
            onFocus={input.onFocus}
            value={input.value}
            {...custom}
        />
    )
}