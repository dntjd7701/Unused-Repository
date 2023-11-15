
#### RequestContext vs BaseInfoContext 

> 직렬화:  서버 -> 클라이언트
> 역직렬화: 클라이언트 -> 서버 

BaseInfoContext는 팀의 한 멤버가 직접 만든 모델이야. 
기존에 있던 RequestContext를 조금 더 편의성있게 사용하기 위해 새롭게 선언한 모델이지 

DAO를 만들 때, 세션 정보나 필수적으로 가져야하는 파라미터 값에 대해 미리 선언한 모델로.  RequestContext 혹은 BaseInfoContext를 상속해서 만들게돼.
		 `DTO(Data Transfer Object)` 는 계층 간 데이터 교환을 하기 위해 사용하는 객체로,  로직을 가지지 않는 순수한 데이터 객체(getter & setter 만 가진 클래스)야 
		예를 들어, 유저가 입력한 데이터를 DB에 넣는 과정에서 유저가 자신의 브라우저에서 데이터를 입력하여 form에 있는 데이터를 DTO에 넣어서 전송하고 해당 DTO를 받은 서버가 DAO를 이용하여 데이터베이스로 데이터를 집어넣어. 

그렇다면, RequestContext 와 BaseInfoContext의 차이 그리고 왜 BaseInfoContext를 상속받아 처리할까 ?

답은 매우 간단해. 중복되고 공통되고 필수적인 파라미터들에 대해 미리 선언하고 쓰기 위해서야. 
사용자의 로그인 정보나 회사/부서/사원 정보, 입력일, 수정일, db 정보 등 다양한 데이터를 세션으로부터 주입받아 함께 전달하기 위해 사용해

그렇다면 왜 기존에 있던 RequestContext에서 새로운 모델인 BaseInfoContext를 만들었을까. 이건 몇 가지 이유가 있어. 

1. @JsonIgnore
2.  소숫점 자릿수 정보
3. Date타입 정보 

RequestContext에서는 멤버 변수들이 @JsonIgnore로 처리되어 있기 때문에 데이터의 역직렬화를 위해선 새로운 변수를 또 작성해줘야돼. 이러한 과정들이 너무 번거롭기 때문에 @JsonIgnore가 처리되지 않은 공통 맴버 변수들을 새로 작성한거지. 

소숫점 자릿수 정보의 경우. 수량, 금액, 비율 등의 데이터를 다룰 경우 우린 환경설정값에 따라 다르게 처리하게 되어있어. 이러한 정보를 세션으로 부터 주입받아 사용하기 위해 이미 정의되어 있는 BaseInfoContext로부터 상속받아 처리해.

날짜의 경우도 마찬가지야. 
우린 insertDtA와 insertDt라는 두개의 멤버 변수를 BaseInfoContext에서 가지고 있는걸 확인할 수 있는데, 날짜의 경우는 데이터타입이 `Date`인 insertDtA라는 멤버변수를 활용해 데이터의 파라미터로 사용하고, 그 결과값을 반환할때는 String인 insertDt라는 변수를 통해 반환받아. 그래서 우린 insertDt 변수에 @JsonIgnore가 포함되어 있지 않은걸 알 수 있어. 

### @JsonIgnoreProperties(ignoreUnknown = true)

@JsonIgnore이 각 클래스의 속성 수준에서 사용되었다면 @JsonIgnoreProperties는 클래스 수준에서 사용되는 어노테이션이야. 클래스 전반의 직렬화, 역직렬화를 결정하고 그 외의 속성들도 가지고 있어. 

1. allowGetter : 직렬화 O
2. allowSetter: 역직렬화 O
3. ==ignoreUnknown==
4. value: Ignore 대상 선언

위의 여러 속성들 중 가장 중점적으로 봐야할 건, ignoreUnknown이라는 속성이야. 







### @KlagoController
