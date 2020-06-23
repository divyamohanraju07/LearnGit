import * as React from 'react'
import { FormHeadSection, Config } from '../../helpers'
import { AccountDetailsView } from 'a8flow-uikit'
import {
  // Field,
  getFormSyncErrors,
  getFormValues,
} from 'redux-form'
import { Button } from 'antd'
import { connect } from 'react-redux'
import validate from 'validate.js'
import axios from 'axios'
type Props = {
  formSyncError: []
  task: any
  fieldPopulator: any
  taskInfo: any
  formValues: any
}
type State = {
  sectionValidator: any
  cardView: any
  coAppCollateralCardView: any
  guaCollatralCardView: any
  UploaderEsafSample: any
}
class TabCollateralInformation extends React.Component<Props, State> {
  state = {
    /**
     * sectionValidator responsible for handling the particular formSection is valid or not
     * sectionValidator schema : { keyToCheckSection : [arrays of what are the fields we need to watch]}
     */
    sectionValidator: {
      ApplicantCollateralInformation: [],
      coApplicantCollateralInformation: [],
      guarantorCollateralInformation: [],
      collateralUploader: ['UploaderEsafSample'],
    },
    UploaderEsafSample: {
      // name of uploader field name
      fieldName: 'UploaderEsafSample',
      /**
       * fileInfo props contain all the fileinfo user need to upload
       * fileInfo.length should be equal to uploadLimit
       * Note : whatever field you specifiy in defaultValuesFieldNames you need include here
       */
      // fileInfo: [
      //   { name: "Adhar Card", key: "AdharCard" },
      //   { name: "Pan Card", key: "PanCard" },
      //   { name: "Passport", key: "Passport" }
      // ],
      /**
       * defaultValuesFieldNames props responsible for appending default values to uploader
       */
      defaultValuesFieldNames: ['AdharCard'],
      // uploadLimit handle how many fields the user need to upload
      // uploadLimit: 3,
      /**
       * errorMsg : handle custom error messages.
       * you can pass to handle different sceneries
       */
      errorMsg: {
        //if upload limit exceed
        uploadLimit: 'Upload limit exceed!',
        //if fileInfo.length != uploadLimit below message will show
        fileInfoUploadLimitMisMatch:
          'YOUR FIELD NAME props fileinfo and upload limit should be equal',
        //if multiple file uploads have same name
        variableNameConflict: 'File Name should be unique',
        //if file uploaded, force your to select file/variable name
        updateVariableName: 'Please Select File Name',
      },
      //this props handle defaultFiles fetching state
      initialUploadLoader: false,
    },
    cardView: [],
    coAppCollateralCardView: [],
    guaCollatralCardView: [],
  }
  mapCardSections = () => {
    try {
      var processVariables = this.props.formValues
      var totalInformations = {
        'Collateral Information': {
          AssetType: '',
          CollateralID: '',
          CollateralType: '',
          Mortgage_Address: '',
          Mortgage_Area: '',
          Mortgage_BuildingAge: '',
          Mortgage_BuildingArea: '',
          Mortgage_CollateralOwnershipPeriod: '',
          Mortgage_District: '',
          Mortgage_EastBoundary: '',
          Mortgage_Forced_SaleValue: '',
          Mortgage_MarketValue: '',
          Mortgage_NorthBoundary: '',
          Mortgage_OwnerName: '',
          Mortgage_PastMortgage: '',
          Mortgage_Pincode: '',
          Mortgage_PlotNumber: '',
          Mortgage_PropertyGPSLocation: '',
          Mortgage_PropertyLandmark: '',
          Mortgage_PropertyLocation: '',
          Mortgage_PropertyLocationAddr1: '',
          Mortgage_PropertyLocationAddr2: '',
          Mortgage_PropertyType: '',
          Mortgage_PurchaseDate: '',
          Mortgage_PurchasePrice: '',
          Mortgage_RealizableValue: '',
          Mortgage_Source: '',
          Mortgage_SouthBoundary: '',
          Mortgage_State: '',
          Mortgage_SurveyNumber: '',
          Mortgage_Taluk: '',
          Mortgage_Town: '',
          Mortgage_WestBoundary: '',
          OwnHouseStatus: '',
          PropertyJuristrictionType: '',
          TitleDeedDocumentNumber: '',
          TitleDocumentSubDropdown: '',
          TitleDocumentTypeMain: '',
          TitleDeedDocumentDate: '',
          HypoME_ManufactureName: '',
          HypoME_Model: '',
          HypoME_Supplier: '',
          HypoME_MachineType: '',
          HypoME_MachinePurpose: '',
          HypoME_Imported: '',
          HypoME_SerialNumber: '',
          HypoME_Quantity: '',
          HypoME_PurchasePrice: '',
          HypoME_Value: '',
          HypoME_MarketValue: '',
          HypoME_PurchaseDate: '',
          HypoME_CollateralLocation: '',
          HypoME_Source: '',
          HypoME_PastHypoME: '',
          HypoVeh_VehicleType: '',
          HypoVeh_Manufacturer: '',
          HypoVeh_AssetModel: '',
          HypoVeh_AssetMake: '',
          HypoVeh_VehicleValue: '',
          HypoVeh_MarketValue: '',
          HypoVeh_PurchasePrice: '',
          HypoVeh_CollateralLocation: '',
          HypoVeh_Source: '',
          HypoVeh_PastHypoVeh: '',
          HypoFFI_PurchasePrice: '',
          HypoFFI_PurchaseDate: '',
          HypoFFI_MarketValue: '',
          HypoFFI_CollateralLocation: '',
          HypoFFI_Source: '',
          HypoFFI_PastHypothecation: '',
          Pledge_MarketValue: '',
          Pledge_PurchasePrice: '',
          Pledge_PurchasedOn: '',
          Pledge_Source: '',
          Pledge_PastPledge: '',
        },
        'Income and Expense Details': {
          OccupationType: '',
          OtherIncome: '',
          TotalApplicantIncome: '',
          VerificationSource: '',
          OthersSpecify: '',
          BorrowerExistingHousehold: '',
          HouseholdHeadName: '',
          Rent: '',
          Food: '',
          'Water/Electricity': '',
          Education: '',
          Clothing: '',
          HealthCare: '',
          Transportation: '',
          Telephone: '',
          Other: '',
          FixedObligations: '',
          HouseholdDebtPayment: '',
          TotalExpenses: '',
          BankName: '',
          EstimatedEMI: '',
          LoanType: '',
          OutstandingBalance: '',
          BusinessEvaluationApproach: '',
          MonthStart: '',
          TotalDeposit: '',
          MonthEndBalance: '',
          InwardBounces: '',
          OutwardBounces: '',
          TotalBounces: '',
          MultiplierNeededBankHistory: '',
          MultiplierValueBankHistory: '',
          GSTFilingApproach: '',
          MultiplierNeededGST: '',
          MultiplierValueGST: '',
          SalesMonth1: '',
          SalesMonth2: '',
          SalesMonth3: '',
          SalesMonth4: '',
          SalesMonth5: '',
          SalesMonth6: '',
          SalesQuarter1: '',
          SalesQuarter2: '',
          YearlySales: '',
          MonthlyITRSales: '',
          MultiplierNeededITR: '',
          MultiplierValueITR: '',
          ITRSalesYear1: '',
          ITRSalesYear2: '',
        },
      }
      var cardView = []
      for (let parentKey in totalInformations) {
        let collectCardData = { accountName: '', fields: [] }
        collectCardData.accountName = parentKey
        collectCardData.fields = []
        //append actual data to totalInformation
        for (let childKey in totalInformations[parentKey]) {
          totalInformations[parentKey][childKey] = processVariables[childKey]
            ? processVariables[childKey].value
            : ''
          if (!validate.isEmpty(totalInformations[parentKey][childKey])) {
            collectCardData.fields.push({
              fieldKey: childKey,
              fieldValue: totalInformations[parentKey][childKey],
            })
          }
        }
        cardView.push(collectCardData)
      }
      this.setState({ cardView: cardView })
    } catch (error) {
      throw error
    }
  }
  mapcoAppCollateralCardSections = () => {
    try {
      var processVariables = this.props.formValues
      var totalInformations = {
        'Collateral Information': {
          AssetType: '',
          CollateralID: '',
          CollateralType: '',
          Mortgage_Address: '',
          Mortgage_Area: '',
          Mortgage_BuildingAge: '',
          Mortgage_BuildingArea: '',
          Mortgage_CollateralOwnershipPeriod: '',
          Mortgage_District: '',
          Mortgage_EastBoundary: '',
          Mortgage_Forced_SaleValue: '',
          Mortgage_MarketValue: '',
          Mortgage_NorthBoundary: '',
          Mortgage_OwnerName: '',
          Mortgage_PastMortgage: '',
          Mortgage_Pincode: '',
          Mortgage_PlotNumber: '',
          Mortgage_PropertyGPSLocation: '',
          Mortgage_PropertyLandmark: '',
          Mortgage_PropertyLocation: '',
          Mortgage_PropertyLocationAddr1: '',
          Mortgage_PropertyLocationAddr2: '',
          Mortgage_PropertyType: '',
          Mortgage_PurchaseDate: '',
          Mortgage_PurchasePrice: '',
          Mortgage_RealizableValue: '',
          Mortgage_Source: '',
          Mortgage_SouthBoundary: '',
          Mortgage_State: '',
          Mortgage_SurveyNumber: '',
          Mortgage_Taluk: '',
          Mortgage_Town: '',
          Mortgage_WestBoundary: '',
          OwnHouseStatus: '',
          PropertyJuristrictionType: '',
          TitleDeedDocumentNumber: '',
          TitleDocumentSubDropdown: '',
          TitleDocumentTypeMain: '',
          TitleDeedDocumentDate: '',
          HypoME_ManufactureName: '',
          HypoME_Model: '',
          HypoME_Supplier: '',
          HypoME_MachineType: '',
          HypoME_MachinePurpose: '',
          HypoME_Imported: '',
          HypoME_SerialNumber: '',
          HypoME_Quantity: '',
          HypoME_PurchasePrice: '',
          HypoME_Value: '',
          HypoME_MarketValue: '',
          HypoME_PurchaseDate: '',
          HypoME_CollateralLocation: '',
          HypoME_Source: '',
          HypoME_PastHypoME: '',
          HypoVeh_VehicleType: '',
          HypoVeh_Manufacturer: '',
          HypoVeh_AssetModel: '',
          HypoVeh_AssetMake: '',
          HypoVeh_VehicleValue: '',
          HypoVeh_MarketValue: '',
          HypoVeh_PurchasePrice: '',
          HypoVeh_CollateralLocation: '',
          HypoVeh_Source: '',
          HypoVeh_PastHypoVeh: '',
          HypoFFI_PurchasePrice: '',
          HypoFFI_PurchaseDate: '',
          HypoFFI_MarketValue: '',
          HypoFFI_CollateralLocation: '',
          HypoFFI_Source: '',
          HypoFFI_PastHypothecation: '',
          Pledge_MarketValue: '',
          Pledge_PurchasePrice: '',
          Pledge_PurchasedOn: '',
          Pledge_Source: '',
          Pledge_PastPledge: '',
        },
        'Income and Expense Details': {
          OccupationType: '',
          OtherIncome: '',
          TotalApplicantIncome: '',
          VerificationSource: '',
          OthersSpecify: '',
          BorrowerExistingHousehold: '',
          HouseholdHeadName: '',
          Rent: '',
          Food: '',
          'Water/Electricity': '',
          Education: '',
          Clothing: '',
          HealthCare: '',
          Transportation: '',
          Telephone: '',
          Other: '',
          FixedObligations: '',
          HouseholdDebtPayment: '',
          TotalExpenses: '',
          BankName: '',
          EstimatedEMI: '',
          LoanType: '',
          OutstandingBalance: '',
          BusinessEvaluationApproach: '',
          MonthStart: '',
          TotalDeposit: '',
          MonthEndBalance: '',
          InwardBounces: '',
          OutwardBounces: '',
          TotalBounces: '',
          MultiplierNeededBankHistory: '',
          MultiplierValueBankHistory: '',
          GSTFilingApproach: '',
          MultiplierNeededGST: '',
          MultiplierValueGST: '',
          SalesMonth1: '',
          SalesMonth2: '',
          SalesMonth3: '',
          SalesMonth4: '',
          SalesMonth5: '',
          SalesMonth6: '',
          SalesQuarter1: '',
          SalesQuarter2: '',
          YearlySales: '',
          MonthlyITRSales: '',
          MultiplierNeededITR: '',
          MultiplierValueITR: '',
          ITRSalesYear1: '',
          ITRSalesYear2: '',
        },
      }
      var cardView = []
      for (let parentKey in totalInformations) {
        let collectCardData = { accountName: '', fields: [] }
        collectCardData.accountName = parentKey
        collectCardData.fields = []
        //append actual data to totalInformation
        for (let childKey in totalInformations[parentKey]) {
          totalInformations[parentKey][childKey] = processVariables[childKey]
            ? processVariables[childKey].value
            : ''
          if (!validate.isEmpty(totalInformations[parentKey][childKey])) {
            collectCardData.fields.push({
              fieldKey: childKey,
              fieldValue: totalInformations[parentKey][childKey],
            })
          }
        }
        cardView.push(collectCardData)
      }
      this.setState({ coAppCollateralCardView: cardView })
    } catch (error) {
      throw error
    }
  }
  mapGuaCollateralCardSections = () => {
    try {
      var processVariables = this.props.formValues
      var totalInformations = {
        'Collateral Information': {
          AssetType: '',
          CollateralID: '',
          CollateralType: '',
          Mortgage_Address: '',
          Mortgage_Area: '',
          Mortgage_BuildingAge: '',
          Mortgage_BuildingArea: '',
          Mortgage_CollateralOwnershipPeriod: '',
          Mortgage_District: '',
          Mortgage_EastBoundary: '',
          Mortgage_Forced_SaleValue: '',
          Mortgage_MarketValue: '',
          Mortgage_NorthBoundary: '',
          Mortgage_OwnerName: '',
          Mortgage_PastMortgage: '',
          Mortgage_Pincode: '',
          Mortgage_PlotNumber: '',
          Mortgage_PropertyGPSLocation: '',
          Mortgage_PropertyLandmark: '',
          Mortgage_PropertyLocation: '',
          Mortgage_PropertyLocationAddr1: '',
          Mortgage_PropertyLocationAddr2: '',
          Mortgage_PropertyType: '',
          Mortgage_PurchaseDate: '',
          Mortgage_PurchasePrice: '',
          Mortgage_RealizableValue: '',
          Mortgage_Source: '',
          Mortgage_SouthBoundary: '',
          Mortgage_State: '',
          Mortgage_SurveyNumber: '',
          Mortgage_Taluk: '',
          Mortgage_Town: '',
          Mortgage_WestBoundary: '',
          OwnHouseStatus: '',
          PropertyJuristrictionType: '',
          TitleDeedDocumentNumber: '',
          TitleDocumentSubDropdown: '',
          TitleDocumentTypeMain: '',
          TitleDeedDocumentDate: '',
          HypoME_ManufactureName: '',
          HypoME_Model: '',
          HypoME_Supplier: '',
          HypoME_MachineType: '',
          HypoME_MachinePurpose: '',
          HypoME_Imported: '',
          HypoME_SerialNumber: '',
          HypoME_Quantity: '',
          HypoME_PurchasePrice: '',
          HypoME_Value: '',
          HypoME_MarketValue: '',
          HypoME_PurchaseDate: '',
          HypoME_CollateralLocation: '',
          HypoME_Source: '',
          HypoME_PastHypoME: '',
          HypoVeh_VehicleType: '',
          HypoVeh_Manufacturer: '',
          HypoVeh_AssetModel: '',
          HypoVeh_AssetMake: '',
          HypoVeh_VehicleValue: '',
          HypoVeh_MarketValue: '',
          HypoVeh_PurchasePrice: '',
          HypoVeh_CollateralLocation: '',
          HypoVeh_Source: '',
          HypoVeh_PastHypoVeh: '',
          HypoFFI_PurchasePrice: '',
          HypoFFI_PurchaseDate: '',
          HypoFFI_MarketValue: '',
          HypoFFI_CollateralLocation: '',
          HypoFFI_Source: '',
          HypoFFI_PastHypothecation: '',
          Pledge_MarketValue: '',
          Pledge_PurchasePrice: '',
          Pledge_PurchasedOn: '',
          Pledge_Source: '',
          Pledge_PastPledge: '',
        },
        'Income and Expense Details': {
          OccupationType: '',
          OtherIncome: '',
          TotalApplicantIncome: '',
          VerificationSource: '',
          OthersSpecify: '',
          BorrowerExistingHousehold: '',
          HouseholdHeadName: '',
          Rent: '',
          Food: '',
          'Water/Electricity': '',
          Education: '',
          Clothing: '',
          HealthCare: '',
          Transportation: '',
          Telephone: '',
          Other: '',
          FixedObligations: '',
          HouseholdDebtPayment: '',
          TotalExpenses: '',
          BankName: '',
          EstimatedEMI: '',
          LoanType: '',
          OutstandingBalance: '',
          BusinessEvaluationApproach: '',
          MonthStart: '',
          TotalDeposit: '',
          MonthEndBalance: '',
          InwardBounces: '',
          OutwardBounces: '',
          TotalBounces: '',
          MultiplierNeededBankHistory: '',
          MultiplierValueBankHistory: '',
          GSTFilingApproach: '',
          MultiplierNeededGST: '',
          MultiplierValueGST: '',
          SalesMonth1: '',
          SalesMonth2: '',
          SalesMonth3: '',
          SalesMonth4: '',
          SalesMonth5: '',
          SalesMonth6: '',
          SalesQuarter1: '',
          SalesQuarter2: '',
          YearlySales: '',
          MonthlyITRSales: '',
          MultiplierNeededITR: '',
          MultiplierValueITR: '',
          ITRSalesYear1: '',
          ITRSalesYear2: '',
        },
      }
      var cardView = []
      for (let parentKey in totalInformations) {
        let collectCardData = { accountName: '', fields: [] }
        collectCardData.accountName = parentKey
        collectCardData.fields = []
        //append actual data to totalInformation
        for (let childKey in totalInformations[parentKey]) {
          totalInformations[parentKey][childKey] = processVariables[childKey]
            ? processVariables[childKey].value
            : ''
          if (!validate.isEmpty(totalInformations[parentKey][childKey])) {
            collectCardData.fields.push({
              fieldKey: childKey,
              fieldValue: totalInformations[parentKey][childKey],
            })
          }
        }
        cardView.push(collectCardData)
      }
      this.setState({ guaCollatralCardView: cardView })
    } catch (error) {
      throw error
    }
  }
  handleCAMgeneration = () => {
    let authToken =
      this.props.taskInfo &&
      this.props.taskInfo.info &&
      this.props.taskInfo.info.authToken
        ? this.props.taskInfo.info.authToken
        : null
    axios({
      url: `${Config.apiUrl}/v1/camReport`,
      method: 'POST',
      headers: { Authorization: authToken },
      responseType: 'arraybuffer',
      data: this.mapCAMvalues(),
    })
      .then((response) => {
        let pdfData = response.data
        //convert arrayBuffer to blob
        var blob = new Blob([pdfData], { type: 'application/pdf' })
        //convert the blob object to URL
        let pdfFile = window.URL.createObjectURL(blob)
        window.open(pdfFile)
      })
      .catch((error) => {
        console.log(error)
      })
  }
  mapCAMvalues() {
    var processVariables = this.props.formValues
    var data = {
      BranchName: '',
      LoanPurpose: '',
      LoanAmount: '',
      BorrowerName: '',
      Age: '',
      ExpectedLoanTenure: '',
      OccupationType: '',
      Citizenship: '',
      Mortgage_SurveyNumber: '',
      Mortgage_Area: '',
      Mortgage_Taluk: '',
      Mortgage_OwnerName: '',
      Monthlyincome: '',
      CreditVintage: '',
      NetworthTotalLoans: '',
      TotalLoans: '',
      ExperienceinCurrentEmployment: '',
      ApplicantBureauScore: '',
      MainSourceofincome: '',
      ResidenceType: '',
      ResidentialStatus: '',
      TypeofJob: '',
      BusinessType: '',
      JobType: '',
      finalCreditScore: '',
      creditOfficerName: '',
      creditManager: '',
      ESAFCustomer: '',
      OfficerName: '',
      Geolocation: '',
      ApplicationDate: '',
      CIBILscore: '',
      CoApplicant_1: {
        c1FirstName: '',
        c1Age: '',
        c1fatherName: '',
        c1AadhaarNo: '',
        c1VoterID: '',
        c1PermanentAddress: '',
        c1CurrentAddress: '',
        c1BusinessType: '',
        c1JobType: '',
        c1mobileNumber: '',
        c1relationWithApplicant: '',
        c1MonthlyGrossSalary: '',
        c1businessMonthlyGrossSalary: '',
        c1GrossMonthlyIncome: '',
        c1MainSourceofincome: '',
        c1subSector: '',
        c1NetworthTotalLoans: '',
        c1TotalLoans: '',
        c1CurrentJobExperience: '',
        c1CurrentBusinessExperience: '',
        c1ExperienceCurrentJob: '',
        c1CreditVintage: '',
        c1CIBILScore: '',
        'c1Co-ApplicantBureauScore': '',
      },
      CoApplicant_2: {
        c2FirstName: '',
        c2relationWithApplicant: '',
        c2BusinessType: '',
        c2JobType: '',
        c2MonthlyGrossSalary: '',
        c2businessMonthlyGrossSalary: '',
        c2GrossMonthlyIncome: '',
        c2CreditVintage: '',
        c2CIBILScore: '',
        'c2Co-ApplicantBureauScore': '',
      },
      CoApplicant_3: {
        c3FirstName: '',
        c3relationWithApplicant: '',
        c3BusinessType: '',
        c3JobType: '',
        c3MonthlyGrossSalary: '',
        c3businessMonthlyGrossSalary: '',
        c3GrossMonthlyIncome: '',
        c3CreditVintage: '',
        c3CIBILScore: '',
        'c3Co-ApplicantBureauScore': '',
      },
      CoApplicant_4: {
        c4FirstName: '',
        c4relationWithApplicant: '',
        c4BusinessType: '',
        c4JobType: '',
        c4MonthlyGrossSalary: '',
        c4businessMonthlyGrossSalary: '',
        c4GrossMonthlyIncome: '',
        c4CreditVintage: '',
        c4CIBILScore: '',
        'c4Co-ApplicantBureauScore': '',
      },
      Guarantor_1: {
        g1FirstName: '',
        g1relationWithApplicant: '',
        g1MonthlyGrossSalary: '',
        g1businessMonthlyGrossSalary: '',
        g1GrossMonthlyIncome: '',
        g1TotalMonthlySurplus: '',
      },
      Guarantor_2: {
        g2FirstName: '',
        g2relationWithApplicant: '',
        g2MonthlyGrossSalary: '',
        g2businessMonthlyGrossSalary: '',
        g2GrossMonthlyIncome: '',
        g2TotalMonthlySurplus: '',
      },
    }
    let finalData = {}
    for (let parentKey in data) {
      if (Object.keys(data[parentKey]).length > 0) {
        for (let childKey in data[parentKey]) {
          data[parentKey][childKey] = processVariables[childKey] || ''
          if (data[parentKey][childKey]) {
            finalData[parentKey] = {
              ...finalData[parentKey],
              [childKey]: data[parentKey][childKey]['value'],
            }
          }
        }
      } else {
        data[parentKey] = processVariables[parentKey]
        finalData = {
          ...finalData,
          [parentKey]: data[parentKey] ? data[parentKey]['value'] : '',
        }
      }
    }
    return finalData
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
              sectionLabel="Applicant Collateral Information"
              sectionKey="ApplicantCollateralInformation"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
            />
            <div className="form-section-content">
              <div className="flex-row">
                <div className="form-group  add-del-button">
                  <Button
                    className="api-button"
                    type="danger"
                    size="default"
                    onClick={this.mapCardSections}
                  >
                    View Details
                  </Button>
                </div>
                <div className="form-group col-xs-12 col-md-12">
                  {!validate.isEmpty(this.state.cardView) && (
                    <AccountDetailsView accountDetails={this.state.cardView} />
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* <div className="form-section">
            <FormHeadSection
              sectionLabel="Co-Applicant Collateral Information"
              sectionKey="coApplicantCollateralInformation"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
            />
            <div className="form-section-content">
              <div className="flex-row">
                <div className="form-group  add-del-button">
                  <Button
                    className="api-button"
                    type="danger"
                    size="default"
                    onClick={this.mapcoAppCollateralCardSections}
                  >
                    View Details
                  </Button>
                </div>
                <div className="form-group col-xs-12 col-md-12">
                  {!validate.isEmpty(this.state.coAppCollateralCardView) && (
                    <AccountDetailsView
                      accountDetails={this.state.coAppCollateralCardView}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="form-section">
            <FormHeadSection
              sectionLabel="Guarantor Collateral Information"
              sectionKey="guarantorCollateralInformation"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
            />
            <div className="form-section-content">
              <div className="flex-row">
                <div className="form-group  add-del-button">
                  <Button
                    className="api-button"
                    type="danger"
                    size="default"
                    onClick={this.mapGuaCollateralCardSections}
                  >
                    View Details
                  </Button>
                </div>
                <div className="form-group col-xs-12 col-md-12">
                  {!validate.isEmpty(this.state.guaCollatralCardView) && (
                    <AccountDetailsView
                      accountDetails={this.state.guaCollatralCardView}
                    />
                  )}
                </div>
              </div>
            </div>
          </div> */}
          {/* <div className="form-section">
            <FormHeadSection
              sectionLabel="File Uploader Testing"
              sectionKey="collateralUploader"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
            /> */}
          {/** File Uploader */}
          {/* <Field
              label="Uploader Helper"
              name={this.state.UploaderEsafSample.fieldName}
              component={Uploader}
              multiple={true}
              initialUploadLoader={
                this.state.UploaderEsafSample.initialUploadLoader
              }
              accept=".jpg,.jpeg,.pdf,.png,.docx,.xlsx"
              uploaderConfig={this.state.UploaderEsafSample} */}
          {/* // validate={[ */}
          {/* //   uploadChecker(this.state.UploaderEsafSample)
            //   // A8V.required({ errorMsg: "required" })
            // ]}
            // /> */}
          {/* // </div> */}
          <div className="form-section">
            <FormHeadSection
              sectionLabel="CAM Report"
              sectionKey="CAMReport"
              formSyncError={this.props.formSyncError}
              sectionValidator={this.state.sectionValidator}
            />
            <div className="form-section-content">
              <div className="flex-row">
                <div className="form-group add-del-button">
                  <Button
                    className="api-button"
                    type="danger"
                    size="default"
                    onClick={this.handleCAMgeneration}
                  >
                    View CAM Report
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
const mapStateToProps = (state, props) => {
  return {
    //get current form values
    formValues: getFormValues('finalApproval')(state),
    //get current form sync errors
    formSyncError: getFormSyncErrors('finalApproval')(state),
    //taskInfo
    task: state.task,
  }
}
export default connect(mapStateToProps, {})(TabCollateralInformation)
