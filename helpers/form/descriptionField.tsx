import React from 'react';
import { TextAreaHelper } from './antRFConnector';
import { Field } from 'redux-form';
import { A8V } from "../../helpers";

export default class EditableField extends React.Component<any, any> {
  areaRef: any;
  constructor(props) {
    super(props);
    this.state = {
      edit: false
    }
  }

  toggleEdit = () => {
    const { edit } = this.state;
    this.setState({ edit: !edit }, () => {
      if (!edit) {
        this.areaRef.focus();
      }
    });
  }
  //   render() {
  //     let { edit } = this.state;
  //     let { name, value, validation } = this.props;
  //     if (edit) {
  //       return (
  //         <Field
  //           name={name}
  //           component={TextAreaHelper}
  //           className="form-control-coustom"
  //           onInputBlur={(value) => this.setState({ edit: !edit })}
  //           inputRef={node => (this.areaRef = node)}
  //           validate={validation ? [
  //             A8V.required({ errorMsg: `${name}` + "is required " })
  //           ] : []}
  //         />
  //       );
  //     }
  //     return <div onClick={() => this.toggleEdit()} style={{ border: "1px dotted #d2d2d2", height: "50px", cursor: "pointer" }} >{value}</div>;
  //   }

  render() {
    let { name, validation } = this.props;
    return (
      <Field
        name={name}
        component={TextAreaHelper}
        className="form-control-coustom"
        validate={validation ? [
          A8V.required({ errorMsg: `${name} is required.` })
        ] : []}
      />
    );
  }
}
