
#### 선적 추가 전 

http://14.41.55.45:8089/KLAGO/klago-backend-logis/blob/93b24124cf9587aab555931f6a2a655b6a67a0bc/src/main/java/klago/logis/blg/blg0000/blg0070/query/common/BLG0070Query.xml

#### 리팩토링 후 







```
- 주석 일괄 정리 
- 조인 시 INDEX 고려 
- 조인 순서 수정 
- 매출 - 출고 INNER JOIN 설정 
- 명칭 관련된 건에 대하여 마지막에 JOIN 처리 
- 원피스 관련 로직 제거 
- BaseInfoContext 상속 