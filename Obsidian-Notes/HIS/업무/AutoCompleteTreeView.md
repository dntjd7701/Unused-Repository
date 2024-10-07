```js
import React from 'react';  
import PropTypes from 'prop-types';  
  
import searchIcoNormal from 'klago-pub-www/src/www/imgs/ico/ic_search_m_normal.png';  
import searchIcoOver from 'klago-pub-www/src/www/imgs/ico/ic_search_m_over.png';  
import editIcon from 'klago-pub-www/src/www/imgs/ico/icon_edit.png';  
import deleteIcon from 'klago-pub-www/src/www/imgs/ico/icon_delete.png';  
import menu from 'klago-pub-www/src/www/imgs/tree/ic_file_menu.png';  
import folderClose from 'klago-pub-www/src/www/images/tree/icon-tree-team-close-normal.png';  
import folderOpen from 'klago-pub-www/src/www/images/tree/icon-tree-team-open-normal.png';  
  
import {  
  ConfirmMessageEnum,  
  OBTAlert,  
  OBTButton,  
  OBTComplete2,  
  OBTConfirm,  
  OBTDialog2,  
  OBTDockPanel,  
  OBTDropDownList2,  
  OBTFormPanel,  
  OBTPageContainer,  
  OBTRadioButton,  
  OBTRadioButtonGroup,  
  OBTSplitButton,  
  OBTTextField,  
  OBTTitle,  
  OBTTooltip,  
  OBTTreeView,  
} from 'luna-orbit';  
import HisMessage from '../../util/HisMessage';  
import styles from './autoCompleteTreeView.module.scss';  
import './autoCompleteTreeView.scss';  
import TreeDialog from '../Dialog/TreeDialog';  
import { HisCommonUtil } from '../../index';  
  
/**  
 * @typedef {object} Tree  
 * @property {string} parentKey  
 * @property {string} parentKeyFieldNm  
 * @property {string} key  
 * @property {string} keyFieldNm  
 * @property {string} labelText  
 * @property {string} labelTextFieldNm  
 * @property {tree[]} children  
 * @property {number} sortSq  
 * @property {string} sortSqFieldNm  
 * @property {string} path  
 * @property {string} pathKey  
 */  
  
/**  
 * @typedef {object} AddTreeDialogOption  
 * @property {string} title - 항목 추가 다이얼로그 > 코드 입력을 받을것인지 여부  
 * @property {string} defaultTreeDvcd - 항목 추가 다이얼로그 > 폴더, 항목 기본 선택자. Y:폴더, N:항목  
 * @property {boolean} usingCodeTextField - 코드 입력을 받을 것인지 여부  
 * @property {number} maxLengthCodeTextField - 항목 추가 다이얼로그 > 코드 max  
 * @property {number} maxLengthNameTextField - 항목 추가 다이얼로그 > 텍스트 max  
 * @property { ({ item: object, parentItem: object, flatList: object[], isFolder: boolean }) => Promise<void> } onConfirmValidate - 항목 추가 다이얼로그 > 확인 선택 시 검증을 위한 callback  
 * @property { ({ item: object, parentItem: object, flatList: object[], isFolder: boolean }, addTree:(Tree) => void) => void } onConfirmAddItem - 항목 추가 다이얼로그 > 확인 선택 시 callback  
 */  
/**  
 * backend 해당 서비스와 연계 - treeService.getConvertedTrees();  
 * @see MEDL0010, MEDL0020  
 * * @TODO 일반 사용자의 경우 내가 등록한 건만 수정/삭제 가능하도록  
 * @TODO '항목'일 경우, 하위품목 추가 방지  
 * @TODO MAX_DEPTHS 체크 로직 개선  
 * @TODO 시설, 층 분할  
 * @TODO 편집 취소 버튼 추가  
 */  
export default class AutoCompleteTreeView extends React.PureComponent {  
  static displayType = {  
    default: 'default',  
    code: 'code',  
    name: 'name',  
  };  
  
  get pageContainer() {  
    return OBTPageContainer.getTypedPageContainer(  
      this.props.pageContainer  
        ? this.props.pageContainer  
        : this.props.hisUtil.pageContainer  
    );  
  }  
  
  /**  
   * defaultProps는 Object일 경우 처리가 안되기에, 새로 만들어주도록 한다.  
   * @return {AddTreeDialogOption}  
   */  
  get addTreeDialogOption() {  
    const _props = this.props.addTreeDialogOption;  
    return {  
      title: _props?.title ? `${_props.title}` : '항목',  
      defaultTreeDvcd: _props?.defaultTreeDvcd || 'Y',  
      usingCodeTextField: !!_props?.usingCodeTextField,  
      maxLengthCodeTextField: _props?.maxLengthCodeTextField || 10,  
      maxLengthNameTextField: _props?.maxLengthNameTextField || 20,  
      onConfirmValidate: _props?.onConfirmValidate || (async () => {}),  
      onConfirmAddItem: _props?.onConfirmAddItem || (() => {}),  
    };  
  }  
  
  hisUtil = this.props.hisUtil ? this.props.hisUtil : new HisCommonUtil(this);  
  
  // 항목추가 다이얼로그  
  initAddTreeDialogState = JSON.stringify({  
    open: false,  
    radioButtonValue: this.addTreeDialogOption.defaultTreeDvcd,  
    dropDownValue: '',  
    codeTextField: '',  
    nameTextField: '',  
  });  
  
  //현재 sort를 변경하고 있던 키를 기억해야만 dragEnd때 값을 알수있어서 변수를 둠.  
  lastChangeSortedTrees = [];  
  
  state = {  
    // OBTComplete  
    isCompleteFocus: false,  
    searchValue: [],  
    dataInfo: {},  
  
    //OBTTreeView  
    list: [], // 트리 구조 전체 데이터  
    flatList: [], // 1deps 트리 데이터  
    folderList: [], // 폴더 데이터 배열  
    selectedItem: {},  
    editLabelText: false,  
    checkBox: false,  
    checkBoxOption: OBTTreeView.CheckBoxOption.default,  
  
    addTreeDialog: {  
      ...JSON.parse(this.initAddTreeDialogState),  
    },  
  };  
  
  myRefs = {  
    tree: React.createRef(),  
  };  
  
  // Functions ==================================================================================================================ㅍ  
  func = {  
    getMainButtons: () => {  
      return [  
        {  
          key: 'func',  
          labelText: '기능모음',  
        },  
        {  
          key: 'addTreeDialog',  
          labelText: `${this.addTreeDialogOption.title}추가`,  
          onClick: this.handleAddTreeDialog.onOpen,  
        },  
        {  
          key: 'edit',  
          labelText: '편집',  
          onClick: async () => {  
            if (this.state.list.length === 0) {  
              this.pageContainer.snackbar({  
                type: OBTAlert.Type.warning,  
                labelText: '편집할 데이터가 존재하지 않습니다.',  
              });  
              return;  
            }  
  
            if (  
              this.props.hisUtil  
                ? await this.hisUtil.hasDirty()  
                : await this.props.hasDirty()  
            ) {  
              this.pageContainer.alert({  
                type: OBTAlert.Type.warning,  
                labelText: (  
                  <span>  
                    저장되지 않은 데이터가 존재합니다.  
                    <br />  
                    저장 후 실행해주세요  
                  </span>  
                ),  
              });  
              return;  
            }  
  
            this.setState(  
              (prevState) => {  
                return {  
                  checkBox: !prevState.checkBox,  
                };  
              },  
              () => {  
                this.pageContainer.hideDrawer();  
                this.props.onEditButtonClick({  
                  editable: this.state.checkBox,  
                });  
              }  
            );  
          },  
        },  
      ];  
    },  
    /**  
     * displayType 속성값에 따른 labelText 반환  
     * @param {Tree} tree  
     * @return {string}  
     */  
    getLabelTextByDisplayType: (tree) => {  
      const _displayType = this.props.displayType;  
      const { key, labelText } = tree;  
  
      if (_displayType === AutoCompleteTreeView.displayType.name) {  
        return labelText;  
      } else if (_displayType === AutoCompleteTreeView.displayType.code) {  
        return key;  
      }  
  
      return `[${  
        this.props.keyFieldNm ? tree[this.props.keyFieldNm] : key  
      }]  ${labelText}`;  
    },  
    /**  
     * @param {string} str  
     * @return {boolean}  
     */  
    hasSpecialCharacters(str) {  
      var reg = /[{}[\]/?.,;:|)*~`!^\-_+<>@#$%&\\=('"]/gi;  
      return reg.test(str);  
    },  
    /**  
     * @param {Tree[]} list - tree list  
     * @return {Promise<void>}  
     */  
    setTreeViewList: async (list = []) => {  
      try {  
        const flatList = [];  
        const dfs = (tree) => {  
          const resultTree = this.func.setTree(tree);  
          flatList.push(resultTree);  
  
          resultTree.children = [];  
          // 자식 배열 순회  
          if (Array.isArray(tree.children)) {  
            for (let child of tree.children) {  
              const childTree = dfs(child);  
              resultTree.children.push(childTree);  
            }  
          }  
          return resultTree;  
        };  
  
        const displayTreeViews = list.map((tree) => dfs(tree));  
        const folderList = flatList.filter(this.props.isFolder).map((v) => {  
          const obj = { ...v };  
          if (!!obj?.imageUrl) {  
            delete obj?.imageUrl;  
          }  
          return obj;  
        });  
  
        const _selectedItem = displayTreeViews?.[0] || {};  
        this.setState(  
          {  
            list: displayTreeViews,  
            flatList,  
            folderList,  
            dataInfo: this.props.keyFieldNm  
              ? {  
                  itemInfo: [  
                    {  
                      key: this.props.keyFieldNm,  
                      codeProperty: true,  
                    },  
                    {  
                      key: _selectedItem?.labelTextFieldNm,  
                      codeProperty: true,  
                    },  
                    {  
                      key: _selectedItem?.keyFieldNm,  
                    },  
                    {  
                      key: 'keyFieldNm',  
                    },  
                  ],  
                  columnWidths: [20, 70, 0, 0],  
                }  
              : {  
                  itemInfo: [  
                    {  
                      key: _selectedItem?.keyFieldNm,  
                      codeProperty: true,  
                    },  
                    {  
                      key: _selectedItem?.labelTextFieldNm,  
                      codeProperty: true,  
                    },  
                  ],  
                  columnWidths: [20, 70],  
                },  
          },  
          () => {  
            if (this.props.expand) {  
              this.myRefs.tree.current.expand();  
            }  
          }  
        );  
      } catch (error) {  
        HisMessage.showErrorMessage(this.pageContainer, error);  
      }  
    },  
    /**  
     * @param {Tree[]} tree  
     * @return {Tree[]} 새로운 tree 배열  
     */  
    uncheckAll: (tree = this.state.list) => {  
      const dfs = (node) => {  
        // 현재 노드에 checked 속성 추가  
        const _node = {  
          ...node,  
          checked: false,  
        };  
  
        // 만약 children이 존재하면, 재귀적으로 children에도 동일한 작업 수행  
        if (Array.isArray(_node.children)) {  
          _node.children = _node.children.map((child) => dfs(child));  
        }  
  
        return _node;  
      };  
      this.pageContainer.hideDrawer();  
      this.func.setTreeViewList(tree.map((node) => dfs(node)));  
    },  
    /**  
     * tree 데이터 반환  
     * @param {Tree} tree  
     * @return {Tree}  
     */  
    setTree: (tree) => {  
      let folderImage = {  
        imageUrl: {  
          normal: { open: folderOpen, close: folderClose },  
        },  
      };  
  
      if (  
        typeof this.props?.isFolder === 'function' &&  
        !this.props.isFolder(tree)  
      ) {  
        folderImage = {  
          imageUrl: menu,  
        };  
      }  
  
      if (this.props.type !== OBTTreeView.Type.default) {  
        folderImage = {};  
      }  
  
      return {  
        ...tree,  
        ...folderImage,  
        labelText: this.func.getLabelTextByDisplayType(tree),  
        editorValue: this.func.getLabelTextByDisplayType(tree), // 수정 시, default로 들어갈 데이터가 된다.  
        // disabled: this.props.isReadOnlyTree(tree),      };  
    },  
    /**  
     * @param {Tree} tree  
     * @return {Promise<void>}  
     */  
    updateTree: async (tree) => {  
      const dfs = (node) => {  
        const _node = {  
          ...node,  
          ...(node.key === tree.key ? tree : {}),  
        };  
  
        // 만약 children이 존재하면, 재귀적으로 children에도 동일한 작업 수행  
        if (Array.isArray(_node.children)) {  
          _node.children = _node.children.map((child) => dfs(child));  
        }  
  
        return _node;  
      };  
  
      const newList = this.state.list.map((node) => {  
        return dfs(node);  
      });  
  
      this.func.setTreeViewList(newList);  
      setTimeout(() => {  
        this.handleTreeView.onAfterSelectChange({ item: tree });  
      }, 0);  
    },  
    /**  
     * @param {Tree} tree  
     * @return {Promise<void>}  
     */  
    addTree: async (tree) => {  
      const dfs = (node) => {  
        // 만약 children이 존재하면, 재귀적으로 children에도 동일한 작업 수행  
        if (Array.isArray(node.children)) {  
          node.children = node.children.map((child) => dfs(child));  
          if (node.key === tree.parentKey) {  
            node.children = [...node.children, { ...tree }];  
          }  
        }  
        return node;  
      };  
  
      const newList = this.state.list.map((node) => {  
        return dfs(node);  
      });  
  
      this.func.setTreeViewList(newList);  
      setTimeout(() => {  
        this.handleTreeView.onAfterSelectChange({ item: tree });  
      }, 0);  
    },  
    /**  
     * tree object를 기준으로 모든 자식들을 하나의 배열로 반환한다.  
     * @param {Tree} tree  
     * @return {Tree[]}  
     */  
    getAllTreesByParentTree: (tree) => {  
      try {  
        const hasChild = (obj) =>  
          Array.isArray(obj?.children) && obj.children.length > 0;  
  
        const trees = [];  
  
        const dfs = (node) => {  
          trees.push(node);  
          if (hasChild(node)) {  
            node.children.forEach((child) => {  
              dfs(child); // 자식 노드로 재귀 호출하여 올바르게 순회함  
            });  
          }  
        };  
  
        // 루트 노드에서 DFS 시작  
        dfs(tree);  
  
        return trees;  
      } catch (e) {  
        HisMessage.showErrorMessage(this.pageContainer, e);  
      }  
    },  
  };  
  // Functions ==================================================================================================================ㅍ  
  
  // 항목 추가 다이얼로그 핸들러 ==================================================================================================================ㅍ  
  handleAddTreeDialog = {  
    onChange: (e) => {  
      this.setState({  
        addTreeDialog: {  
          ...this.state.addTreeDialog,  
          [e.target.props.id]: e.value,  
        },  
      });  
    },  
    onClose: () => {  
      this.setState({  
        addTreeDialog: {  
          ...JSON.parse(this.initAddTreeDialogState),  
        },  
      });  
    },  
    onOpen: () => {  
      if (!this.state.selectedItem?.key) return;  
  
      const selectedItem = this.state.folderList.find(  
        (v) => this.state.selectedItem.parentKey === v.key  
      );  
  
      const dropDownValue =  
        [this.state.selectedItem].findIndex(this.props.isFolder) === -1  
          ? selectedItem.key  
          : this.state.selectedItem[this.state.selectedItem.keyFieldNm];  
  
      this.setState({  
        addTreeDialog: {  
          ...this.state.addTreeDialog,  
          open: true,  
          dropDownValue,  
        },  
        selectedItem:  
          [this.state.selectedItem].findIndex(this.props.isFolder) === -1  
            ? selectedItem  
            : this.state.selectedItem,  
      });  
    },  
    onConfirm: async () => {  
      try {  
        const { selectedItem, flatList } = this.state;  
        const { nameTextField, codeTextField, radioButtonValue } =  
          this.state.addTreeDialog;  
        const { keyFieldNm, labelTextFieldNm, parentKeyFieldNm } = selectedItem;  
  
        const callbackParam = {  
          item: {  
            ...selectedItem,  
            key: codeTextField,  
            labelText: nameTextField,  
            parentKey: selectedItem.key,  
            path: selectedItem.path + ' > ' + nameTextField,  
            [keyFieldNm]: codeTextField,  
            [labelTextFieldNm]: nameTextField,  
            [parentKeyFieldNm]: selectedItem.key,  
            children: [],  
          },  
          parentItem: selectedItem,  
          flatList,  
          isFolder: radioButtonValue === 'Y',  
        };  
  
        // codeField 여부 체크  
        if (this.addTreeDialogOption.usingCodeTextField && !codeTextField) {  
          this.pageContainer.alert({  
            type: OBTAlert.Type.warning,  
            labelText: `${this.addTreeDialogOption.title}코드를 입력해주세요.`,  
          });  
          return;  
        }  
  
        // textField 여부 체크  
        if (!nameTextField) {  
          this.pageContainer.alert({  
            type: OBTAlert.Type.warning,  
            labelText: `${this.addTreeDialogOption.title}명을 입력해주세요.`,  
          });  
          return;  
        }  
  
        // 사용자별 Valiate 처리  
        const labelText =  
          await this.addTreeDialogOption.onConfirmValidate(callbackParam);  
        if (!!labelText) {  
          this.pageContainer.alert({  
            type: OBTAlert.Type.warning,  
            labelText,  
          });  
          return;  
        }  
  
        const selectedItemDepths = selectedItem.path.split('>').length + 1;  
        const maxDepths = this.props?.maxDepths;  
        const allowDepths =  
          radioButtonValue === 'Y' &&  
          this.props.type !== OBTTreeView.Type.directory  
            ? maxDepths - 1  
            : maxDepths;  
  
        //  하위 여부 체크  
        if (maxDepths && selectedItemDepths > allowDepths) {  
          this.pageContainer.alert({  
            type: OBTAlert.Type.warning,  
            labelText: (  
              <span>  
                하위폴더 생성이 불가합니다. <br />({this.props.maxDepths}  
                DEPTH이상 폴더 생성불가)  
              </span>  
            ),  
          });  
          return;  
        }  
  
        await this.addTreeDialogOption.onConfirmAddItem(  
          callbackParam,  
          this.func.addTree  
        );  
        this.handleAddTreeDialog.onClose();  
      } catch (e) {  
        HisMessage.showErrorMessage(this.pageContainer, e);  
      }  
    },  
  };  
  // 항목 추가 다이얼로그 핸들러 ==================================================================================================================ㅍ  
  
  // 자동완성 컴포넌트 핸들러 ==================================================================================================================ㅍ  
  handleComplete = {  
    onChange: (e) => {  
      if (e.value.length === 0) return;  
  
      this.handleTreeView.onAfterSelectChange({  
        item: this.state.flatList.find((v) => {  
          if (!!this.props.keyFieldNm) {  
            return v[this.props.keyFieldNm] === e.value[this.props.keyFieldNm];  
          }  
          return v.key === e.value[this.state.selectedItem.keyFieldNm];  
        }),  
      });  
    },  
    /**  
     * @param {any} keyword  
     * @return {Promise<{}[]>}  
     */  
    onSearch: async (keyword) => {  
      const keywordStr = keyword.toString();  
      return this.state.flatList  
        .filter((v) => {  
          return (  
            (v?.[this.state.selectedItem?.keyFieldNm] || '').includes(  
              keywordStr  
            ) ||  
            (v?.[this.state.selectedItem?.labelTextFieldNm] || '').includes(  
              keywordStr  
            ) ||  
            (v?.[this.props.keyFieldNm] || '').includes(keywordStr)  
          );  
        })  
        .map((v) => {  
          const obj = {};  
          this.state.dataInfo.itemInfo.forEach((item) => {  
            if (item.key === 'keyFieldNm') {  
            }  
  
            obj[item.key] = v[item.key];  
          });  
          return obj;  
        });  
    },  
  };  
  // 자동완성 컴포넌트 핸들러 ==================================================================================================================ㅍ  
  
  // 트리뷰 핸들러 ==================================================================================================================ㅍ  
  handleTreeView = {  
    onDragEnd: () => {  
      if (typeof this.props.onDragEnd === 'function') {  
        this.props.onDragEnd(this.lastChangeSortedTrees);  
      }  
      this.lastChangeSortedTrees = [];  
    },  
    onCheckChanged: (e) => {  
      const checkedItems = e.target.getCheckedItems();  
  
      if (checkedItems.length > 0) {  
        this.pageContainer.showDrawer(  
          checkedItems.length,  
          {  
            key: 'del',  
            labelText: '삭제',  
            onClick: async () => {  
              await this.handleTreeView.onDelete({  
                isChecked: true,  
                deleteList: checkedItems,  
              });  
  
              this.setState({  
                checkBox: false,  
              });  
              this.pageContainer.hideDrawer();  
            },  
          },  
          {  
            key: 'copy',  
            labelText: '복사',  
            onClick: async () => {  
              this.pageContainer.showDialog((close) => (  
                <TreeDialog  
                  {...this.props}  
                  title={'복사'}  
                  treeViewList={this.state.list}  
                  onConfirm={(parentItem) => {  
                    const checkedItems =  
                      this.myRefs.tree.current.getCheckedItems();  
  
                    const isParentChecked = (tree) => {  
                      const parentKey = tree[tree.parentKeyFieldNm];  
                      const parentTree = OBTTreeView.getItem(  
                        this.myRefs.tree.current.state.list,  
                        parentKey  
                      );  
                      return parentTree?.checked === true;  
                    };  
  
                    const targetItems = checkedItems  
                      .filter((item) => isParentChecked(item) === false)  
                      .map((item) => {  
                        return {  
                          ...item,  
                          [item.parentKeyFieldNm]:  
                            parentItem[parentItem.keyFieldNm],  
                        };  
                      });  
  
                    if (typeof this.props.onCopy === 'function') {  
                      this.func.uncheckAll();  
                      this.props.onCopy({  
                        parentItem: parentItem,  
                        checkedItems: checkedItems,  
                        targetItems: targetItems,  
                      });  
                    }  
                    close();  
                  }}  
                  onCancel={() => {  
                    close();  
                  }}  
                  width="400px"  
                  height="800px"  
                />  
              ));  
            },  
          },  
          {  
            key: 'cancel',  
            labelText: '취소',  
            onClick: () => {  
              this.setState(  
                {  
                  checkBox: false,  
                },  
                () => {  
                  this.props.onEditButtonClick({  
                    editable: this.state.checkBox,  
                  });  
                }  
              );  
            },  
          }  
        );  
        return;  
      }  
      this.pageContainer.hideDrawer();  
    },  
    onEditSort: ({ changedItem, selectedItem }) => {  
      const sortSqFieldNm = selectedItem.sortSqFieldNm;  
      const keyFieldNm = selectedItem.keyFieldNm;  
      const swapSortSq = (changedItem, selectedItem) => {  
        // 변경된 행(changedItem)과 선택된 행(selectedItem)의 sortSq 값을 가져옴  
        const changedSortSq = changedItem[sortSqFieldNm];  
        const selectedSortSq = selectedItem[sortSqFieldNm];  
  
        // 두 객체의 sortSq 값을 교환  
        changedItem[sortSqFieldNm] = selectedSortSq;  
        selectedItem[sortSqFieldNm] = changedSortSq;  
      };  
      swapSortSq(changedItem, selectedItem);  
  
      const pushSortedTrees = (tree) => {  
        if (  
          !this.lastChangeSortedTrees.find(  
            (item) => item[keyFieldNm] === tree[keyFieldNm]  
          )  
        ) {  
          this.lastChangeSortedTrees.push(tree);  
        }  
      };  
  
      pushSortedTrees(changedItem);  
      pushSortedTrees(selectedItem);  
    },  
    onEditIconClick: async () => {  
      if (  
        !(await this.props.onEditValidate({ item: this.state.selectedItem }))  
      ) {  
        return;  
      }  
  
      this.setState({  
        editLabelText: true,  
      });  
    },  
    /**  
     * @param {{ isChecked: boolean, item: object, parentItem: object, deleted: object[] }} e  
     */  
    onDelete: async (e) => {  
      if (  
        !(await this.props.onEditValidate({ item: this.state.selectedItem }))  
      ) {  
        return;  
      }  
  
      let answer = false;  
      if (  
        this.state.selectedItem.children.length > 0 ||  
        (e?.deleteList || []).length > 0  
      ) {  
        answer = await new Promise((resolve) => {  
          this.pageContainer.confirm({  
            type: OBTConfirm.Type.warning,  
            labelText: (  
              <span>  
                하위데이터가 존재합니다. 삭제하시겠습니까? <br /> 삭제된 내용은  
                복구 불가합니다.  
              </span>  
            ),  
            onConfirm: () => resolve(true),  
            onCancel: () => resolve(false),  
          });  
        });  
      } else {  
        answer = await this.pageContainer.confirm(  
          ConfirmMessageEnum.deleteLine  
        );  
      }  
  
      if (answer) {  
        this.props.onDelete({  
          isChecked: e?.isChecked ?? false,  
          item: this.state.selectedItem,  
          parentItem: this.state.flatList.find(  
            (v) => this.state.selectedItem.parentKey === v.key  
          ),  
          deleted:  
            e?.deleteList ??  
            this.func.getAllTreesByParentTree(this.state.selectedItem),  
        });  
      }  
    },  
  
    /**  
     * @param {{target: object, item: object, labelText: string}} e  
     */  
    onEditLabelText: (e) => {  
      this.setState({  
        editLabelText: false,  
      });  
  
      this.props.onEdit(  
        {  
          item: {  
            ...e.item,  
            [e.item.labelTextFieldNm]: e.labelText,  
            labelText: e.labelText,  
          },  
          target: e.target,  
          labelText: e.labelText,  
          flatList: this.state.flatList,  
          parentItem: this.state.flatList.find(  
            (v) => e.item.parentKey === v.key  
          ),  
        },  
        this.func.updateTree  
      );  
    },  
    onEditLabelTextBlur: () => {  
      this.setState({  
        editLabelText: false,  
      });  
    },  
    onChangeLabelText: (e) => {  
      if (this.func.hasSpecialCharacters(e.value)) {  
        e.cancel = true;  
        e.tooltip = {  
          labelText: '특수문자는 입력할 수 없습니다.',  
          theme: OBTTooltip.Theme.required,  
        };  
      }  
  
      if (  
        e.value.length >= this.addTreeDialogOption.maxLengthNameTextField ||  
        e.value.length >= this.addTreeDialogOption.maxLengthCodeTextField  
      ) {  
        e.cancel = true;  
        e.tooltip = {  
          labelText: '최대 입력 수를 초과하였습니다.',  
          theme: OBTTooltip.Theme.required,  
        };  
      }  
    },  
    /**  
     * @param {{ key: string }} e  
     */  
    onClickMainButtons: (e) => {  
      const button = this.func  
        .getMainButtons()  
        .find(({ key }) => key === e.key);  
      if (typeof button?.onClick === 'function') {  
        button.onClick();  
      }  
    },  
    onBeforeSelectChange: async (e) => {  
      if (  
        this.props.hisUtil  
          ? await this.hisUtil.hasDirty()  
          : await this.props.hasDirty()  
      ) {  
        const result = await this.pageContainer.confirm(  
          ConfirmMessageEnum.clearDirty  
        );  
  
        if (!result) {  
          e.cancel = true;  
          return;  
        }  
        return;  
      }  
  
      await this.hisUtil.executionWithPromiseAndSync(  
        this.props?.onBeforeSelectChange,  
        e  
      );  
    },  
    onAfterSelectChange: async (e) => {  
      try {  
        await this.handleTreeView.onBeforeSelectChange(e);  
        if (e?.cancel === true) {  
          return;  
        }  
        this.setState(  
          {  
            searchValue: [],  
            selectedItem: e.item,  
            addTreeDialog: {  
              ...this.state.addTreeDialog,  
              dropDownValue: e.item[this.state.selectedItem.keyFieldNm],  
            },  
          },  
          () => {  
            this.props.onAfterSelectChange({  
              item: this.state.selectedItem,  
              flatList: this.state.flatList,  
            });  
          }  
        );  
      } catch (error) {  
        HisMessage.showErrorMessage(this.pageContainer, error);  
      }  
    },  
  };  
  // 트리뷰 핸들러 ==================================================================================================================ㅍ  
  
  componentDidMount() {  
    if (this.props.hisUtil) {  
      this.hisUtil.addPage(this, 'HAutoCompleteTreeView');  
    }  
  }  
  
  async componentDidUpdate(prevProps, prevState) {  
    try {  
      if (prevProps.list !== this.props.list) {  
        await this.func.setTreeViewList(this.props.list);  
        if (Object.keys(this.state.selectedItem).length !== 0) {  
          this.handleTreeView.onAfterSelectChange({  
            item:  
              this.state.flatList.find(  
                (v) => v.key === this.state.selectedItem.key  
              ) ||  
              this.state.list?.[0] ||  
              {},  
          });  
        } else {  
          this.handleTreeView.onAfterSelectChange({  
            item: this.state.list?.[0] || {},  
          });  
        }  
      }  
  
      if (prevState.checkBox !== this.state.checkBox && !this.state.checkBox) {  
        this.pageContainer.hideDrawer();  
        this.func.uncheckAll();  
      }  
  
      if (prevProps.editLabelText !== this.props.editLabelText) {  
        this.setState({  
          editLabelText: this.props.editLabelText,  
        });  
      }  
    } catch (error) {  
      HisMessage.showErrorMessage(this.pageContainer, error);  
    }  
  }  
  
  render() {  
    const TreeIcon = () => {  
      return this.props.editable && this.state.checkBox  
        ? [  
            <span  
              key="editLabelText"  
              style={{  
                marginLeft: '10px',  
                display: 'flex',  
              }}  
            >  
              <OBTTooltip labelText="수정">  
                <img  
                  src={editIcon}  
                  alt=""  
                  style={{  
                    width: '14px',  
                    height: '14px',  
                    cursor: 'pointer',  
                  }}  
                  onClick={this.handleTreeView.onEditIconClick}  
                />  
              </OBTTooltip>  
            </span>,  
            <span  
              key="editDelete"  
              style={{ marginLeft: '4px', display: 'flex' }}  
            >  
              <OBTTooltip labelText="삭제">  
                <img  
                  src={deleteIcon}  
                  alt=""  
                  style={{ cursor: 'pointer' }}  
                  onClick={this.handleTreeView.onDelete}  
                />  
              </OBTTooltip>  
            </span>,  
          ]  
        : [];  
    };  
  
    const TreeComplete = () => {  
      return (  
        <div className={styles.search_template}>  
          <div className={styles.search_input_wrapper}>  
            <OBTComplete2  
              placeHolder={this.props.placeHolder || '코드 + 명으로 검색하세요'}  
              onFocus={() => this.setState({ isCompleteFocus: true })}  
              onBlur={() => this.setState({ isCompleteFocus: false })}  
              dataInfo={this.state.dataInfo}  
              value={this.state.searchValue}  
              onSearch={this.handleComplete.onSearch}  
              onChange={this.handleComplete.onChange}  
            />  
            {this.state.isCompleteFocus ? (  
              <img className={styles.search_ico} src={searchIcoOver} />  
            ) : (  
              <img className={styles.search_ico} src={searchIcoNormal} />  
            )}  
          </div>  
        </div>  
      );  
    };  
  
    const TreeView = () => {  
      return (  
        <OBTTreeView  
          ref={this.myRefs.tree}  
          width="100%"  
          height="99%"  
          childCount={this.props.childCount}  
          checkBox={this.state.checkBox && this.props.checkable}  
          checkBoxOption={this.state.checkBoxOption}  
          useOverflowTooltip  
          type={this.props.type}  
          list={this.state.list}  
          selectedItem={this.state.selectedItem?.key}  
          images={TreeIcon()}  
          editLabelText={this.state.editLabelText}  
          editLabelTextRequired={true}  
          editLabelTextTooltip={{  
            labelText: '입력해 주세요',  
          }}  
          onAfterSelectChange={this.handleTreeView.onAfterSelectChange}  
          onEditLabelText={this.handleTreeView.onEditLabelText}  
          onChangeLabelText={this.handleTreeView.onChangeLabelText}  
          onEditLabelTextBlur={this.handleTreeView.onEditLabelTextBlur}  
          onCheckChanged={this.handleTreeView.onCheckChanged}  
          editSort={this.props.editSort || false}  
          onEditSort={this.handleTreeView.onEditSort}  
          onDragEnd={this.handleTreeView.onDragEnd}  
        />  
      );  
    };  
  
    const TreeAddTreeDialog = () => {  
      return (  
        <OBTDialog2  
          open  
          id={'addTreeDialog'}  
          title={`${this.addTreeDialogOption.title}추가`}  
          type={OBTDialog2.Type.small}  
          height={  
            this.addTreeDialogOption.usingCodeTextField ? '300px' : '260px'  
          }  
          buttons={OBTDialog2.Buttons.ConfirmAndCancel(  
            this.handleAddTreeDialog.onConfirm,  
            this.handleAddTreeDialog.onClose  
          )}  
        >  
          <OBTFormPanel width="100%" disabled={false}>  
            <colgroup>  
              <col width={'30%'} />  
              <col />            </colgroup>  
            <tbody>              <tr>  
                <th>구분</th>  
                {/* horizontal={true} 설정 입니다. */}  
                {/* onChange 이벤트 발생시 handleChange함수를 호출합니다. */}  
                <td>  
                  <OBTRadioButtonGroup  
                    id={'radioButtonValue'}  
                    value={  
                      this.props.type === OBTTreeView.Type.default  
                        ? this.state.addTreeDialog.radioButtonValue  
                        : 'Y'  
                    }  
                    disabled={this.props.type !== OBTTreeView.Type.default}  
                    onChange={this.handleAddTreeDialog.onChange}  
                  >  
                    <OBTRadioButton value={'Y'} labelText="폴더" />  
                    <OBTRadioButton value={'N'} labelText="항목" />  
                  </OBTRadioButtonGroup>  
                </td>  
              </tr>  
              <tr>                <th>  
                  <span>상위메뉴</span>  
                </th>  
                <td>                  <OBTDropDownList2  
                    value={this.state.addTreeDialog.dropDownValue}  
                    list={this.state.folderList}  
                    fieldName={{  
                      value: this.state.selectedItem.keyFieldNm,  
                      labelText: this.state.selectedItem.labelTextFieldNm,  
                    }}  
                    displayType={OBTDropDownList2.DisplayType.text}  
                    onChange={(e) => {  
                      this.handleTreeView.onAfterSelectChange({  
                        cancel: false,  
                        item: { ...(e.Source?.[0] || {}) },  
                      });  
                    }}  
                  />  
                </td>  
              </tr>  
              {this.addTreeDialogOption.usingCodeTextField && (  
                <tr>  
                  <th>  
                    <span>{this.addTreeDialogOption.title}코드</span>  
                  </th>  
                  <td>                    <OBTTextField  
                      id={'codeTextField'}  
                      value={this.state.addTreeDialog.codeTextField}  
                      required  
                      maxLength={  
                        this.addTreeDialogOption.maxLengthCodeTextField  
                      }  
                      placeHolder={`${this.addTreeDialogOption.title}코드를 입력해주세요.`}  
                      onChange={this.handleAddTreeDialog.onChange}  
                    />  
                  </td>  
                </tr>  
              )}  
              <tr>  
                <th>  
                  <span>{this.addTreeDialogOption.title}명</span>  
                </th>  
                <td>                  <OBTTextField  
                    id={'nameTextField'}  
                    value={this.state.addTreeDialog.nameTextField}  
                    required  
                    maxLength={this.addTreeDialogOption.maxLengthNameTextField}  
                    placeHolder={`${this.addTreeDialogOption.title}명을 입력해주세요.`}  
                    onChange={this.handleAddTreeDialog.onChange}  
                  />  
                </td>  
              </tr>  
            </tbody>  
          </OBTFormPanel>  
        </OBTDialog2>  
      );  
    };  
  
    return (  
      <OBTDockPanel  
        className={'HAutoCompleteTreeView'}  
        value={this.props?.editable ? { top: { size: '20px' } } : {}}  
      >  
        {this.props?.editable && (  
          <div  
            dock={OBTDockPanel.Dock.top}  
            style={{  
              display: 'flex',  
              justifyContent: 'flex-end',  
              alignItems: 'center',  
              width: '100%',  
            }}  
          >  
            <OBTTitle  
              labelText={this.props.title || ''}  
              useBullet={!!this.props.title}  
            >  
              {this.state.checkBox ? (  
                <OBTButton  
                  labelText={'편집취소'}  
                  onClick={() => {  
                    this.setState(  
                      {  
                        checkBox: false,  
                      },  
                      () => {  
                        this.props.onEditButtonClick({  
                          editable: this.state.checkBox,  
                        });  
                      }  
                    );  
                  }}  
                />  
              ) : (  
                <OBTSplitButton  
                  value={this.func.getMainButtons()}  
                  position={OBTSplitButton.Position.right}  
                  type={OBTSplitButton.Type.default}  
                  onClick={this.handleTreeView.onClickMainButtons}  
                />  
              )}  
            </OBTTitle>  
          </div>  
        )}  
        <OBTDockPanel value={{ top: { size: '45px' } }}>  
          <div dock={OBTDockPanel.Dock.top}>{TreeComplete()}</div>  
          <div>{TreeView()}</div>  
        </OBTDockPanel>  
  
        {/* 항목추가 다이얼로그 */}  
        {this.state.addTreeDialog.open && TreeAddTreeDialog()}  
      </OBTDockPanel>  
    );  
  }  
}  
  
