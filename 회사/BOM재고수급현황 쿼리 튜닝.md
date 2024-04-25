

### 인덱싱 

해당 화면은, 특정 품목의 BOM에 따라 각 품목의 재고를 전수 조사하여 보여주는 화면이다. 

근데 속도가 심상치 않다. 왜 느릴까 ? 조건에 걸리는 데이터를 조회해보니 총 1만건 정도의 데이터이고 이 정도로 속도가 걸릴 만한 쿼리는 아니다. 

index의 순서의 문제였나 고민했으나 그런 것은 아니였다. 

해답은 의외로 간단하고, 그 효과는 극적이였다. 

```sql 
LEFT OUTER JOIN erp_1234.LSTOCK_D LSTOCK
    ON D.CO_CD = LSTOCK.CO_CD
    AND D.PO_NB = LSTOCK.PO_NB
    AND D.PO_SQ = LSTOCK.PO_SQ
    AND D.ITEM_CD = LSTOCK.ITEM_CD
```

여기에서 'LPO_D(발주등록디테일)' 의 키값은 LSTOCK(입고등록내역)의 키값과 연결되어 있다. 

![[Pasted image 20240411151932.png]]

인덱스 또한 위와같이 걸려있었다. 다만, 간과한것이 한가지 있었다. 

인덱스가 포함된 관계, 즉 A,B,C로 인덱스가 걸려있고 A,B로 JOIN을 한 경우와, A,B가 걸려있고 A,B,C로 JOIN을 한 경우는 극적으로 성능이 갈린다는 것을 말이다. 

인덱스가 조인문을 포함할 때에는 이미 정렬이 되어있는 곳에서 뒤의 정렬을 무시함으로 인덱스의 성능 이점을 챙길 수 있으나, 그 반대의 경우에는 조인 시에 전체 테이블을 스캔하며 매칭되는 행을 찾아야 함으로 성능이 저하된다. 

그 결과 2023년도 부터 금일까지의 날짜를 조회했을 때 기본 SELECT절 기준 1만건의 데이터에 대하여

$$54,162ms -> 203ms$$
로 말도 안되는 차이가 나타났다... BP적으로 고려했을 때에도 필요없는 조인 키였음으로 필수적으로 수정해야하는 부분이였다. 

그 외, 조인 시, 전테이블의 조인키를 우선적으로 거는 것 WHERE 조건의 개선을 통해 이 전에 비해 압도적으로 나은 쿼리 속도를 보여주었다. 


> /*! USE INDEX (IDX_LSTOCK_D_CO_CD_PO_NB_PO_SQ) */ 




>BEFORE (전)

