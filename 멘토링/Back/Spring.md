
### Spring 이란 ? 

> **엔터프라이즈용 Java 애플리케이션 개발을 편하게 할 수 있게 해주는 오픈소스 경량급 애플리케이션 프레임워크**

 - 복잡한 비즈니스 구현을 보다 손쉽게 개발하기 위한 애플리케이션 프레임워크야 

	애플리케이션 프레임워크 ? 
	애플리케이션을 개발하는데데 있어서 필요한 모든 업무 분야 및 모든 기술과 관련된 코드들의 뼈대를 제공

#### 그래서 결과적으로 뭐가 좋은건데  ? 

스프링을 사용함으로써 기존 기술을 사용할 때 불가피하게 작성해야했던 반복적이고 형식적인 코드를 단순화할 수 있어. 

#### 주요한 특징 

==POJO==

스프링을 하면서 제일 먼저 알아야하는 개념은 POJO야  

POJO는 Plain Old Java Object, 즉 순수 Java만을 통해서 생성한 객체를 의미해. 말 그대로, 다른 기술을 사용하지 않는 순수한 Java가 가지고 있는 기술만을 사용해 만든 객체인 거야. 


```java
public class Douzone {
	private String dept;
	private String member;

	public String getDept() {
		return dept;
	}
	public String setDept(String dept) {
		this.dept = dept; 
	}
	public String getMember() {
		return member;
	}
	public String setMember(String member) {
		this.member = member;
	}
}
```

#### 그럼 왜 POJO가 좋은건데 ?

자. 예를 들어, 순수 Java를 사용하지 않고 외부 라이브러리 메서드를 사용하여 만든 객체가 있다고 생각해보자. 

만약에 이 기술이 Deprecated되거나, 신 기술이 등장해서 그 기술에 의존해야 하는 상황이 발생한다면 ??? 

그럼 결과적으로 이와 관련된 기술을 모두 재수정해야 하는 상황이 발생해. 

==즉, 외부 기술에 의존성이 높아질수록 유지보수 측면에서 더 많은 문제가 발생할 여지가 생기는거지==

하지만, POJO 프로그래밍을 따른다면 이러한 의존성과 상관 없이 보다 유연하게 변화와 확장에 대처할 수 있어. 

외부 라이브러리의 설계나 한계에 상관없이 어디에나 적용할 수 있고, 코드의 단순화와 테스트 디버깅 또한 쉬워져. 

또한, 개발자로서 외부 라이브러리의 추가적인 학습 없이. 원래 알고 있던 순수한 Java만으로 어느정도 코딩과 이

가능해지고, 이러한 프로그래밍은 장기적인 유지보수 측면에서 좋은 이점을 가지고 있어. 

#### 그럼 Spring은 뭘 해준다는 건데 ?

대표적으로 Spring이 해주는 역할로서 크게 3가지를 짚어볼거야. 

1. IoC/DI
2. AOP
3. PSA 

순서대로 IoC/DI 부터 알아보자 







	
- api? 
- aop?
- mvc
- @KlagoController
- @SessionMapping
- @KlagoApiDesc
- @KlagoVersion
- BaseInfoContext
- @JsonIgnoreProperties(ignoreUnknown = true) ?? 
- RequestContext vs BaseInfoContext
- 인터페이스의 구현 이유 ?
- 