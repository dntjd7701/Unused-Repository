
BSA1125 BOM 기준원가 

기준 : 
- 회사 2000
- 품목 00-K01

10회의 api 호출 후 평균 응답시간 확인 -> 600~700 밀리초 


BSA1120 

10회의 api 호출 후 평균 응답시간 확인 -> 900~1400 밀리초 

수정 후, 

![[Pasted image 20231207091438.png]]

쿼리로 먼저 중복에 해당하는 로직을 확인. 

> , CASE WHEN (CHAR_LENGTH(T.FULL_PATH) - CHAR_LENGTH(REPLACE(T.FULL_PATH, SB.ITEMPARENT_CD, ''))) = 0 THEN 0 ELSE 1 END AS INFINITY_RECURSIVE

Recursive 문에서 재귀를 돌며 BOM에 맞는 PATH 를  산출하는데, 이 때, 자신의 품목으로 PATH에서 REPLACE처리를 했을 때, 이전의 길이와 같지 않다면 이는 아닌것., 