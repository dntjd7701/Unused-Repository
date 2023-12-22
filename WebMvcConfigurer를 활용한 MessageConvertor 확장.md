### **[ WebMvcConfigurer를 통한 설정의 변경 예시 ]**

예를 들어 스프링이 기본적으로 제공해주는 Json 기반의 메세지 컨버터 구성에 더해 XML 기반의 메세지 컨버터가 필요한 상황이라고 하자.

그러면 우선 우리는 기존의 메세지 컨버터를 확장해야 하는 상황이므로 extendMessageConverters를 오버라이딩하면 된다. 이 메소드의 이름이 extend로 시작하는 이유는 새로운 메세지 컨버터를 추가하여도 기존의 메세지 컨버터도 모두 등록이 되기 때문이다. 만약 기존의 메세지 컨버터를 모두 비활성화하고 새로운 메세지 컨버터만 추가하고 싶다면 configureMessageConverters를 이용하면 된다.

우리는 XML 기반의 메세지 컨버터를 사용하기 위해 다음과 같이 설정 클래스를 작성할 수 있다.

출처: [https://mangkyu.tistory.com/176](https://mangkyu.tistory.com/176) [MangKyu's Diary:티스토리]