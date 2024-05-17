
> DB 컬럼 타입은 Blob인데 왜 byte[] 로 변환할까 ? 

MyBatis의 typeHandlers에서 Java의 byte[]를 JDBC의 BLOB 타입으로의 매핑이 자동으로 지원된다. 
