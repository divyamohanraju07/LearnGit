import * as React from "react";

export type accountDetailsViewProps = {
    accountDetails: any[];
};

export type accountDetailsViewState = {};

class accountDetailsView extends React.Component<
    accountDetailsViewProps,
    accountDetailsViewState
    > {
    state = {};
    render() {
        return (
            <div id="cif-check-results">
                <div className="tl-application-forms">
                    {this.props.accountDetails.map((accountDetail: any) => (
                        <div className="tl-application-form-item">
                            <div className="tl-application-form-head">
                                {accountDetail.accountName}
                            </div>
                            <ul className="list-unstyled">
                                {accountDetail.fields.map((field: any) => (
                                    <li>
                                        <span>{field.fieldKey}</span>
                                        <strong>{field.fieldValue}</strong>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}

export default accountDetailsView;