```SQL 
/* [POM1020] 품목에 따른 그리드 조회 */
WITH RECURSIVE BOM AS (

	# 모품목-자품목 간 BOM조회 
	SELECT CO_CD
		 , 0 AS LEVEL 				# LEVEL 
		 , 0 AS BOM_SQ 				# BOM SQ 
		 , ITEM_CD AS ROOT_ITEM		# 최상위 모품목 
		 , ITEM_CD AS ITEMPARENT_CD	# 모품목 
		 , ITEM_CD AS ITEMCHILD_CD 	# 자품목 
		 , 1 AS REAL_QT 			
		 , CAST(CONCAT('|', ITEM_CD, '|') AS VARCHAR(256)) AS BOM_PATH # 자품목-모품목간 모든 경로 나열 
		 , 'N' AS INFINITY_RECURSIVE	# 무한참조여부 
	 FROM erp_1234.SITEM
	WHERE CO_CD = '5550'
	  AND ITEM_CD = '01-PC270001'
	
	UNION ALL 
	
	SELECT SW.CO_CD
		 , B.LEVEL + 1 AS LEVEL
		 , SW.BOM_SQ
		 , B.ROOT_ITEM 
		 , SW.ITEMPARENT_CD 
		 , SW.ITEMCHILD_CD 
		 , COALESCE(SW.REAL_QT, 0) AS REAL_QT 	
		 , CAST(CONCAT(B.BOM_PATH, SW.ITEMCHILD_CD, '|') AS VARCHAR(256)) AS BOM_PATH
		 , CASE WHEN INSTR(B.BOM_PATH, CONCAT('|', SW.ITEMCHILD_CD, '|')) > 0 THEN 'Y' ELSE 'N' END AS INFINITY_RECURSIVE
	 FROM BOM B
	 
			INNER JOIN erp_1234.SBOM_WF SW 
		 
	   ON B.CO_CD = SW.CO_CD 
	  AND B.ITEMCHILD_CD = SW.ITEMPARENT_CD
	WHERE SW.CO_CD = '5550'
	  # 무한참조일 경우 조회 제한 
	  AND B.INFINITY_RECURSIVE = 'N'
	  # 조회일자  
	  AND SW.START_DT  <=  '20240411'
	  AND SW.END_DT >= '20240411'
	  # 사용여부 
	  AND SW.USE_YN = '1'
	  # 무한참조 방지를 위한 레벨제한 
	  AND B.LEVEL  <=  10
	

)
SELECT LEVEL																#LEVEL 
	, BOM_SQ																#BOM 순번 
	, BOM_PATH																#모품목-자품목 간 BOM경로 
	, INFINITY_RECURSIVE													#무한참조플래그 
	, ITEMPARENT_CD															#모품목 
	, ITEM_CD																#자품목
	, ITEM_NM																#자품명  
	, ITEM_DC															    #규격 
	, UNIT_DC																#재고단위 
	, ODR_FG																#조달구분 
	, ODR_FG_NM																#조달구분명 
	, ACCT_FG																#계정구분 
	, ACCT_FG_NM															#계정구분
	, REAL_QT																#단위소요량
	, erp_1234.UFN_ROUND(REAL_QT * 11, 1, 1) AS NEED_QT  #필요수량   
	, IN_INV_QT 															#재고수량 
	, IN_WIP_QT																#재공수량 
	, (IN_INV_QT + IN_WIP_QT) AS SUM_CURRENT_QT 							#합계
	, IN_PO_QT																#구매입고예정량 
	, IN_WR_IN_QT															#생산입고예정량 
	, IN_WR_OUT_QT															#외주입고예정
	, (IN_PO_QT + IN_WR_IN_QT + IN_WR_OUT_QT) AS SUM_IN_QT					#합계 
	, OUT_SO_QT																#주문출고예정량 
	, OUT_WOBOM_QT															#자재할당량 
	, (OUT_SO_QT + OUT_WOBOM_QT) AS SUM_OUT_QT								#합계 
	, OUT_SAFE_QT 															#안전재고
	, (IN_INV_QT + IN_WIP_QT + IN_PO_QT + IN_WR_IN_QT + IN_WR_OUT_QT - OUT_SO_QT - OUT_WOBOM_QT - OUT_SAFE_QT) AS AVAILABLE_QT #가용재고
	, (IN_INV_QT + IN_WIP_QT + IN_PO_QT + IN_WR_IN_QT + IN_WR_OUT_QT - OUT_SO_QT - OUT_WOBOM_QT - OUT_SAFE_QT) - erp_1234.UFN_ROUND(REAL_QT * 11, 1, 1) AS OVERSHORT_QT #과부족 
FROM (
		SELECT B.LEVEL 
			, B.BOM_PATH															
			, B.INFINITY_RECURSIVE									
			, B.BOM_SQ 
			, B.ITEMPARENT_CD 
			, B.ITEMCHILD_CD AS ITEM_CD 
			, SI.ITEM_NM 
			, SI.ITEM_DC 
			, SI.UNIT_DC 
			, SI.ODR_FG
			, ODR.CTD_NM AS ODR_FG_NM 
			, SI.ACCT_FG 
			, ACCT.CTD_NM AS ACCT_FG_NM
			, COALESCE(B.REAL_QT, 0) AS REAL_QT
			, COALESCE(MM.QT, 0) AS IN_INV_QT
			# 재공 
			 
					, COALESCE(WT.QT, 0) AS IN_WIP_QT  
				 
			# 구매입고예정량 
			 
					, COALESCE(PO.QT, 0) AS IN_PO_QT 			
				 
			# 생산입고예정량
			 
					, COALESCE(WO.QT, 0) AS IN_WR_IN_QT 		  
				 
			# 외주입고예정량
			 
					, COALESCE(LOP.QT, 0) AS IN_WR_OUT_QT		 
				 
			# 주문출고예정량 
			 
					, COALESCE(SO.QT, 0) AS OUT_SO_QT			
				 
			# 자재할당량
			 
					, COALESCE(LMR.QT, 0) AS OUT_WOBOM_QT		  
				 
			# 안전재고량 
			 
					, COALESCE(SI.SAFESTOCK_QT, 0) AS OUT_SAFE_QT			
				 
		FROM BOM B
		INNER JOIN erp_1234.SITEM SI 
			ON SI.CO_CD = B.CO_CD 
			AND SI.ITEM_CD = B.ITEMCHILD_CD
		LEFT OUTER JOIN erp_1234.SCTRL_D ODR 
			ON ODR.CO_CD = B.CO_CD
			AND ODR.CTRL_CD = '18'
			AND ODR.MODULE_CD = 'L0'
			AND ODR.CTD_CD = SI.ODR_FG
		LEFT OUTER JOIN erp_1234.SCTRL_D ACCT 
			ON ACCT.CO_CD = B.CO_CD
			AND ACCT.CTRL_CD = '10'
			AND ACCT.MODULE_CD = 'L0'
			AND ACCT.CTD_CD = SI.ACCT_FG
		# 현재고 
		LEFT OUTER JOIN (
			SELECT MM.ITEM_CD 
				, COALESCE(SUM(MM.IOPEN_QT), 0) + COALESCE(SUM(MM.IRCV_QT), 0) - COALESCE(SUM(MM.IISU_QT), 0) AS QT #재고수량
			  #재고집계(월별)
			  FROM erp_1234.LX_LINVTORY_MM MM
			  LEFT OUTER JOIN erp_1234.SLOC SL 
			  	ON MM.CO_CD = SL.CO_CD 
			  	AND MM.WH_CD = SL.BASELOC_CD 
			  	AND MM.LC_CD = SL.LOC_CD   
			  WHERE MM.CO_CD = '5550'
			  	AND MM.IO_MM LIKE CONCAT(SUBSTRING('20240411', 1, 4), '%')
		  	     
		  		 
			  		#부적합재고 제외 
			  		AND SL.BAD_YN NOT IN ('1') 
			  	 
		  		 
			  		#비가용제고 제외 
		  		 	AND SL.AVABSTOCK_YN NOT IN ('0')  
			  	  
			   GROUP BY MM.CO_CD, MM.ITEM_CD
		) MM ON MM.ITEM_CD = B.ITEMCHILD_CD

		# 현재공 
		 
			LEFT OUTER JOIN (
				SELECT WT.ITEM_CD 
					, SUM(WT.IOPEN_QT) + SUM(WT.IRCV_QT) - SUM(WT.IISU_QT) AS QT
				#재공/공정자재집계(일별) 
				FROM erp_1234.LX_WIP_DT WT
				LEFT OUTER JOIN erp_1234.SLOC SL 
					ON SL.CO_CD = WT.CO_CD 
				  	AND SL.BASELOC_CD = WT.WH_CD  
				  	AND SL.LOC_CD = WT.LC_CD
				WHERE WT.CO_CD = '5550'
				  	AND WT.IO_DT LIKE CONCAT(SUBSTR('20240411', 1, 4), '%')
				  	  
				  	 
				  		#부적합재고 제외 
				  		AND SL.BAD_YN NOT IN ('1') 
				  	 
			  		 
				  		#비가용제고 제외 
			  		 	AND SL.AVABSTOCK_YN NOT IN ('0')  
				  	  
				GROUP BY WT.CO_CD, WT.ITEM_CD
			) WT ON WT.ITEM_CD = B.ITEMCHILD_CD
		 

		# 구매입고예정량 
		 
			LEFT OUTER JOIN (
				SELECT D.ITEM_CD 
					, ((COALESCE(SUM(D.PO_QT), 0) - COALESCE(SUM(LSTOCK.PO_QT), 0)) * MAX(COALESCE(SI.UNITCHNG_NB, 1))) AS QT
				#발주관리 
				FROM erp_1234.LPO_D D
				INNER JOIN erp_1234.LPO H 
					ON H.CO_CD = D.CO_CD 
					AND H.PO_NB = D.PO_NB 
				INNER JOIN erp_1234.SITEM SI 
					ON SI.CO_CD = D.CO_CD
					AND SI.ITEM_CD = D.ITEM_CD
				#구매입고(Detail)
				LEFT OUTER JOIN erp_1234.LSTOCK_D LSTOCK 
					ON LSTOCK.CO_CD = D.CO_CD 
					AND LSTOCK.PO_NB = D.PO_NB 
					AND LSTOCK.PO_SQ = D.PO_SQ 
					AND LSTOCK.ITEM_CD = D.ITEM_CD 
				WHERE H.CO_CD = '5550'
					  
					AND H.PO_DT  <=  '20240411' #발주일자
					AND D.USE_YN = '1'
					AND D.EXPIRE_YN = '1' 	#마감여부 적용 
				GROUP BY H.CO_CD, D.ITEM_CD
			) PO ON PO.ITEM_CD = B.ITEMCHILD_CD 
		 

		# 생산입고예정(생산지시확정수량 - 실적수량(최종공정))
		 
			LEFT OUTER JOIN (
				SELECT LP.ITEM_CD
					, COALESCE(SUM(LP.ITEM_QT), 0) -  COALESCE(SUM(LW.WORK_QT), 0) AS QT #지시수량 - 실적수량(최종공정)
				#생산지시
				FROM erp_1234.LPROD LP 
				#생산실적 
				LEFT OUTER JOIN erp_1234.LWORK LW 
					ON LP.CO_CD = LW.CO_CD 
					AND LP.WO_CD = LW.WO_CD 
					AND LP.ITEM_CD = LW.ITEM_CD 
					AND LW.LAST_YN = '1' #최종공정 
				WHERE LP.CO_CD = '5550'
					AND LP.ORD_DT  <=  '20240411'
					  
					AND LP.DOC_ST IN ('1') #확정 
				GROUP BY LP.CO_CD, LP.ITEM_CD
			) WO ON WO.ITEM_CD = B.ITEMCHILD_CD 
		 

		#외주입고예정(외주구분-공정외주의 경우 생산에서 취합됨으로, 품목외주만 계산)
		 
			LEFT OUTER JOIN (
				#외주발주	
				SELECT LPD.ITEM_CD 
					, COALESCE(SUM(LPD.PO_QT), 0) - COALESCE(SUM(LPD.RCV_QT), 0) AS QT #발주수량 - 입고수량 
				FROM erp_1234.LOS_PO LP 
				INNER JOIN erp_1234.LOS_PO_D LPD
					ON LPD.CO_CD = LP.CO_CD 
					AND LPD.PO_NB = LP.PO_NB 
				WHERE LP.CO_CD = '5550'
					AND LP.PO_DT  <=  '20240411'
					  
					AND LPD.EXPIRE_YN = '1'
					AND LP.PO_TY = '1'
				GROUP BY LP.CO_CD, LPD.ITEM_CD 
			) LOP ON LOP.ITEM_CD = B.ITEMCHILD_CD
		 

		# 주문출고예정량   
		 
			LEFT OUTER JOIN (
				SELECT LSO_D.ITEM_CD
					 , ((COALESCE(SUM(LSO_D.SO_QT), 0) - COALESCE(SUM(LDELIVER_D.SO_QT), 0)) * MAX(COALESCE(SITEM.UNITCHNG_NB, 1))) AS QT
				#주문 
				FROM erp_1234.LSO 
				INNER JOIN erp_1234.LSO_D 
					ON LSO_D.CO_CD = LSO.CO_CD
					AND LSO_D.SO_NB = LSO.SO_NB 
				INNER JOIN erp_1234.SITEM 
					ON SITEM.CO_CD = LSO_D.CO_CD 
					AND SITEM.ITEM_CD = LSO_D.ITEM_CD
				#출고등록(Master)	
				LEFT OUTER JOIN erp_1234.LDELIVER_D 
					ON LDELIVER_D.CO_CD = LSO_D.CO_CD  
					AND LDELIVER_D.SO_NB = LSO_D.SO_NB
					AND LDELIVER_D.ITEM_CD = LSO_D.ITEM_CD	
				WHERE LSO.CO_CD = '5550'
					AND LSO.SO_DT  <=  '20240411'
					  
					AND LSO_D.USE_YN = '1'
				 	AND LSO_D.EXPIRE_YN = '1'	
				GROUP BY LSO.CO_CD, LSO_D.ITEM_CD
			) SO ON SO.ITEM_CD = B.ITEMCHILD_CD
		 

		# 자재 할당량 적용 
		 
			LEFT OUTER JOIN (
				SELECT T.MATL_CD AS ITEM_CD 
					, COALESCE(SUM(T.REAL_QT), 0) - COALESCE(SUM(T.ISU_QT), 0) AS QT
				FROM (
				SELECT LM.MATL_CD  
					, LM.REAL_QT #소요수량 
					, LM.ISU_QT 
				#생산지시
				FROM erp_1234.LPROD LP 
				#생산자시-소요자재 
				INNER JOIN erp_1234.LPROD_MATL LM 
					ON LP.CO_CD = LM.CO_CD 
					AND LP.WO_CD = LM.WO_CD 
				WHERE LP.CO_CD = '5550'
					AND LP.ORD_DT  <=  '20240411'
					 
					AND LP.DOC_ST IN ('1') #확정 
				
				UNION ALL 
					 
				 SELECT LM.MATL_CD
					, LM.REAL_QT
					, LM.ISU_QT
				#외주발주등록 
				 FROM erp_1234.LOS_PO LP 
				#외주발주등록-사급자재 
				 INNER JOIN erp_1234.LOS_PO_MATL LM  
				 	ON LP.CO_CD  = LM.CO_CD
				 	AND LP.PO_NB = LM.PO_NB
				 WHERE LP.CO_CD = '5550'
				 	AND LP.PO_DT  <=  '20240411'
				 	 
				 	AND LP.PO_TY = '1'
				) T  	
				GROUP BY T.MATL_CD
			) LMR ON LMR.ITEM_CD = B.ITEMCHILD_CD
		 

) T 
WHERE 1=1 
 # 품목 
  
 # 계정구분 
  
 # 조달구분
  
 # 과부족 
  
ORDER BY LEVEL, BOM_SQ
```


