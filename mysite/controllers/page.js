//1. 페이징을 위한 기본 데이터 계산
// totalCount => length로 계산. 
module.exports = {
  check : (boardLength, currentPage, keyword) => {
var LIST_SIZE = 3; // 원하는 페이지 당 리스트의 수 
var PAGE_SIZE = 5; // 원하는 페이지의 수 (1~5, 6~10)


// Board의 length, 즉 board의 갯수 
//
const totalCount = (boardLength) => { boardLength };
const currentPage = (currentPage) => { currentPage };
// 필요한 페이지의 수 
const pageCount = Math.ceil(totalCount/LIST_SIZE);

// 현재 블럭을 나타내는 수 (1~5 => 1block, 6~10 => 2block)
const blockCount = Math.ceil(pageCount/PAGE_SIZE);

// 현재 블럭 
const currentBlock = Math.ceil(currentPage / PAGE_SIZE );

				
/**
 *  2. 파라미터 page 값 검증. 
 */

if(currentPage > pageCount) {
	currentPage = pageCount;
	currentBlock = Math.ceil(currentPage / PAGE_SIZE );
}
	
if(currentPage < 1) {
	currentPage = 1;
	currentBlock = 1;
}
		
/**
*  3. view에서 페이지 리스트를 렌더링 하기위한 데이터 값 계산  
*/
//3. view에서 페이지 리스트를 렌더링 하기위한 데이터 값 계산

const beginPage = currentBlock == 0 ? 1 : (currentBlock - 1) * PAGE_SIZE + 1;
const prevPage = ( currentBlock > 1 ) ? ( currentBlock - 1 ) * PAGE_SIZE : 0;
const nextPage = ( currentBlock < blockCount ) ? currentBlock * PAGE_SIZE + 1 : 0;
const endPage = ( nextPage > 0 ) ? ( beginPage - 1 ) + LIST_SIZE : pageCount;

const pager = {
    totalCount : totalCount,
    listSize : LIST_SIZE,
    currentPage : currentPage,
    beginPage : beginPage,
    endPage : endPage,
    prevPage : prevPage,
    nextPage : nextPage,
}

return pager;
    }
}

map.put( "list", list );
		map.put( "totalCount", totalCount );
		map.put( "listSize", LIST_SIZE );
		map.put( "currentPage", currentPage );
		map.put( "beginPage", beginPage );
		map.put( "endPage", endPage );
		map.put( "prevPage", prevPage );
		map.put( "nextPage", nextPage );
		map.put( "keyword", keyword );