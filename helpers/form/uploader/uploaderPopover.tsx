import * as React from "react";
import { Select } from "antd";
const Option = Select.Option;

interface Props {
  /**
   * Contain Unique Id of file card
   */
  fileUniqueId: string;
  fileInfo: [];
  handleFile: ({
    variableName,
    uid
  }: {
    variableName: string;
    uid: string;
  }) => void;
}

export default class UploaderPopover extends React.Component<Props, {}> {
  state = {};
  onChange = (value: string) => {
    this.props.handleFile({
      variableName: value,
      uid: this.props.fileUniqueId
    });
  };
  render() {
    return (
      <div>
        <Select
          // showSearch
          style={{ width: 200 }}
          placeholder="Select File Name"
          optionFilterProp="children"
          onChange={this.onChange}
          filterOption={(input, option: any) =>
            option.props.children.toLowerCase().indexOf(input.toLowerCase()) >=
            0
          }
        >
          {this.props.fileInfo.map(
            (data: { name: string; key: string }, index) => (
              <Option key={index} value={data.key}>
                {data.name}
              </Option>
            )
          )}
        </Select>
      </div>
    );
  }
}
