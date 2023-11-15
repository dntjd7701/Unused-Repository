
#### RequestContext vs BaseInfoContext 

BaseInfoContext는 팀의 한 멤버가 직접 만든 모델이야. 
기존에 있던 RequestContext를 조금 더 편의성있게 사용하기 위해 새롭게 선언한 모델이지 

DAO를 만들 때, 세션 정보나 필수적으로 가져야하는 파라미터 값에 대해 미리 선언한 모델로.  RequestContext 혹은 BaseInfoContext를 상속해서 만들게돼.
		 `DTO(Data Transfer Object)` 는 계층 간 데이터 교환을 하기 위해 사용하는 객체로,  로직을 가지지 않는 순수한 데이터 객체(getter & setter 만 가진 클래스)야 
		예를 들어, 유저가 입력한 데이터를 DB에 넣는 과정에서 유저가 자신의 브라우저에서 데이터를 입력하여 form에 있는 데이터를 DTO에 넣어서 전송하고 해당 DTO를 받은 서버가 DAO를 이용하여 데이터베이스로 데이터를 집어넣어. 

그렇다면, RequestContext 와 BaseInfoContext의 차이 그리고 왜 BaseInfoContext를 상속받아 처리할까 ?

답은 매우 간단해. 중복되고 공통되고 필수적인 파라미터들에 대해 미리 선언하고 쓰기 위해서야. 
사용자의 로그인 정보나 회사/부서/사원 정보, 입력일, 수정일, db 정보 등 다양한 데이터를 세션으로부터 주입받아 함께 전달하기 위해 사용해

그렇다면 왜 기존에 있던 RequestContext에서 새로운 모델인 BaseInfoContext를 만들었을까. 이건 몇 가지 이유가 있어. 

1. RequestContext의 경우 
2. 소숫점 자릿수 정보
3. Date타입 정보 
4. @JsonIgnore



### @KlagoController
