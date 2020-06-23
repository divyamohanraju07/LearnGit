import * as React from "react";
import {
  FormHeadSection,
  A8V,
  proceedNumber,
  inrFormat,
  sortAlphabetically,
  Config
} from "../../helpers";
import {
  TextBox,
  Select,
  SelectHelper,
  DatePicker,
  RadioWrapper,
  Radio,
  Scanner
} from "a8flow-uikit";
import {
  Field,
  getFormSyncErrors,
  getFormValues,
} from "redux-form";
import { connect } from "react-redux";
import axios from "axios";
import classname from "classnames";
const { Option } = SelectHelper;
type Props = {
  formSyncError: [];
  task: any;
  fieldPopulator: any;
  taskInfo: any;
  handleStateFromTab: any;
  formValues: any;
  ipc: any;
};
type State = {
  sectionValidator: any;
  isMortgageSectionEnabled: any;
  isHypothecatedMachineryEnabled: any;
  isHypothecatedVehicleEnabled: any;
  isHypothecatedInventoryEnabled: any;
  isPledgedSectionEnabled: any;
  assetOptions: any;
  stateOptions: any;
  titleSubOptions: any;
};
class TabCollateral extends React.Component<Props, State> {
  constructor(props) {
    super(props);
    this.state = {
      /**
       * sectionValidator responsible for handling the particular formSection is valid or not
       * sectionValidator schema : { keyToCheckSection : [arrays of what are the fields we need to watch]}
       */
      sectionValidator: {
        collateralBasicInfo: [
          "CollateralID",
          "CollateralType",
          "AssetType",
          "OwnHouseStatus"
        ],
        MortgageSection: [
          "Mortgage_Address",
          "Mortgage_PropertyType",
          "Mortgage_OwnerName",
          "Mortgage_BuildingAge",
          "Mortgage_PropertyLocation",
          "Mortgage_PropertyLocationAddr1",
          "Mortgage_PropertyLandmark",
          "Mortgage_State",
          "Mortgage_District",
          "Mortgage_Taluk",
          "Mortgage_PlotNumber",
          "Mortgage_SurveyNumber",
          "Mortgage_EastBoundary",
          "Mortgage_WestBoundary",
          "Mortgage_NorthBoundary",
          "Mortgage_SouthBoundary",
          "Mortgage_Pincode",
          "Mortgage_AreaSqFt",
          "Mortgage_BuildingArea",
          "Mortgage_MarketValue",
          "Mortgage_PurchasePrice",
          "Mortgage_PurchaseDate",
          "Mortgage_CollateralOwnershipPeriod",
          "Mortgage_Source",
          "Mortgage_CurrentStatus",
          "Mortgage_PastMortgage",
          "Mortgage_Forced_SaleValue",
          "PropertyJuristrictionType",
          "Mortgage_Forced_SaleValue"
        ],
        MortgageTitleDeed: [
          "TitleDeedDocumentNumber",
          "TitleDeedDocumentDate",
          "TitleDocumentType",
          "TitleDocumentSubDropdown"
        ],
        HypothecatedMachinery: [
          "HypoME_ManufactureName",
          "HypoME_Model",
          "HypoME_Supplier",
          "HypoME_MachineType",
          "HypoME_MachinePurpose",
          "HypoME_Imported",
          "HypoME_SerialNumber",
          "HypoME_Quantity",
          "HypoME_PurchasePrice",
          "HypoME_Value",
          "HypoME_MarketValue",
          "HypoME_PurchaseDate",
          "HypoME_CollateralLocation",
          "HypoME_Source",
          "HypoME_PastHypoME"
        ],
        HypothecatedVehicle: [
          "HypoVeh_VehicleType",
          "HypoVeh_Manufacturer",
          "HypoVeh_AssetModel",
          "HypoVeh_AssetMake",
          "HypoVeh_VehicleValue",
          // "HypoVeh_RegistrationNumber",
          // "HypoVeh_DateofPurchase",
          "HypoVeh_MarketValue",
          "HypoVeh_PurchasePrice",
          "HypoVeh_CollateralLocation",
          "HypoVeh_Source",
          "HypoVeh_PastHypoVeh"
        ],
        HypothecatedInventoryFurniture: [
          "HypoFFI_PurchasePrice",
          "HypoFFI_PurchaseDate",
          "HypoFFI_MarketValue",
          "HypoFFI_CollateralLocation",
          "HypoFFI_Source",
          "HypoFFI_PastHypothecation"
        ],
        PledgedDetails: [
          "Pledge_MarketValue",
          "Pledge_PurchasePrice",
          "Pledge_PurchasedOn",
          "Pledge_Source",
          "Pledge_PastPledge"
        ]
      },
      isMortgageSectionEnabled: false,
      isHypothecatedMachineryEnabled: false,
      isHypothecatedVehicleEnabled: false,
      isHypothecatedInventoryEnabled: false,
      isPledgedSectionEnabled: false,
      assetOptions: [],
      stateOptions: [],
      titleSubOptions: []
    };
  }
  setStateForSections(assetKey) {
    let status = {
      isMortgageSectionEnabled: false,
      isHypothecatedMachineryEnabled: false,
      isHypothecatedInventoryEnabled: false,
      isHypothecatedVehicleEnabled: false,
      isPledgedSectionEnabled: false
    };
    for (let key in status) {
      if (assetKey === key) {
        status[key] = true;
      }
    }
  }
  calculateHypoValue = e => {
    this.props.fieldPopulator("HypoME_Value", "");
  };
  handleAssetTypeChange = assetType => {
    if (assetType.value === "Land" || assetType.value === "Building" || assetType.value === "Land&Building") {
      this.setState({
        isMortgageSectionEnabled: true,
        isHypothecatedMachineryEnabled: false,
        isHypothecatedInventoryEnabled: false,
        isHypothecatedVehicleEnabled: false,
        isPledgedSectionEnabled: false
      });
    } else if (assetType.value === "Machinery" || assetType.value === "Equipment") {
      this.setState({
        isMortgageSectionEnabled: false,
        isHypothecatedMachineryEnabled: true,
        isHypothecatedInventoryEnabled: false,
        isHypothecatedVehicleEnabled: false,
        isPledgedSectionEnabled: false
      });
    } else if (assetType.value === "Inventory" || assetType.value === "Furniture&Fixtures") {
      this.setState({
        isMortgageSectionEnabled: false,
        isHypothecatedMachineryEnabled: false,
        isHypothecatedInventoryEnabled: true,
        isHypothecatedVehicleEnabled: false,
        isPledgedSectionEnabled: false
      });
    } else if (assetType.value === "Vehicle") {
      this.setState({
        isMortgageSectionEnabled: false,
        isHypothecatedMachineryEnabled: false,
        isHypothecatedInventoryEnabled: false,
        isHypothecatedVehicleEnabled: true,
        isPledgedSectionEnabled: false
      });
    } else if (assetType.value === "FixedDeposit" || assetType.value === "Furniture & Fixtures") {
      this.setState({
        isMortgageSectionEnabled: false,
        isHypothecatedMachineryEnabled: false,
        isHypothecatedInventoryEnabled: false,
        isHypothecatedVehicleEnabled: false,
        isPledgedSectionEnabled: true
      });
    } else {
      this.setState({
        isMortgageSectionEnabled: false,
        isHypothecatedMachineryEnabled: false,
        isHypothecatedInventoryEnabled: false,
        isHypothecatedVehicleEnabled: false,
        isPledgedSectionEnabled: false
      });
    }
  };
  handleCollateralTypeChange = collType => {
    this.assetTypeOptions(collType);
    this.props.fieldPopulator("AssetType", "");
  };
  handleDeedMainTypeChange = e => {
    this.props.fieldPopulator("TitleDocumentSubDropdown", "");
    if (e.value === "SecurityDocuments-1") {
      this.setState({
        titleSubOptions: [
          {
            value: "Titledeed",
            label: "Title deed"
          },
          {
            value: "PriorTitleDeed",
            label: "Prior Title deed"
          },
          {
            value: "SettlementDeed",
            label: "Settlement deed"
          },
          {
            value: "GiftDeed",
            label: "Gift deed"
          }
        ]
      });
    } else if (e.value === "SecurityDocuments-2") {
      this.setState({
        titleSubOptions: [
          {
            value: "LandTax",
            label: "Land Tax"
          },
          {
            value: "PossessionCertificate",
            label: "Possession Certificate"
          },
          {
            value: "LocationSketch",
            label: "Location Sketch"
          },
          {
            value: "LocationCertificate",
            label: "Location Certificate"
          },
          {
            value: "EncumbranceCertificate",
            label: "Encumbrance Certificate"
          }
        ]
      });
    }
  };
  assetTypeOptions(collateralType) {
    if (collateralType.value === "Mortgage") {
      this.setState({
        assetOptions: [
          {
            value: "Land",
            label: "Land"
          },
          {
            value: "Building",
            label: "Building"
          },
          {
            value: "Land&Building",
            label: "Land & Building"
          }
        ]
      });
    } else if (collateralType.value === "Hypothecation") {
      this.setState({
        assetOptions: [
          {
            value: "Machinery",
            label: "Machinery"
          },
          {
            value: "Equipment",
            label: "Equipment"
          },
          {
            value: "Inventory",
            label: "Inventory"
          },
          {
            value: "Furniture&Fixtures",
            label: "Furniture & Fixtures"
          },
          {
            value: "Vehicle",
            label: "Vehicle"
          }
        ]
      });
    } else if (collateralType.value === "Pledge") {
      this.setState({
        assetOptions: [
          {
            value: "FixedDeposit",
            label: "Fixed Deposit"
          },
          {
            value: "Furniture & Fixtures",
            label: "Furniture & Fixtures"
          }
        ]
      });
    }
  }
  async componentDidMount() {
    let config = {
      url: `${Config.apiUrl}/v1/states`,
      method: "get"
    };
    axios(config)
      .then(response => {
        let states = response.data.states;
        let stateDD = [];
        states.sort(sortAlphabetically("StateName"));
        for (let iter: any = 0; iter < states.length; iter++) {
          stateDD.push({
            value: states[iter].StateCode,
            label: states[iter].StateName
          });
        }
        this.setState({
          stateOptions: stateDD
        });
      })
      .catch(error => {
        console.log(error);
      });
    if (this.props.formValues &&
      this.props.formValues.AssetType &&
      this.props.formValues.AssetType.value !== "") {
      this.handleAssetTypeChange(this.props.formValues.AssetType.value);
    }
    if (this.props.formValues &&
      this.props.formValues.CollateralType &&
      this.props.formValues.CollateralType.value !== "") {
      this.handleCollateralTypeChange(this.props.formValues.CollateralType.value);
    }

    //NOTE ::: Commend below code for local development
    //set initialUploader true
    // this.setState(prevState => ({
    //   UploaderEsafMortgage: {
    //     ...prevState.UploaderEsafMortgage,
    //     initialUploadLoader: true
    //   }
    // }));
    //set initialUploadLoader false
    // this.setState(prevState => ({
    //   UploaderEsafSample: {
    //     ...prevState.UploaderEsafMortgage,
    //     initialUploadLoader: false
    //   }
    // }));
  }
  render() {
    return (
      <div className="tab-content">
        <div
          role="tabpanel"
          className="tab-pane active"
          id="card-item-details-1-lead"
        >
          <div className="form-section">
            <FormHeadSection
              sectionLabel="Collateral Basic Information"
              sectionKey="collateralBasicInfo"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
            //use this props to set firstTab always open
            // initialTab={true}
            />
            <div className="form-section-content" style={{ display: "block" }}>
              <div className="flex-row">
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label={"Collateral ID"}
                    name="CollateralID"
                    component={TextBox}
                    placeholder="Enter Collateral ID"
                    type="text"
                    hasFeedback
                    className="form-control-coustom"
                    validate={[
                      A8V.required({ errorMsg: "Collateral ID is required" })
                    ]}
                  />
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label="Collateral Type"
                    name="CollateralType"
                    component={Select}
                    placeholder="Select Collateral Type"
                    className="a8Select"
                    onChange={this.handleCollateralTypeChange}
                    validate={[
                      A8V.required({ errorMsg: "Collateral type is required" })
                    ]}
                  >
                    <Option value="Mortgage">Mortgage</Option>
                    <Option value="Hypothecation">Hypothecation</Option>
                    <Option value="Pledge">Pledge</Option>
                  </Field>
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label="Asset Type"
                    name="AssetType"
                    component={Select}
                    placeholder="Select Asset Type"
                    className="a8Select"
                    onChange={this.handleAssetTypeChange}
                    validate={[
                      A8V.required({ errorMsg: "Asset type is required" })
                    ]}
                  >
                    {this.state.assetOptions.map(data => (
                      <Option value={data.value}>{data.label}</Option>
                    ))}
                  </Field>
                </div>
                <div className="form-group col-xs-6 col-md-4">
                  <Field
                    label="Own House Status"
                    name="OwnHouseStatus"
                    component={Select}
                    placeholder="Select Own house status"
                    className="a8Select"
                    style={{ width: "350px" }}
                    validate={[
                      A8V.required({ errorMsg: "Own house status is required" })
                    ]}
                  >
                    <Option value="AvailableandnotPledged">
                      Available and not pledged
                    </Option>
                    <Option value="OwnVacantLandAvailable">
                      Own Vacant Land available
                    </Option>
                    <Option value="OwnHosuePledgedRepaidPromptly">
                      Own house , pledged, Repaid promptly
                    </Option>
                    <Option value="OwnHosuePledgedRepaidOccasionaly">
                      Own house , pledged, Repaid occasionaly
                    </Option>
                    <Option value="StayingInFamilyHouseTitleNotPledged">
                      Staying in family House, title deed not pledged
                    </Option>
                    <Option value="NoRepayment">No repayment</Option>
                    <Option value="StayingInRentalFamilyShareAvailable">
                      Staying in rental, family share available
                    </Option>
                    <Option value="NoOwnFamilyHouseStayingOnRent">
                      No own / family house, staying on rent
                    </Option>
                  </Field>
                </div>
              </div>
            </div>
          </div>
          {this.state.isMortgageSectionEnabled ? (
            <div className="form-section">
              <FormHeadSection
                sectionLabel="Mortgage Section"
                sectionKey="MortgageSection"
                formSyncError={this.props.formSyncError}
                sectionValidator={this.state.sectionValidator}
              />

              <div className="form-section-content">
                <div className="flex-row">
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Address"}
                      name="Mortgage_Address"
                      component={TextBox}
                      placeholder="Enter Mortgage Address"
                      type="text"
                      hasFeedback
                      className="form-control-coustom"
                      validate={[
                        A8V.required({
                          errorMsg: "Mortgage address is required"
                        })
                      ]}
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label="Type of Property / Status"
                      name="Mortgage_PropertyType"
                      component={Select}
                      placeholder="Select Property / Status"
                      className="a8Select"
                      validate={[
                        A8V.required({
                          errorMsg: "Type of Property is required"
                        })
                      ]}
                    >
                      <Option value="Residential Property-Self Occupied">
                        Residential Property-Self Occupied
                      </Option>
                      <Option value="Residential Property - Rented">
                        Residential Property - Rented
                      </Option>
                      <Option value="Commercial Property - Self Occupied">
                        Commercial Property - Self Occupied
                      </Option>
                      <Option value="Commercial Property - Rented">
                        Commercial Property - Rented
                      </Option>
                      <Option value="Residential Plots">
                        Residential Plots
                      </Option>
                      <Option value="Commercial Plots">Commercial Plots</Option>
                      <Option value="Village Panchayat approved residential property - Self Occupied">
                        Village Panchayat approved residential property - Self
                        Occupied
                      </Option>
                      <Option value="Village Panchayat approved residential property - Rented">
                        Village Panchayat approved residential property - Rented
                      </Option>
                      <Option value="Industrial Property">
                        Industrial Property
                      </Option>
                    </Field>
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Name of Owner(s)"}
                      name="Mortgage_OwnerName"
                      component={TextBox}
                      placeholder="Enter Name of Owner(s)"
                      type="text"
                      hasFeedback
                      className="form-control-coustom"
                      validate={[
                        A8V.required({ errorMsg: "Name of owner is required" })
                      ]}
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label="Age of the building"
                      name="Mortgage_BuildingAge"
                      component={Select}
                      placeholder="Select Property / Status"
                      className="a8Select"
                      validate={[
                        A8V.required({
                          errorMsg: "Age of the building is required"
                        })
                      ]}
                    >
                      <Option value="Less than 1 year/New construction">
                        Less than 1 year/New construction
                      </Option>
                      <Option value="Greater than or equal to 1 year and Less than 5 years">
                        Greater than or equal to 1 year and Less than 5 years
                      </Option>
                      <Option value="Greater than or equal to 5 year and Less than 10 years">
                        Greater than or equal to 5 year and Less than 10 years
                      </Option>
                      <Option value="Greater than or equal to 10 year and Less than 15 years">
                        Greater than or equal to 10 year and Less than 15 years
                      </Option>
                      <Option value="Greater than or equal to 15 years">
                        Greater than or equal to 15 years
                      </Option>
                    </Field>
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label="Location of the property"
                      name="Mortgage_PropertyLocation"
                      component={Select}
                      placeholder="Select Loaction of the property"
                      className="a8Select"
                      validate={[
                        A8V.required({ errorMsg: "Location is required" })
                      ]}
                    >
                      <Option value="Property is located near the main road/highway and access to the property is via tarred roads">
                        Property is located near the main road/highway and
                        access to the property is via tarred roads
                      </Option>
                      <Option value="Access to the property is via gravel road">
                        Access to the property is via gravel road
                      </Option>
                      <Option value="Access to the property is via mud path">
                        Access to the property is via mud path
                      </Option>
                    </Field>
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"GPS Location"}
                      name="Mortgage_PropertyGPSLocation"
                      component={TextBox}
                      placeholder="Enter GPS Location"
                      type="text"
                      hasFeedback
                      className="form-control-coustom"
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label="Property Juristriction Type"
                      name="PropertyJuristrictionType"
                      component={Select}
                      placeholder="Select Property Juristriction Type"
                      className="a8Select"
                      validate={[
                        A8V.required({
                          errorMsg: "Juristriction Type is required"
                        })
                      ]}
                    >
                      <Option value="Corporation/Muncipality">
                        Corporation/Muncipality{" "}
                      </Option>
                      <Option value="Panchayat">Panchayat</Option>
                    </Field>
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Address Line 1"}
                      name="Mortgage_PropertyLocationAddr1"
                      component={TextBox}
                      placeholder="Enter Address Line 1"
                      type="text"
                      hasFeedback
                      className="form-control-coustom"
                      validate={[
                        A8V.required({ errorMsg: "Address Line 1 is required" })
                      ]}
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Address Line 2"}
                      name="Mortgage_PropertyLocationAddr2"
                      component={TextBox}
                      placeholder="Enter Address Line 2"
                      type="text"
                      hasFeedback
                      className="form-control-coustom"
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Landmark"}
                      name="Mortgage_PropertyLandmark"
                      component={TextBox}
                      placeholder="Enter Landmark"
                      type="text"
                      hasFeedback
                      className="form-control-coustom"
                      validate={[
                        A8V.required({ errorMsg: "Landmark is required" })
                      ]}
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label="State"
                      name="Mortgage_State"
                      component={Select}
                      placeholder="Select State"
                      className="a8Select"
                      validate={[
                        A8V.required({ errorMsg: "State is required" })
                      ]}
                    >
                      {this.state.stateOptions.map(data => (
                        <Option value={data.value}>{data.label}</Option>
                      ))}
                    </Field>
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"District"}
                      name="Mortgage_District"
                      component={TextBox}
                      placeholder="Enter District"
                      type="text"
                      hasFeedback
                      className="form-control-coustom"
                      validate={[
                        A8V.required({ errorMsg: "District is required" })
                      ]}
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Village/ City / Town"}
                      name="Mortgage_Town"
                      component={TextBox}
                      placeholder="Enter Town"
                      type="text"
                      hasFeedback
                      className="form-control-coustom"
                      validate={[
                        A8V.required({
                          errorMsg: "Village/ City/ Town is required"
                        })
                      ]}
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Taluk"}
                      name="Mortgage_Taluk"
                      component={TextBox}
                      placeholder="Enter Taluk"
                      type="text"
                      hasFeedback
                      className="form-control-coustom"
                      validate={[
                        A8V.required({ errorMsg: "Taluk is required" })
                      ]}
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Plot Number"}
                      name="Mortgage_PlotNumber"
                      component={TextBox}
                      placeholder="Enter Plot Number"
                      type="text"
                      hasFeedback
                      className="form-control-coustom"
                      validate={[
                        A8V.required({ errorMsg: "Plot Number is required" })
                      ]}
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Survey Number"}
                      name="Mortgage_SurveyNumber"
                      component={TextBox}
                      placeholder="Enter Survey Number"
                      type="text"
                      hasFeedback
                      className="form-control-coustom"
                      validate={[
                        A8V.required({ errorMsg: "Survey Number is required" })
                      ]}
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"East by:"}
                      name="Mortgage_EastBoundary"
                      component={TextBox}
                      placeholder="Enter Bounday East by"
                      type="text"
                      hasFeedback
                      className="form-control-coustom"
                      validate={[
                        A8V.required({ errorMsg: "East Boundary is required" })
                      ]}
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"West by :"}
                      name="Mortgage_WestBoundary"
                      component={TextBox}
                      placeholder="Enter Bounday West by"
                      type="text"
                      hasFeedback
                      className="form-control-coustom"
                      validate={[
                        A8V.required({ errorMsg: "West Boundary is required" })
                      ]}
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"North by :"}
                      name="Mortgage_NorthBoundary"
                      component={TextBox}
                      placeholder="Enter Bounday North by"
                      type="text"
                      hasFeedback
                      className="form-control-coustom"
                      validate={[
                        A8V.required({ errorMsg: "North Boundary is required" })
                      ]}
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"South by :"}
                      name="Mortgage_SouthBoundary"
                      component={TextBox}
                      placeholder="Enter Bounday South by"
                      type="text"
                      hasFeedback
                      className="form-control-coustom"
                      validate={[
                        A8V.required({ errorMsg: "South Boundary is required" })
                      ]}
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Area of the land (in CENTS)"}
                      name="Mortgage_Area"
                      component={TextBox}
                      placeholder="Enter Area(Cents)"
                      type="text"
                      hasFeedback
                      className="form-control-coustom"
                      validate={[
                        A8V.required({ errorMsg: "Area is required" })
                      ]}
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Pincode"}
                      name="Mortgage_Pincode"
                      component={TextBox}
                      placeholder="Enter Pincode"
                      type="text"
                      hasFeedback
                      className="form-control-coustom"
                      validate={[
                        A8V.required({ errorMsg: "Pincode is required" })
                      ]}
                    />
                  </div>
                  {/* <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Land area (sq. ft)"}
                      name="Mortgage_AreaSqFt"
                      component={TextBox}
                      placeholder="Enter Area(Sq.Ft)"
                      type="text"
                      hasFeedback
                      className="form-control-coustom"
                      validate={[
                        A8V.required({ errorMsg: "Land area is required" }),
                      ]}
                    />
                  </div> */}
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Building area (sq. ft)"}
                      name="Mortgage_BuildingArea"
                      component={TextBox}
                      placeholder="Enter Building Area(Sq.Ft)"
                      type="text"
                      hasFeedback
                      className="form-control-coustom"
                      validate={[
                        A8V.required({ errorMsg: "Mortgage Area is required" })
                      ]}
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Realizable Value"}
                      name="Mortgage_RealizableValue"
                      component={TextBox}
                      placeholder="Enter Realizable Value"
                      type="text"
                      hasFeedback
                      className="form-control-coustom"
                      validate={[
                        A8V.required({
                          errorMsg: "Mortgage Realizable Value is required"
                        })
                      ]}
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Forced SaleValue"}
                      name="Mortgage_Forced_SaleValue"
                      component={TextBox}
                      placeholder="Enter Forced SaleValue"
                      type="text"
                      hasFeedback
                      className="form-control-coustom"
                      validate={[
                        A8V.required({
                          errorMsg: "Mortgage Forced SaleValue is required"
                        })
                      ]}
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Estimated Market Value (in lakhs)"}
                      name="Mortgage_MarketValue"
                      component={TextBox}
                      placeholder="Enter Market Value"
                      type="text"
                      hasFeedback
                      className="form-control-coustom"
                      validate={[
                        A8V.required({
                          errorMsg: "Estimated Market Value is required"
                        })
                      ]}
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Purchase Price"}
                      name="Mortgage_PurchasePrice"
                      component={TextBox}
                      placeholder="Enter Purchase Price"
                      type="text"
                      hasFeedback
                      className="form-control-coustom"
                      validate={[
                        A8V.required({ errorMsg: "Purchase Price is required" })
                      ]}
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Purchased On"}
                      name="Mortgage_PurchaseDate"
                      component={TextBox}
                      placeholder="Enter Purchased On"
                      type="text"
                      hasFeedback
                      className="form-control-coustom"
                      validate={[
                        A8V.required({ errorMsg: "Purchased on is required" })
                      ]}
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Collateral Ownership (in years)"}
                      name="Mortgage_CollateralOwnershipPeriod"
                      component={TextBox}
                      placeholder="Enter Collateral Ownership"
                      type="text"
                      hasFeedback
                      className="form-control-coustom"
                      validate={[
                        A8V.required({
                          errorMsg: "Collateral Ownership is required"
                        })
                      ]}
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label="Source"
                      name="Mortgage_Source"
                      component={Select}
                      placeholder="Select Collateral Type"
                      className="a8Select"
                      validate={[
                        A8V.required({
                          errorMsg: "Mortgage Source is required"
                        })
                      ]}
                    >
                      <Option value="Own">Own</Option>
                      <Option value="Bank finance">Bank finance</Option>
                      <Option value="NBFC">NBFC</Option>
                      <Option value="Borrowed from Others">
                        Borrowed from Others
                      </Option>
                    </Field>
                  </div>
                  {/* <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Current status of property"}
                      name="Mortgage_CurrentStatus"
                      component={TextBox}
                      placeholder="Enter Current Status of the property"
                      type="text"
                      hasFeedback
                      className="form-control-coustom"
                      validate={[
                        A8V.required({ errorMsg: "Current Status is required" }),
                      ]}
                    />
                  </div> */}
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label="Mortagaged in the Past?"
                      name="Mortgage_PastMortgage"
                      buttonStyle="outline"
                      component={RadioWrapper}
                      validate={[
                        A8V.required({ errorMsg: "Past Mortgage is required" })
                      ]}
                    >
                      <Radio value="Yes">Yes</Radio>
                      <Radio value="No">No</Radio>
                    </Field>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
          {this.state.isMortgageSectionEnabled ? (
            <div className="form-section">
              <FormHeadSection
                sectionLabel="Mortgage Title Deed Details"
                sectionKey="MortgageTitleDeed"
                formSyncError={this.props.formSyncError}
                sectionValidator={this.state.sectionValidator}
              />
              <div className="form-section-content">
                <div className="flex-row">
                  <div className="form-group col-xs-6 col-md-6">
                    <Field
                      label="Title Deed Document Number"
                      name="TitleDeedDocumentNumber"
                      component={TextBox}
                      placeholder="Enter Title Deed Document Number"
                      type="text"
                      hasFeedback
                      className="form-control-coustom"
                      validate={[
                        A8V.required({
                          errorMsg: "Document Number is required"
                        })
                      ]}
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-6">
                    <Field
                      label="Select Title Deed Document Date"
                      name="TitleDeedDocumentDate"
                      component={DatePicker}
                      dateFormat="DD-MM-YYYY"
                      placeholder="Select Date"
                      validate={[
                        A8V.required({ errorMsg: "Document Date is required" })
                      ]}
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-6">
                    <Field
                      label="Title Document Main Type"
                      name="TitleDocumentType"
                      component={Select}
                      placeholder="Select Document type"
                      onChange={this.handleDeedMainTypeChange}
                      className="a8Select"
                      validate={[
                        A8V.required({ errorMsg: "Document Type is required" })
                      ]}
                    >
                      <Option value="SecurityDocuments-2">
                        Security Documents - 2
                      </Option>
                      <Option value="SecurityDocuments-1">
                        Security Documents -1
                      </Option>
                    </Field>
                  </div>
                  <div className="form-group col-xs-6 col-md-6">
                    <Field
                      label="Title Document Sub Type"
                      name="TitleDocumentSubType"
                      component={Select}
                      placeholder="Select Document Subtype"
                      className="a8Select"
                      validate={[
                        A8V.required({
                          errorMsg: "Document Sub Type is required"
                        })
                      ]}
                    >
                      {this.state.titleSubOptions.map(data => (
                        <Option value={data.value}>{data.label}</Option>
                      ))}
                    </Field>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
          {this.state.isMortgageSectionEnabled && (
            <div className="form-section">
              <div
                className={classname("form-section-head clearfix", {
                  on: false
                })}
              >
                <h3>{"Front view"}</h3>
              </div>
              <div className="form-section-content">
                {/** File Uploader */}
                <Field
                  label={"Front view"}
                  name="FrontViewImage"
                  component={Scanner}
                  docType="IMG"
                  imageVar="FrontViewImage"
                  taskInfo={this.props.taskInfo}
                  a8flowApiUrl={`${Config.baseUrl}`}
                  ipc={this.props.ipc}
                />
              </div>
            </div>
          )}
          {this.state.isMortgageSectionEnabled && (
            <div className="form-section">
              <div
                className={classname("form-section-head clearfix", {
                  on: false
                })}
              >
                <h3>{"Front view with road access"}</h3>
              </div>
              <div className="form-section-content">
                {/** File Uploader */}
                <Field
                  label={"Front view with Road access"}
                  name="Frontviewwithroadaccess"
                  component={Scanner}
                  docType="IMG"
                  imageVar="FrontViewWithRoadaccess"
                  taskInfo={this.props.taskInfo}
                  a8flowApiUrl={`${Config.baseUrl}`}
                  ipc={this.props.ipc}
                />
              </div>
            </div>
          )}
          {this.state.isMortgageSectionEnabled && (
            <div className="form-section">
              <div
                className={classname("form-section-head clearfix", {
                  on: false
                })}
              >
                <h3>{"Interior Photo 1"}</h3>
              </div>
              <div className="form-section-content">
                {/** File Uploader */}
                <Field
                  label={"Interior Photo 1"}
                  name="InteriorPhoto1"
                  component={Scanner}
                  docType="IMG"
                  imageVar="InteriorPhoto1"
                  taskInfo={this.props.taskInfo}
                  a8flowApiUrl={`${Config.baseUrl}`}
                  ipc={this.props.ipc}
                />
              </div>
            </div>
          )}
          {this.state.isMortgageSectionEnabled && (
            <div className="form-section">
              <div
                className={classname("form-section-head clearfix", {
                  on: false
                })}
              >
                <h3>{"Interior Photo 2"}</h3>
              </div>
              <div className="form-section-content">
                {/** File Uploader */}
                <Field
                  label={"Interior Photo 2"}
                  name="InteriorPhoto2"
                  component={Scanner}
                  docType="IMG"
                  imageVar="InteriorPhoto2"
                  taskInfo={this.props.taskInfo}
                  a8flowApiUrl={`${Config.baseUrl}`}
                  ipc={this.props.ipc}
                />
              </div>
            </div>
          )}
          {this.state.isHypothecatedMachineryEnabled ? (
            <div className="form-section">
              <FormHeadSection
                sectionLabel="Hypothecated Machinery, Equipment Details"
                sectionKey="HypothecatedMachinery"
                formSyncError={this.props.formSyncError}
                sectionValidator={this.state.sectionValidator}
              //use this props to set firstTab always open
              />
              <div className="form-section-content">
                <div className="flex-row">
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Manufacturer Name"}
                      name="HypoME_ManufName"
                      component={TextBox}
                      placeholder="Enter Hypothecated Name"
                      type="text"
                      hasFeedback
                      className="form-control-coustom"
                      validate={[
                        A8V.required({
                          errorMsg: "Manufactuer Name is required"
                        })
                      ]}
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Machine Model"}
                      name="HypoME_Model"
                      component={TextBox}
                      placeholder="Enter Machine Model"
                      type="text"
                      hasFeedback
                      className="form-control-coustom"
                      validate={[
                        A8V.required({ errorMsg: "Machine Model is required" })
                      ]}
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Supplier Name"}
                      name="HypoME_Supplier"
                      component={TextBox}
                      placeholder="Enter Supplier Name"
                      type="text"
                      hasFeedback
                      className="form-control-coustom"
                      validate={[
                        A8V.required({ errorMsg: "Supplier name is required" })
                      ]}
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Type of Machinery/Asset"}
                      name="HypoME_MachineType"
                      component={TextBox}
                      placeholder="Enter Machine Type"
                      type="text"
                      hasFeedback
                      className="form-control-coustom"
                      validate={[
                        A8V.required({ errorMsg: "Machine Type is required" })
                      ]}
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Purpose"}
                      name="HypoME_MachinePurpose"
                      component={TextBox}
                      placeholder="Enter Machine Purpose"
                      type="text"
                      hasFeedback
                      className="form-control-coustom"
                      validate={[
                        A8V.required({ errorMsg: "Purpose is required" })
                      ]}
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label="Imported or Indegenious"
                      name="HypoME_Imported"
                      buttonStyle="outline"
                      component={RadioWrapper}
                      validate={[
                        A8V.required({
                          errorMsg: "Imported or Indegenious is required"
                        })
                      ]}
                    >
                      <Radio value="Imported">Imported</Radio>
                      <Radio value="Indegenious">Indegenious</Radio>
                    </Field>
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Serial Number"}
                      name="HypoME_SerialNumber"
                      component={TextBox}
                      placeholder="Enter Serial Number"
                      type="text"
                      hasFeedback
                      className="form-control-coustom"
                      validate={[
                        A8V.required({ errorMsg: "Serial Number is required" })
                      ]}
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Quantity"}
                      name="HypoME_Quantity"
                      component={TextBox}
                      placeholder="Enter Quantity"
                      type="text"
                      normalize={proceedNumber}
                      hasFeedback
                      className="form-control-coustom"
                      validate={[
                        A8V.required({ errorMsg: "Quantity is required" })
                      ]}
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Purchase Price"}
                      name="HypoME_PurchasePrice"
                      component={TextBox}
                      placeholder="Enter Purchase Price"
                      type="text"
                      normalize={inrFormat}
                      hasFeedback
                      className="form-control-coustom"
                      onChange={this.calculateHypoValue}
                      validate={[
                        A8V.required({ errorMsg: "Purchase price is required" })
                      ]}
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Value"}
                      name="HypoME_Value"
                      component={TextBox}
                      placeholder="Enter Value"
                      type="text"
                      normalize={inrFormat}
                      hasFeedback
                      className="form-control-coustom"
                      validate={[
                        A8V.required({ errorMsg: "Value is required" })
                      ]}
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Estimated Market Value (in lakhs)"}
                      name="HypoME_MarketValue"
                      component={TextBox}
                      placeholder="Enter Value"
                      normalize={inrFormat}
                      type="text"
                      hasFeedback
                      className="form-control-coustom"
                      validate={[
                        A8V.required({
                          errorMsg: "Estimated Market value is required"
                        })
                      ]}
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label="Purchased On"
                      name="HypoME_PurchaseDate"
                      component={DatePicker}
                      dateFormat="DD-MM-YYYY"
                      placeholder="Select Time"
                      validate={[
                        A8V.required({ errorMsg: "Purchased on is required" })
                      ]}
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Location of Collateral"}
                      name="HypoME_CollateralLocation"
                      component={TextBox}
                      placeholder="Enter Value"
                      type="text"
                      hasFeedback
                      className="form-control-coustom"
                      validate={[
                        A8V.required({
                          errorMsg: "Collateral location is required"
                        })
                      ]}
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label="Source"
                      name="HypoME_Source"
                      component={Select}
                      placeholder="Select Source"
                      className="a8Select"
                      validate={[
                        A8V.required({ errorMsg: "Source is required" })
                      ]}
                    >
                      <Option value="Own">Own</Option>
                      <Option value="Bank finance">Bank finance</Option>
                      <Option value="NBFC">NBFC</Option>
                      <Option value="Borrowed from Others">Borrowed from Others</Option>
                    </Field>
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label="Has collateral been Hypothecated in the past ?"
                      name="HypoME_PastHypoME"
                      buttonStyle="outline"
                      component={RadioWrapper}
                      validate={[
                        A8V.required({
                          errorMsg: "Past Hypothecation is required"
                        })
                      ]}
                    >
                      <Radio value="Yes">Yes</Radio>
                      <Radio value="No">No</Radio>
                    </Field>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
          {this.state.isHypothecatedVehicleEnabled ? (
            <div className="form-section">
              <FormHeadSection
                sectionLabel="Hypothecated Vehicle Details"
                sectionKey="HypothecatedVehicle"
                formSyncError={this.props.formSyncError}
                sectionValidator={this.state.sectionValidator}
              //use this props to set firstTab always open
              />
              <div className="form-section-content">
                <div className="flex-row">
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Vehicle Type"}
                      name="HypoVeh_VehicleType"
                      component={TextBox}
                      placeholder="Enter Vehicle Type"
                      type="text"
                      hasFeedback
                      className="form-control-coustom"
                      validate={[
                        A8V.required({ errorMsg: "Vehicle Type is required" })
                      ]}
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Manufacturer"}
                      name="HypoVeh_Manufacturer"
                      component={TextBox}
                      placeholder="Enter Maufacturer"
                      type="text"
                      hasFeedback
                      className="form-control-coustom"
                      validate={[
                        A8V.required({ errorMsg: "Manufacturer is required" })
                      ]}
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Asset Model"}
                      name="HypoVeh_AssetModel"
                      component={TextBox}
                      placeholder="Enter Asset Model"
                      type="text"
                      hasFeedback
                      className="form-control-coustom"
                      validate={[
                        A8V.required({ errorMsg: "Asset Model is required" })
                      ]}
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Asset Make"}
                      name="HypoVeh_AssetMake"
                      component={TextBox}
                      placeholder="Enter Asset Make"
                      type="text"
                      hasFeedback
                      className="form-control-coustom"
                      validate={[
                        A8V.required({ errorMsg: "Asset Make is required" })
                      ]}
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Value"}
                      name="HypoVeh_VehicleValue"
                      component={TextBox}
                      placeholder="Enter Vehicle Value"
                      type="text"
                      normalize={inrFormat}
                      hasFeedback
                      className="form-control-coustom"
                      validate={[
                        A8V.required({ errorMsg: "Vehicle Value is required" })
                      ]}
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Registration Number"}
                      name="HypoVeh_RegistrationNumber"
                      component={TextBox}
                      placeholder="Enter Registeration Number"
                      type="text"
                      hasFeedback
                      className="form-control-coustom"
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label="Date of Purchase"
                      name="HypoVeh_DateofPurchase"
                      component={DatePicker}
                      dateFormat="DD-MM-YYYY"
                      showTime
                      placeholder="Select Time"
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Estimated Market Value (in lakhs)"}
                      name="HypoVeh_MarketValue"
                      component={TextBox}
                      placeholder="Enter Market Value"
                      type="text"
                      hasFeedback
                      className="form-control-coustom"
                      validate={[
                        A8V.required({
                          errorMsg: "Estimated Market Value is required"
                        })
                      ]}
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Purchase Price"}
                      name="HypoVeh_PurchasePrice"
                      component={TextBox}
                      placeholder="Enter Purchase Price"
                      type="text"
                      normalize={inrFormat}
                      hasFeedback
                      className="form-control-coustom"
                      validate={[
                        A8V.required({ errorMsg: "Purchase Price is required" })
                      ]}
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Location of Collateral"}
                      name="HypoVeh_CollateralLocation"
                      component={TextBox}
                      placeholder="Enter Location of Collateral"
                      type="text"
                      hasFeedback
                      className="form-control-coustom"
                      onChange={this.calculateHypoValue}
                      validate={[
                        A8V.required({
                          errorMsg: "Collateral location is required"
                        })
                      ]}
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label="Source"
                      name="HypoVeh_Source"
                      component={Select}
                      placeholder="Select Source"
                      className="a8Select"
                      validate={[
                        A8V.required({ errorMsg: "Source is required" })
                      ]}
                    >
                      <Option value="Own">Own</Option>
                      <Option value="Bank finance">Bank finance</Option>
                      <Option value="NBFC">NBFC</Option>
                      <Option value="Borrowed from Others">Borrowed from Others</Option>
                    </Field>
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label="Has collateral been Hypothecated in the past?"
                      name="HypoVeh_PastHypoVeh"
                      buttonStyle="outline"
                      component={RadioWrapper}
                      validate={[
                        A8V.required({
                          errorMsg: "Past hypothecation is required"
                        })
                      ]}
                    >
                      <Radio value="Yes">Yes</Radio>
                      <Radio value="No">No</Radio>
                    </Field>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
          {this.state.isHypothecatedInventoryEnabled ? (
            <div className="form-section">
              <FormHeadSection
                sectionLabel="Hypothecated Inventory, Furnitures Details"
                sectionKey="HypothecatedInventoryFurniture"
                formSyncError={this.props.formSyncError}
                sectionValidator={this.state.sectionValidator}
              //use this props to set firstTab always open
              />
              <div className="form-section-content">
                <div className="flex-row">
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Purchase Price"}
                      name="HypoFFI_PurchasePrice"
                      component={TextBox}
                      placeholder="Enter Purchase Price"
                      type="text"
                      normalize={inrFormat}
                      hasFeedback
                      className="form-control-coustom"
                      validate={[
                        A8V.required({ errorMsg: "Purchase Price is required" })
                      ]}
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label="Date of Purchase"
                      name="HypoFFI_PurchaseDate"
                      component={DatePicker}
                      dateFormat="DD-MM-YYYY"
                      placeholder="Select Time"
                      validate={[
                        A8V.required({
                          errorMsg: "Date of Purchase is required"
                        })
                      ]}
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Estimated Market Value (in lakhs)"}
                      name="HypoFFI_MarketValue"
                      component={TextBox}
                      placeholder="Enter Estimated Market Value"
                      type="text"
                      normalize={inrFormat}
                      hasFeedback
                      className="form-control-coustom"
                      validate={[
                        A8V.required({
                          errorMsg: "Estimated Market Value is required"
                        })
                      ]}
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Location of Collateral"}
                      name="HypoFFI_CollateralLocation"
                      component={TextBox}
                      placeholder="Enter Asset Model"
                      type="text"
                      hasFeedback
                      className="form-control-coustom"
                      validate={[
                        A8V.required({
                          errorMsg: "Location of Collateral is required"
                        })
                      ]}
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label="Source"
                      name="HypoFFI_Source"
                      component={Select}
                      placeholder="Select Source"
                      className="a8Select"
                      validate={[
                        A8V.required({ errorMsg: "Source is required" })
                      ]}
                    >
                      <Option value="Own">Own</Option>
                      <Option value="Bank finance">Bank finance</Option>
                      <Option value="NBFC">NBFC</Option>
                      <Option value="Borrowed from Others">
                        Borrowed from Others
                      </Option>
                    </Field>
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label="Has collateral been Hypothecated in the past?"
                      name="HypoFFI_PastHypothecation"
                      buttonStyle="outline"
                      component={RadioWrapper}
                      validate={[
                        A8V.required({
                          errorMsg: "Previous Hypothecation is required"
                        })
                      ]}
                    >
                      <Radio value="Yes">Yes</Radio>
                      <Radio value="No">No</Radio>
                    </Field>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
          {this.state.isPledgedSectionEnabled ? (
            <div className="form-section">
              <FormHeadSection
                sectionLabel="Pledged Details"
                sectionKey="PledgedDetails"
                formSyncError={this.props.formSyncError}
                sectionValidator={this.state.sectionValidator}
              //use this props to set firstTab always open
              />
              <div className="form-section-content">
                <div className="flex-row">
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Estimated Market Value (in lakhs)"}
                      name="Pledge_MarketValue"
                      component={TextBox}
                      placeholder="Enter Market value(Lakhs)"
                      type="text"
                      normalize={inrFormat}
                      hasFeedback
                      className="form-control-coustom"
                      validate={[
                        A8V.required({
                          errorMsg: "Estimated Market Value is required"
                        })
                      ]}
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label={"Purchase Price"}
                      name="Pledge_PurchasePrice"
                      component={TextBox}
                      placeholder="Enter Purchase Price"
                      type="text"
                      normalize={inrFormat}
                      hasFeedback
                      className="form-control-coustom"
                      validate={[
                        A8V.required({ errorMsg: "Purchase Price is required" })
                      ]}
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label="Purchased On"
                      name="Pledge_PurchasedOn"
                      component={DatePicker}
                      dateFormat="DD-MM-YYYY"
                      placeholder="Select Time"
                      validate={[
                        A8V.required({
                          errorMsg: "Purchased On Date is required"
                        })
                      ]}
                    />
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label="Source"
                      name="Pledge_Source"
                      component={Select}
                      placeholder="Select Source"
                      className="a8Select"
                      validate={[
                        A8V.required({ errorMsg: "Source is required" })
                      ]}
                    >
                      <Option value="Own">Own</Option>
                      <Option value="Bank finance">Bank finance</Option>
                      <Option value="NBFC">NBFC</Option>
                      <Option value="Borrowed from Others">
                        Borrowed from Others
                      </Option>
                    </Field>
                  </div>
                  <div className="form-group col-xs-6 col-md-4">
                    <Field
                      label="Has collateral been pledged in the past?"
                      name="Pledge_PastPledge"
                      buttonStyle="outline"
                      component={RadioWrapper}
                      validate={[
                        A8V.required({ errorMsg: "Past Pleddge is required" })
                      ]}
                    >
                      <Radio value="Yes">Yes</Radio>
                      <Radio value="No">No</Radio>
                    </Field>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    );
  }
}
const mapStateToProps = (state, props) => {
  console.log("***** CO PROCESS VALUES *****", state)
  return {
    //get current form values
    formValues: getFormValues("coProcess")(state),
    //get current form sync errors
    formSyncError: getFormSyncErrors("coProcess")(state),
    //taskInfo
    task: state.task
  };
};
export default connect(
  mapStateToProps,
  {}
)(TabCollateral);
