
### 명령어 

- crontab -e : crontab의 내용을 생성 및 수정
- crontab -l : 설정된 crontab의 목록 확인
- crontab -r : crontab 파일 삭제(설정된 모든 작업 스케쥴 제거)

### 사용법 

```bash
# 형식 [분] [시간] [일] [월] [요일] "실행할 명령어" 
# [분]: 0 - 59 
# [시간]: 0 - 23 
# [일]: 1 - 31 
# [월]: 1 - 12 
# [요일]: 0 - 6 (0: Sunday, 1: Monday, ... , 6: Saturday) 
ex1. 1 0 * * * /usr/local/bin/python3 /Users/i/Desktop/main.py 
# 이것 같은 경우엔, 매일 0시 1분마다 main.py라는 파이썬 파일을 실행하겠다는 의미. 
ex2. 0 0 15 * * /usr/local/bin/python3 /Users/i/Desktop/main.py 
# 매달 15일 0시 0분에 main.py 파일을 실행하겠다는 의미. 
ex3. * * * * * /usr/local/bin/python3 /Users/i/Desktop/main.py 
# 매 분마다 main.py라는 파일을 실행하겠다는 의미. 
ex4. 20,40 * * * * /usr/local/bin/python3 /Users/i/Desktop/main.py 
# 매 시간 20분, 40분마다 main.py를 실행. -> 1시 20분, 1시 40분, 2시 20분.... 이런 식으로 
ex5, */20 * * * * /usr/local/bin/python3 /Users/i/Desktop/main.py 
# 20분마다 main.py를 실행한다.

++ 
ex6, 50 12 * * 1-5 open /path/Starter.sh
# 월~금, 12시 50분마다 Starter.sh 실행 
```

