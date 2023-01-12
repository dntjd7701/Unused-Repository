##  현상

Maven 설치 후 실행 시

'failed to collect dependencies ... maven-default-http-blocker ...'

와 같은 Error가 발생할 경우에 따른 조치입니다. 

```
Failed to read artifact descriptor for 
egovframework.rte:egovframework.rte.ptl.mvc:jar:3.8.0: Could not transfer 
artifact egovframework.rte:egovframework.rte.ptl.mvc:pom:3.8.0 from/to maven-
default-http-blocker (http://0.0.0.0/): Blocked mirror for repositories: 
[project public (http://host/nexus/content/groups/public/, default, 
releases+snapshots), project thirdparty 
(http://host/nexus/content/repositories/thirdparty/, default, 
releases+snapshots)]

```

---
## 원인 

 Maven 3.8.1 버전 이후 HTTP에 대한 외부 연결을 막는 설정이 Default로 변경되었습니다.

[Apache Maven Release Notes](https://maven.apache.org/docs/3.8.1/release-notes.html)

이에 따라 폐쇄망에서 Nexus Repository를 사용할 경우 생기는 문제입니다.

	Nexus : Maven에서 사용할 수 있는 Repository, 개발팀에서 사용하는 공통 라이브러리를 공유 혹은 특정 솔루션을 사용하기 위한 써드파티 라이브러리의 관리 등 다양한 목적으로 사용이 가능합니다.

---


## 해결 


	1. HTTP Repository의 내부망에 SSL 인증서를 등록하여 HTTPS로 변경
	2. Maven > settings.xml을 수정하여 HTTP 무력화

1번째 방법의 경우 SSL 인증서 발급 등의 절차로 인해 즉각적인 문제 해결에 어렵고, 

이 중 2번째 해결법의 경우 매우 간단하지만, 본인의 local 컴퓨터에서 밖에 build가 되지 않는 어려움이 있어 추가적인 조치가 필요할 수 있습니다.

하지만 이러한 문제는 local-settings.xml의 형태로 만드는 등의 방법으로 해결할 수 있음으로  2번째 방법을 이용하였습니다. 



#### 해결 절차 

1. ${maven.home}/conf/settings.xml 혹은 ${user.home}/.m2/settings.xml 파일을 엽니다.
2. 파일 검색을 통해 아래와 같은 부분을 찾아 주석처리 혹은 삭제 후 저장합니다.
3. 실행하고자 했던 명령어를 재시도하여 확인합니다. (ex) mvn clean package)
4. Build 결과를 확인합니다.

```xml
...
<mirror>
<id>maven-default-http-blocker</id>
<mirrorOf>external:http:*</mirrorOf>
<name>Pseudo repository to mirror external repositories initially using HTTP.</name>
<url>http://0.0.0.0/</url>
</mirror>
...
```