39122ms 


> AFTER

```sql
/* [POM1020] 품목에 따른 그리드 조회 */

WITH RECURSIVE BOM AS (

  

# 모품목-자품목 간 BOM조회 

SELECT CO_CD

, 0 AS LEVEL # LEVEL 

, 0 AS BOM_SQ # BOM SQ 

, ITEM_CD AS ROOT_ITEM # 최상위 모품목 

, ITEM_CD AS ITEMPARENT_CD # 모품목 

, ITEM_CD AS ITEMCHILD_CD # 자품목 

, 1 AS REAL_QT 

, CAST(CONCAT('|', ITEM_CD, '__', 0, '|') AS VARCHAR(256)) AS BOM_PATH # 자품목-모품목간 모든 경로 나열 

, 'N' AS INFINITY_RECURSIVE # 무한참조여부 

FROM erp_1234.SITEM

WHERE CO_CD = '5550'

  AND ITEM_CD = '01-PC270001'

UNION ALL 

SELECT SW.CO_CD

, B.LEVEL + 1 AS LEVEL

, SW.BOM_SQ

, B.ROOT_ITEM 

, SW.ITEMPARENT_CD 

, SW.ITEMCHILD_CD 

, COALESCE(SW.REAL_QT, 0) AS REAL_QT 

, CAST(CONCAT(B.BOM_PATH, SW.ITEMCHILD_CD, '__', SW.BOM_SQ, '|') AS VARCHAR(256)) AS BOM_PATH

, CASE WHEN INSTR(B.BOM_PATH, CONCAT('|', SW.ITEMCHILD_CD, '|')) > 0 THEN 'Y' ELSE 'N' END AS INFINITY_RECURSIVE

FROM BOM B

INNER JOIN erp_1234.SBOM_WF SW 

  ON B.CO_CD = SW.CO_CD 

  AND B.ITEMCHILD_CD = SW.ITEMPARENT_CD

WHERE SW.CO_CD = '5550'

  # 무한참조일 경우 조회 제한 

  AND B.INFINITY_RECURSIVE = 'N'

  # 조회일자  

  AND SW.START_DT  <=  '20240411'

  AND SW.END_DT >= '20240411'

  # 사용여부 

  AND SW.USE_YN = '1'

  # 무한참조 방지를 위한 레벨제한 

  AND B.LEVEL  <=  10

  

)

SELECT LEVEL #LEVEL 

, BOM_SQ #BOM 순번 

, BOM_PATH #모품목-자품목 간 BOM경로 

, INFINITY_RECURSIVE #무한참조플래그 

, ITEMPARENT_CD #모품목 

, ITEM_CD #자품목

, ITEM_NM #자품명  

, ITEM_DC     #규격 

, UNIT_DC #재고단위 

, ODR_FG #조달구분 

, ODR_FG_NM #조달구분명 

, ACCT_FG #계정구분 

, ACCT_FG_NM #계정구분

, REAL_QT #단위소요량

, erp_1234.UFN_ROUND(REAL_QT * 11, 1, 1) AS NEED_QT  #필요수량   

, IN_INV_QT #재고수량 

, IN_WIP_QT #재공수량 

, (IN_INV_QT + IN_WIP_QT) AS SUM_CURRENT_QT #합계

, IN_PO_QT #구매입고예정량 

, IN_WR_IN_QT #생산입고예정량 

, IN_WR_OUT_QT #외주입고예정

, (IN_PO_QT + IN_WR_IN_QT + IN_WR_OUT_QT) AS SUM_IN_QT #합계 

, OUT_SO_QT #주문출고예정량 

, OUT_WOBOM_QT #자재할당량 

, (OUT_SO_QT + OUT_WOBOM_QT) AS SUM_OUT_QT #합계 

, OUT_SAFE_QT #안전재고

, (IN_INV_QT + IN_WIP_QT + IN_PO_QT + IN_WR_IN_QT + IN_WR_OUT_QT - OUT_SO_QT - OUT_WOBOM_QT - OUT_SAFE_QT) AS AVAILABLE_QT #가용재고

, (IN_INV_QT + IN_WIP_QT + IN_PO_QT + IN_WR_IN_QT + IN_WR_OUT_QT - OUT_SO_QT - OUT_WOBOM_QT - OUT_SAFE_QT) - erp_1234.UFN_ROUND(REAL_QT * 11, 1, 1) AS OVERSHORT_QT #과부족 

FROM (

SELECT B.LEVEL 

, B.BOM_PATH

, B.INFINITY_RECURSIVE

, B.BOM_SQ 

, B.ITEMPARENT_CD 

, B.ITEMCHILD_CD AS ITEM_CD 

, SI.ITEM_NM 

, SI.ITEM_DC 

, SI.UNIT_DC 

, SI.ODR_FG

, ODR.CTD_NM AS ODR_FG_NM 

, SI.ACCT_FG 

, ACCT.CTD_NM AS ACCT_FG_NM

, COALESCE(B.REAL_QT, 0) AS REAL_QT

, COALESCE(MM.QT, 0) AS IN_INV_QT

# 재공 

, COALESCE(WT.QT, 0) AS IN_WIP_QT  

# 구매입고예정량 

, ( COALESCE(PO.QT) - COALESCE(LSTOCK.QT) ) * COALESCE(SI.UNITCHNG_NB, 1) AS IN_PO_QT 

# 생산입고예정량

, COALESCE(WO.QT, 0) - COALESCE(WR.QT, 0) AS IN_WR_IN_QT

# 외주입고예정량

, COALESCE(LOP.QT, 0) AS IN_WR_OUT_QT  

# 주문출고예정량 

, ( COALESCE(SO.QT, 0) - COALESCE(LD.QT, 0) ) * COALESCE(SI.UNITCHNG_NB, 1) AS OUT_SO_QT

# 자재할당량

, COALESCE(LMR.QT, 0) AS OUT_WOBOM_QT  

# 안전재고량 

, COALESCE(SI.SAFESTOCK_QT, 0) AS OUT_SAFE_QT

FROM BOM B

INNER JOIN erp_1234.SITEM SI 

ON B.CO_CD = SI.CO_CD  

AND B.ITEMCHILD_CD = SI.ITEM_CD 

LEFT OUTER JOIN erp_1234.SCTRL_D ODR 

ON B.CO_CD = ODR.CO_CD

AND ODR.CTRL_CD = '18'

AND ODR.MODULE_CD = 'L0'

AND SI.ODR_FG = ODR.CTD_CD 

LEFT OUTER JOIN erp_1234.SCTRL_D ACCT 

ON B.CO_CD = ACCT.CO_CD 

AND ACCT.CTRL_CD = '10'

AND ACCT.MODULE_CD = 'L0'

AND SI.ACCT_FG = ACCT.CTD_CD 

# 현재고 

LEFT OUTER JOIN (

SELECT MM.ITEM_CD 

, COALESCE(SUM(MM.IOPEN_QT), 0) + COALESCE(SUM(MM.IRCV_QT), 0) - COALESCE(SUM(MM.IISU_QT), 0) AS QT #재고수량

  #재고집계(월별)

  FROM erp_1234.LX_LINVTORY_MM MM

  LEFT OUTER JOIN erp_1234.SLOC SL 

  ON MM.CO_CD = SL.CO_CD 

  AND MM.LC_CD = SL.LOC_CD   

  AND MM.WH_CD = SL.BASELOC_CD 

  WHERE MM.CO_CD = '5550'

  AND MM.IO_MM LIKE CONCAT(SUBSTRING('20240411', 1, 4), '%')

  #부적합재고 제외 

  AND SL.BAD_YN NOT IN ('1') 

  #비가용제고 제외 

  AND SL.AVABSTOCK_YN NOT IN ('0')  

  GROUP BY MM.CO_CD, MM.ITEM_CD

) MM ON B.ITEMCHILD_CD = MM.ITEM_CD 

  

# 현재공 

LEFT OUTER JOIN (

SELECT WT.ITEM_CD 

, SUM(WT.IOPEN_QT) + SUM(WT.IRCV_QT) - SUM(WT.IISU_QT) AS QT

#재공/공정자재집계(일별) 

FROM erp_1234.LX_WIP_DT WT

LEFT OUTER JOIN erp_1234.SLOC SL 

ON SL.CO_CD = WT.CO_CD 

  AND SL.LOC_CD = WT.LC_CD

  AND SL.BASELOC_CD = WT.WH_CD  

WHERE WT.CO_CD = '5550'

  AND WT.IO_DT LIKE CONCAT(SUBSTR('20240411', 1, 4), '%')

  #부적합재고 제외 

  AND SL.BAD_YN NOT IN ('1') 

  #비가용제고 제외 

  AND SL.AVABSTOCK_YN NOT IN ('0')  

GROUP BY WT.CO_CD, WT.ITEM_CD

) WT ON B.ITEMCHILD_CD = WT.ITEM_CD 

  

# 구매입고예정량 (발주수량 - 입고수량)

LEFT OUTER JOIN ( 

SELECT D.ITEM_CD 

, SUM(D.PO_QT) QT 

# 발주등록마스터 

FROM erp_1234.LPO H

# 발주등록디테일 

INNER JOIN erp_1234.LPO_D D 

ON H.CO_CD = D.CO_CD 

AND H.PO_NB = D.PO_NB 

WHERE H.CO_CD = '5550'

AND H.PO_DT   <=  '20240411' # 발주일자

AND D.USE_YN = '1'   # 사용여부 

AND D.EXPIRE_YN = '1'   # 유효여부('1': 유효_미마감) 

GROUP BY D.ITEM_CD 

) PO ON B.ITEMCHILD_CD = PO.ITEM_CD 

LEFT OUTER JOIN ( 

SELECT D.ITEM_CD 

, SUM(D.PO_QT) QT

# 입고등록디테일 

FROM erp_1234.LSTOCK_D D 

INNER JOIN erp_1234.LPO_D PO_D 

ON D.CO_CD = PO_D.CO_CD 

AND D.PO_NB = PO_D.PO_NB

AND D.PO_SQ = PO_D.PO_SQ

INNER JOIN erp_1234.LPO PO_H  

ON PO_D.CO_CD = PO_H.CO_CD 

AND PO_D.PO_NB = PO_H.PO_NB

WHERE PO_H.CO_CD = '5550'

AND PO_H.PO_DT   <=  '20240411' # 발주일자

AND PO_D.USE_YN = '1' # 사용여부

AND PO_D.EXPIRE_YN = '1' # 유효여부('1': 유효_미마감) 

AND D.USE_YN = '1' # 사용여부

AND D.EXPIRE_YN = '1' # 유효여부('1': 유효_미마감) 

GROUP BY D.ITEM_CD 

) LSTOCK ON B.ITEMCHILD_CD = LSTOCK.ITEM_CD 

  

# 생산입고예정(생산지시확정수량 - 실적수량(최종공정))

LEFT OUTER JOIN (

SELECT LP.ITEM_CD

, SUM(LP.ITEM_QT) QT

# 생산지시등록마스터 

FROM erp_1234.LPROD LP 

WHERE LP.CO_CD = '5550'

AND LP.ORD_DT  <=  '20240411' # 지시일 

AND LP.DOC_ST = '1' # 확정 

GROUP BY LP.ITEM_CD 

)  WO ON B.ITEMCHILD_CD = WO.ITEM_CD

LEFT OUTER JOIN (

SELECT LP.ITEM_CD

, SUM(LW.WORK_QT) QT

# 생산실적등록 

FROM erp_1234.LWORK LW 

# 생산지시등록마스터 

INNER JOIN erp_1234.LPROD LP 

ON LW.CO_CD = LP.CO_CD

AND LW.WO_CD = LP.WO_CD

WHERE LP.CO_CD = '5550'

AND LP.ORD_DT  <=  '20240411' # 지시일 

AND LP.DOC_ST = '1' # 확정 

AND LW.LAST_YN = '1' # 최종공정 

GROUP BY LP.ITEM_CD 

) WR ON B.ITEMCHILD_CD = WR.ITEM_CD

  

#외주입고예정(외주구분-공정외주의 경우 생산에서 취합됨으로, 품목외주만 계산)

LEFT OUTER JOIN (

#외주발주

SELECT LPD.ITEM_CD 

, COALESCE(SUM(LPD.PO_QT), 0) - COALESCE(SUM(LPD.RCV_QT), 0) AS QT # 발주수량 - 입고수량 

FROM erp_1234.LOS_PO LP 

INNER JOIN erp_1234.LOS_PO_D LPD

ON LP.CO_CD = LPD.CO_CD   

AND LP.PO_NB = LPD.PO_NB   

WHERE LP.CO_CD = '5550'

AND LP.PO_DT  <=  '20240411'

AND LPD.EXPIRE_YN = '1'

AND LP.PO_TY = '1'

GROUP BY LPD.ITEM_CD 

) LOP ON B.ITEMCHILD_CD = LOP.ITEM_CD 

  

# 주문출고예정량   

LEFT OUTER JOIN (

SELECT D.ITEM_CD

, SUM(D.SO_QT) AS QT

# 주문등록마스터 

FROM erp_1234.LSO H

# 주문등록디테일 

INNER JOIN erp_1234.LSO_D D

ON H.CO_CD = D.CO_CD 

AND H.SO_NB = D.SO_NB  

WHERE H.CO_CD = '5550'

AND H.SO_DT  <=  '20240411' # 수주일자

AND D.USE_YN = '1' # 사용여부 

AND D.EXPIRE_YN = '1' # 유효여부('1': 유효_미마감) 

GROUP BY D.ITEM_CD

) SO ON B.ITEMCHILD_CD = SO.ITEM_CD 

LEFT OUTER JOIN (

SELECT H.ITEM_CD

, SUM(H.SO_QT) AS QT

# 출고등록디테일 

FROM erp_1234.LDELIVER_D H

# 주문등록디테일 

INNER JOIN erp_1234.LSO_D SO_D

ON H.CO_CD = SO_D.CO_CD 

AND H.SO_NB = SO_D.SO_NB  

INNER JOIN erp_1234.LSO SO_H

ON SO_D.CO_CD = SO_H.CO_CD

AND SO_D.SO_NB = SO_H.SO_NB 

WHERE SO_H.CO_CD = '5550'

AND SO_H.SO_DT  <=  '20240411' # 수주일자

AND SO_D.USE_YN = '1' # 사용여부 

AND SO_D.EXPIRE_YN = '1' # 유효여부('1': 유효_미마감)

AND H.USE_YN = '1' # 사용여부 

AND H.EXPIRE_YN = '1' # 유효여부('1': 유효_미마감) 

GROUP BY H.ITEM_CD

) LD ON B.ITEMCHILD_CD = LD.ITEM_CD 

  

  

# 자재 할당량 적용 

LEFT OUTER JOIN (

SELECT T.MATL_CD AS ITEM_CD 

, COALESCE(SUM(T.REAL_QT), 0) - COALESCE(SUM(T.ISU_QT), 0) AS QT

FROM (

SELECT LM.MATL_CD  

, LM.REAL_QT #소요수량 

, LM.ISU_QT 

# 생산지시

FROM erp_1234.LPROD LP 

# 생산자시-소요자재 

INNER JOIN erp_1234.LPROD_MATL LM 

ON LP.CO_CD = LM.CO_CD 

AND LP.WO_CD = LM.WO_CD 

WHERE LP.CO_CD = '5550'

AND LP.ORD_DT  <=  '20240411'

AND LP.DOC_ST = '1' # 확정 

UNION ALL 

SELECT LM.MATL_CD

, LM.REAL_QT

, LM.ISU_QT

# 외주발주등록 

FROM erp_1234.LOS_PO LP 

# 외주발주등록-사급자재 

INNER JOIN erp_1234.LOS_PO_MATL LM  

ON LP.CO_CD  = LM.CO_CD

AND LP.PO_NB = LM.PO_NB

WHERE LP.CO_CD = '5550'

AND LP.PO_DT  <=  '20240411'

AND LP.PO_TY = '1'

) T  

GROUP BY T.MATL_CD

) LMR ON B.ITEMCHILD_CD = LMR.ITEM_CD 

  

) T 

WHERE 1=1 

 # 품목 

 # 계정구분 

 # 조달구분

 # 과부족 

ORDER BY LEVEL, BOM_SQ
```

