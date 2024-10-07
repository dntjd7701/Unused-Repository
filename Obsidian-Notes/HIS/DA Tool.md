
### 참조문서 ****

[DA# Repository 환경 설정 방법](https://gwa.douzone.com/ecm/oneffice/one003A06?c2VxPUQ2RGE1OUI1MzM1MzdGR2FhOWVlMUZEZTNCNkQ4YTdH)
[DA# 라이선스 관리](https://gwa.douzone.com/ecm/oneffice/one003A06?c2VxPTg1RzZEOEYzYUdjYTk3NWFjNWE2NjI3NEI5ZTFCRkYy)
[DA# 역할 별 환경 설정](https://gwa.douzone.com/ecm/oneffice/one003A06?c2VxPTY3NURGRkZGRDdCRkQ4QmU1R0dlYWE2N2VhNzFjM0Qx)

[데이터 모델링](https://gwa.douzone.com/ecm/oneffice/one003A06?c2VxPWFhQkRHNTZlM2EzN2UxRzhHOWM0Y2NhMTRjRDEyQjI1)

---

	 본 문서는 2024-05-29 박상용 이사님의 DA# 교육을 기반으로 작성하였습니다. 

---

표준화의 의의 

용어와 물리 데이터 명을 일치하여 모두가 인지하는 데이터의 정의를 내리는 것. 

---

실무적으로 표준화된 데이터를 어떻게 관리하는가 ? 

시스템을 활용한다.

그게 바로 DA#

---

DATA WordDic 

> 단어 정의 

--- 

DA# 

Repo 를 활용하여 모델 올리기, 내리기 가능
공유 가능 
웹을 통해 모델링 확인 가능 
모델 업데이트 시 전체 반영 가능 

---

분석 & 기획

논리설계-논리모델링
> 식별자(PK) 구분, 후보키(추가 식별 가능한  Keys)
> 


물리설계-물리모델링 
> 인덱스 설계(개발자의 영역)


---

## 데이터 모델링 

- 세부적인 속성이 아닌 Entity에 집중하라
- 주요 키를 찾아라 
- 수기 입력이냐, 코드값이 명시되어있느냐 
- 질의와 검증의 반복


ex) 진료과와 

진료과는 환명 이상의 의사를 가질 수 있다다. 
의사는 하나의 진료과는 무조권 가져야한다. 

데이터 모델링 원피스를 참고하여 논리설계 모델링 분석 

한번 정의된 Entity를 기준으로 재사용할 수 있다. 





---










