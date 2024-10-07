import React from 'react';

import ImageViewer from './components/ImageEditor/ImageViewer'; import { HisCommonUtil } from 'klago-ui-hospital-common'; import { OBTPageContainer } from 'luna-orbit';

export default class MEDA0050 extends React.PureComponent { get pageContainer() { return OBTPageContainer.getTypedPageContainer(this.props.pageContainer); }

hisUtil = new HisCommonUtil(this); defaultImgUrl = 'https://img.lovepik.com/bg/20240209/The-Background-of-an-Anatomy-of-the-Human-Body_3366559_wh860.jpg!/fw/860';

state = { imgUrl: null, imgBlob: null, };

async componentDidMount() { window.a = this; const img = await fetch(this.defaultImgUrl); const blob = await img.blob(); console.debug('blob:', blob); this.setState({ imgUrl: img.url, imgBlob: blob, }); }

handleGetPatientInfos = async () => { const result = await this.hisUtil.callApi(`/hospital/meda0050/0ho01001`, { img: this.state.imgBlob, });

    console.debug('result:', result);

    // console.debug('result:', result);

};

render() { return ( <> <button onClick={this.handleGetPatientInfos}>환자정보가져오기</button> <ImageViewer imgUrl={this.state.imgUrl} /> </> ); } }
