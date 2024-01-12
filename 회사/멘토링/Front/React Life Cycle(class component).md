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
4. **render**
5. Mount 이후 **componentDidMount** 실행(이 시점부터 DOM에 접근이 가능. 주로 AJAX 요청)


### Props Update

1. **componentWillReceiveProps**
2. **shouldComponentUpdate** : **성능 최적화**, PureComponent, Component
3. **componentWillUpdate**: state 변경 불가, shouldComponentUpdate를 실행 시킴으로 무한 반복
4. **render**
5. **componentDidUpdate** : DOM에 접근 가능


### State Update 

1. **setState** 실행
2. **shouldComponentUpdate**
3. **componentWillUpdate**
4. **render**
5. **componentDidUpdate**

### Unmount

1. **componentWillUnmount**: 이벤트 리스너를 제거하는 등의 여러 가지 정리 활동


### Error

1. **componentDidCatch**: after react 16 


### getDerivedStateFromProps

리액트 16 버전 이상. props의 변경에 따라 state도 함께 변경




### Douzone 


1. constructor 

해당 컴포넌트가 마운트되기 이전 시점에 호출 

주로 state, event handler binding 작업


2. getDerivedStateFromProps

props 를 state에 주입 

리랜더링 시점에 항상 호출된다. 

this 조회 불가 

```jsx
static getDerivedStateFromProps(nextProps, prevState) {
    console.log("getDerivedStateFromProps");
    if (nextProps.color !== prevState.color) {
      return { color: nextProps.color };
    }
    return null;
  }
```


constructor -> render -> DidMount 