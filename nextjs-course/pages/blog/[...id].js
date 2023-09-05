const BlogPage = () => {
  // /blog/a/b/c 와 같이 하나의 deps가 아니라 여러 deps여도 모두 허용한다. 
  // spread가 없을 경우. /blog/a/b/c로 접근 시, 오류 발생. /blog/a 와 같이 하나의 deps만 인정된다.

  return <h1>The BlogPage !</h1>;
}; 

export default BlogPage;