252ms

39122ms -> 252ms 








여러 테이블이 조인되고 있고, JOIN 시점에 keyA, keyB에 대해 인덱스가 걸려있을 때, keyA, keyB, keyC로 JOIN을 하게 되면 어떻게 동작하지 ?

ChatGPT

ChatGPT

keyA와 keyB에 인덱스가 걸려있는 상황에서 keyA, keyB, keyC로 JOIN을 수행하는 경우에는 다음과 같은 과정이 일어날 것입니다:

1. 먼저 keyA와 keyB를 사용하여 조인이 이루어집니다. 이때 인덱스가 걸려있으므로 빠르게 해당 조건을 만족하는 행을 찾을 수 있습니다.
2. 그 다음으로는 keyC를 사용하여 추가적인 조인을 수행합니다. 이때는 keyC에 대한 인덱스가 있는지 여부에 따라 성능이 결정됩니다.
3. keyC에 대한 인덱스가 있는 경우, 해당 인덱스를 활용하여 빠르게 조인을 수행할 수 있습니다. 이는 조인된 결과의 크기가 크거나, keyC의 분포가 넓을 때 특히 유용합니다.
4. 하지만 keyC에 대한 인덱스가 없는 경우, 조인 시에 전체 테이블을 스캔하며 매칭되는 행을 찾아야 합니다. 이는 성능에 부담을 줄 수 있으며, 특히 큰 테이블이 포함된 경우에는 시간이 많이 소요될 수 있습니다.

