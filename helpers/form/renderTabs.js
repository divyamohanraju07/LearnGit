export default class RenderTabs {
  constructor(currentTabInfo) {
    this.currentTabInfo = currentTabInfo;
    // this.a8FlowPointer = a8FlowPointer;
    return this;
  }

  appendTabs(newTabList) {
    this.currentTabInfo = {
      ...this.currentTabInfo,
      tabList: [...newTabList]
    };
    return this;
  }

  prependTabs(newTabList) {
    this.currentTabInfo = {
      ...this.currentTabInfo,
      tabList: [...newTabList, ...this.currentTabInfo.tabList]
    };
    return this;
  }

  setActiveTab(tabName) {
    this.currentTabInfo = {
      ...this.currentTabInfo,
      activeTab: tabName
    };
    return this;
  }

  renderTabs(taskId, a8FlowPointer) {
    if (a8FlowPointer) {
      a8FlowPointer.source.postMessage(
        {
          taskId,
          tabInfo: this.currentTabInfo,
          action: "update"
        },
        "*"
      );
    }
    return this;
  }

  deleteTabs(deleteTabList) {
    let updatedTabList = [];
    this.currentTabInfo.tabList.forEach(tab => {
      if (!deleteTabList.includes(tab.label)) {
        updatedTabList.push(tab);
      }
    });

    this.currentTabInfo = {
      ...this.currentTabInfo,
      tabList: updatedTabList
    };
    return this;
  }
}
