```jsx

import React, { Component } from 'react'; 
import PropTypes from 'prop-types'; 

export default class Basic extends Component { 

	static propTypes = { 
		name: PropTypes.string.isRequired, 
		birth: PropTypes.number.isRequired, 
		lang: PropTypes.string, 
	}; 
	
	static defaultProps = { lang: 'Javascript', }; 
	static contextTypes = { router: PropTypes.object.isRequired, }; 
	
	state = { hidden: false, }; 
	
	componentWillMount() { console.log('componentWillMount'); } 
	
	componentDidMount() { console.log('componentDidMount'); } 
	
	componentWillReceiveProps(nextProps) { 
		console.log('componentWillReceiveProps'); 
	} 
	
	shouldComponentUpdate(nextProps, nextState) { 
		console.log('shouldComponentUpdate'); return true / false; 	
	} 
	
	componentWillUpdate(nextProps, nextState) { 
		console.log('componentWillUpdate'); 	
	} 
	
	componentDidUpdate(prevProps, prevState) { 
		console.log('componentDidUpdate'); 
	} 
	
	componentWillUnmount() { console.log('componentWillUnmount'); }
	
	onClickButton = () => { 
		this.setState({ hidden: true }); 
		this.refs.hide.disabled = true; 
	} 
	
	render() { 
		return ( 
		<div> 
			<span>저는 {this.props.lang} 전문 {this.props.name}입니다!</span> 
			{!this.state.hidden && <span>{this.props.birth}년에 태어났습니다.
			</span>} 
			
		<button onClick={this.onClickButton} ref="hide">숨기기</button> 
		<button onClick={this.context.router.goBack}>뒤로</button> </div> ); 
	} 
}
```


>리액트 17부터는 componentWillMount, componentWillUpdate, componentWillReceiveProps 라이프 사이클이 deprecated됩니다

> 현재 사용 중인 React ver 16.10.2


![[Pasted image 20240112130853.png]]

### Mount

1. **constructor** 호출 
2. **context**, **defaultProps**, **state** 저장 
3. **componentWillMount** 호출 
4. **render**()
5. Mount 이후 **componentDidMount** 실행(이 시점부터 DOM에 접근이 가능. 주로 AJAX 요청)


### Props Update

1. **componentWillReceiveProps**
2. **shouldComponentUpdate**
3. **componentWillUpdate**
4. 업데이트 완료 시, **render**()
5. **componentDidUpdate**