따라서 keyA와 keyB에 인덱스가 있는 상황에서도 keyC를 사용하여 JOIN을 할 경우, 성능은 keyC에 대한 인덱스의 유무와 관련이 있습니다. 가능하다면 keyC에도 인덱스를 걸어 성능을 최적화할 수 있습니다

keyC에 인덱스가 걸려있지 않다면, 앞의 두 키가 걸려있다 하더라도 성능상에 문제가 있겠네 ?


맞습니다, keyC에 인덱스가 걸려있지 않은 경우에는 성능상 문제가 발생할 수 있습니다. 이는 keyC를 사용하여 조인할 때 전체 테이블을 스캔해야 하므로 성능에 부담이 될 수 있습니다.

만약 keyC에 대한 인덱스를 걸지 않은 이유가 데이터의 특성이나 사용 패턴에 따라 인덱스를 걸 필요성을 느끼지 못했거나 인덱스를 걸었을 때의 이점이 작다고 판단했다면, 다른 방법을 고려해볼 수 있습니다. 예를 들어, 조인을 수행하기 전에 필요한 데이터를 미리 필터링하거나, 효율적인 쿼리 플랜을 구성하여 조인을 최적화할 수 있습니다.

그러나 데이터셋이 크고 조인되는 테이블이 많은 경우에는 인덱스를 적절히 활용하여 성능을 최적화하는 것이 중요합니다. 따라서 가능하다면 keyC에도 인덱스를 걸어 성능을 향상시킬 수 있습니다.