AutoCompleteTreeView.defaultProps = {  
  /**  
   * title 영역  
   */  
  title: '',  
  /**  
   * @type {Tree[]}  
   */  
  list: [],  
  /**  
   * 화면 상에 자식 수 포함 여부  
   */  
  childCount: true,  
  /**  
   * OBTTreeView type   */  type: OBTTreeView.Type.default,  
  /**  
   * OBTTreeView displayType   */  displayType: AutoCompleteTreeView.displayType.default,  
  /**  
   * hisUtil addPage, hisUtil.pageContainer, hasDirty를 사용한다면 필요  
   */  
  hisUtil: undefined,  
  /**  
   * PageContainer   */  pageContainer: undefined,  
  /**  
   * 트리그리드 펼침 여부  
   */  
  expand: false,  
  /**  
   *  기존 키값 이외에 display, onSearch에 사용되는 필드 네임 지정  
   */  
  keyFieldNm: '',  
  /**  
   * 속성 부여 시 수정, 삭제 아이콘 생성  
   */  
  editable: false,  
  /**  
   * 체크 박스를 보여줄 지 여부  
   */  
  checkable: true,  
  /**  
   * 최대 추가 depths 지정  
   */  
  maxDepths: -1,  
  /**  
   * 항목 추가 다이얼로그 관련 option  
   * @type {AddTreeDialogOption}  
   */  
  addTreeDialogOption: {},  
  /**  
   * @return {Promise<boolean>}  
   */  
  hasDirty: async () => {  
    return false;  
  },  
  /**  
   * 트리 그리드 행 선택 변경 시 발생하는 이벤트 callback  
   * @param {{ item: Tree, flatList: Tree[] }} e  
   */  
  onAfterSelectChange: (e) => {},  
  /**  
   * 해당 트리의 폴더 여부를 반환  
   * true: 폴더  
   * false: 항목  
   * @param {Tree} tree  
   * @return {boolean}  
   */  
  isFolder: (tree) => {  
    return true;  
  },  
  /**  
   * 편집 버튼 클릭 시 발생하는 callback  
   */  onEditButtonClick: () => {},  
  /**  
   * 편집 시 검증을 위한 callback  
   * @param {{ item: object }} e  
   * @return {Promise<boolean>}  
   */  
  onEditValidate: async (e) => {  
    return true;  
  },  
  /**  
   * 수정 icon onClick callback  
   * @param {{ item: object, target: object, labelText: string, flatList: object[], parentItem: object }} e  
   * @param { (Tree) => void } updateTree - 트리 수정을 윈한 callback  
   */  onEdit: (e, updateTree) => {},  
  /**  
   * 삭제 icon onClick callback  
   * @param {{ isChecked: boolean, item: object, parentItem: object, deleted: object[] }} e  
   */  
  onDelete: (e) => {},  
};  
  
// 필수값 기입  
AutoCompleteTreeView.propTypes = {  
  // pageContainer: PropTypes.object.isRequired,  
  list: PropTypes.array.isRequired,  
  onAfterSelectChange: PropTypes.func.isRequired,  
};
```