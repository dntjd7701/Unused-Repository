
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

순서대로 IoC/DI 부터 알아보자.

#### IoC / DI

Java는 하나의 프로그램을 완성하기 위해. 하나의 목적을 가진 여러 객체들을 쌓아올려 만드는 방식의 ==객체지향언어==지.
이러한 언어들은 객체들 간의 관계를 적절하게 맺어주는 게 매우 중요해. 이 때, A 인스턴스가 B 인스턴스이 메서
\호출하고  있다면 ?  이러한 관계는 ==A가 B에 의존하는 관계== 라고 나타낼 수 있어. 

```java
class A {
   public void methodA() {
	   B b = new B();
	   b.methodB();
   }
}

class B {
	public void methodB() {
		...
	}
}
```


그런데 위와 같은 구조는 치명적인 단점이 있지. 예를 들어, methodA의 메서드에서 B인스턴스의 메서드가 아닌 
C라는 인스턴스의 메소드를 호출하는 방식으로  변경하고싶다 ? 이렇게 B에 의존하는 객체가 A하나뿐만이 아니
라 수백개라면 ?  모든 코드를 수정하는데 많은 공수가 들게 될거야. 

Spring은 이러한 문제를 해결하기 위해 어떻게 할까?

```java

//method를 추상 메소드로 선언 -- 추상화
Interface I() {
	void method();
}

class A {
	private I i; 

	public A(I i) {
		this.I = i;
	}

	public void methodA() {
		i.method();
	}
}


class B implements I {
	public void method() {
		...
	}
}


class C implements I {
	public void method() {
		...
	}
}
```

위 예제에서 **A는 자신이 사용할 객체를 스스로 생성하지 않고, 생성자를 통해 외부로부터 받아오고 있어** 
즉, A는 자신이 사용할 객체에 대해 추상적으로만 알고, 그저 `i`에 할당된 인스턴스에  `method` 라는 메서드가 존재한다는 것만 알고 있는 상태인거지. 

그렇다면 누군가 A가 사용할 객체를 결정&생성해서 A가 인스턴스화될 때 인자로 전달해주어야해.  그래야 `I`로부터 구현된 메소드를 호출할 수 있으니깐. 

이러한 작업을 해주는게 바로 스프링이야. 스프링을 사용하면 애플리케이션의 로직 외부에서 A가 사용할 객체를 별도로 설정할 수 있어. 

개발자가 설정 클래스 파일에 A가 사용할 객체가 B 혹은 C로 설정만 해준다면, 애플리케이션이 동작하는 과정에서 ==스프링이 설정 클래스 파일을 해석하고, 설정한 대로 객체를 생성하여 A의 생성자의 인자로 전달해줘== 

이처럼 **개발자가 아닌 스프링이 A가 사용할 객체를 생성하여 의존 관계를 맺어주는 것을 IoC(Inversion of Control, 제어의 역전)라고 하고, 그 과정에서 객체를 A의 생성자를 통해 주입해주는 것을 DI(Dependency Injection, 의존성 주입)라고해.**


#### AOP(Aspect Oriented Programming, 관심 지향 프로그래밍)

우리가 개발을 할 때에는 `횡단 관심사` 라는 개념이 존재해. 이는 애플리케이션의 기능을 크게 `공통 관심 사항` , `핵심 관심 사항` 으로 나누었을 때, `공통 관심 사항` 에 해당되는 내용이지.  

비즈니스의 핵심 로직이자, 해당 비즈니스 로직에 특화된 부분을 `핵심 관심 사항` 이라고 말할 수 있고, 모든 핵심 관심 사항에 ==공통적으로== 적용되는 사항들은 `횡단 관심사` 혹은 `공통 관심 사항`이라고 부를 수 있어. 

대표적인 예로 로깅, 보안과 같은 기능들이 `횡단 관심사`에 해당돼. 

이러한 공통적인 기능들을 하나로 묶어 관리함으로써 우린 유지보수적인 측면에서 많은 이점을 얻을 수 있어. 이러한 개념을 AOP라고 부르는 것이고. 


#### PSA(Portable Service Abstraction, 일관된 서비스 추상화)

스프링은 백엔드 개발에 있어 핵심적인 역할을 수행하는 프레임워크이고, 가장 핵심적인 역할 중 하나가 바로 데이터야. 

클라이언트의 요청에 따라 데이터베이스와 소통하고 이를 프론트에 전달하여  표현해내는게 일련의 웹 서비스 과정인거지.

이렇게 데이터를 가져오기 위해서 우린 백엔드에서 데이터베이스를 연결하게 되는데  데이터베이스에는 많은 종류가 존재해. MySql, Oracle, Maria DB, MongoDB 등 수많은 데이터베이스가 존재하고 생겨나지. 

그렇다면.  ==만약에 MySQL을 사용하여 개발을 하다가 데이터베이스를 바꿔야하는 상황이 온다면 ?==  기존의 서비스를 운영하다가 상황에 따라 데이터베이스를 바꿔야하는 경우는 언제든지 일어날 수 있는 일이야. 그렇다면 우린 데이터베이스를 연결하는 기존의 코드들을 모두 지우고 새로 작성해야할까 ?

스프링을 통해 우린 이러한 문제도 해결할 수 있어. 즉, 동일한 사용방법을 유지한채로 데이터베이스를 언제든지 스위칭 할 수 있는거지. ==스프링이 데이터베이스 서비스를 추상화한 인터페이스를 제공해주기 때문이야== .
즉, 스프링은 Java를 사용하여(POJO) 데이터베이스에 접근하는 방법을 규정한 인터페이스를 제공하고 있고 우린 이를 JDBC(Java DataBase Connectivity)라고 불러. 

각 데이터베이스 회사들은 자신의 데이터베이스에 접근하는 드라이버를 Java 코드의 형태로 배포하는데, ==이 드라이버에 해당하는 Java 코드의 클래스가 JDBC를 구현해==.  따라서, JDBC를 기반으로 하여데이터베이스 접근 코드를 작성해둔다면, 이후에 데이터베이스가 바뀌어도 기존에 작성한 로직 그대로 사용할 수 있는거지 

이처럼, ==특정 기술과 관련된 서비스를(JDBC) 추상화하여 일괄된 방식으로 사용될 수 있도록 한 것을 PSA==라고 해.















	
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