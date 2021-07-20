use webdb;
show tables;

-- emaillist01
desc emaillist01;
select first_name, last_name, email from emaillist01 order by no;

-- guestbook
desc guestbook;
select * from guestbook;
select no, name, password, message, date_format(reg_date, "%Y/%m/%d") as regDate from guestbook order by no desc;

-- user
desc user;
select * from user where role="ADMIN";
select * from user where no = 1;
select * from user;

delete from user where name="testUser";

-- board
use webdb;
desc board;
select * from board;
truncate table board;
insert into board values(null, 'test2', 'test2', now(), 0, null, null, null, 9);

-- gallery
desc gallery;
select * from gallery;


-- admin
use webdb;

show tables;

desc site;
select * from site;

create table site1(
	no int(11) primary key, 
	title varchar(200) not null  )



SELECT `Board`.`no`, `Board`.`title`, `Board`.`contents`, `Board`.`reg_date` 
AS `regDate`, `Board`.`hit`, `Board`.`group_no` AS `groupNo`, `Board`.`order_no` 
AS `orderNo`, `Board`.`depth`, `Board`.`user_no` AS `userNo`, `Board`.`user_no` 
AS `UserNo`, `User`.`no` AS `User.no`, `User`.`name` 
AS `User.name`, `User`.`email` AS `User.email`, `User`.`password` 
AS `User.password`, `User`.`gender` AS `User.gender`, `User`.`role` 
AS `User.role` 
FROM `board` AS `Board` LEFT OUTER JOIN `user` AS `User` 
ON `Board`.`user_no` = `User`.`no` 
WHERE `Board`.`user_no` = 24;


SELECT `Board`.`no`, `Board`.`title`, `Board`.`contents`, `Board`.`reg_date` AS `regDate`, 
`Board`.`hit`, `Board`.`group_no` AS `groupNo`, `Board`.`order_no` AS `orderNo`, `Board`.`depth`, `Board`.`user_no` AS `userNo`, `
Board`.`user_no` AS `UserNo`, `User`.`no` AS `User.no`, `User`.`name` AS `User.name`, `User`.`email` AS `User.email`,
 `User`.`password` AS `User.password`, `User`.`gender` AS `User.gender`, `User`.`role` AS `User.role` 
 FROM `board` AS `Board` INNER JOIN `user` AS `User` 
 ON `Board`.`user_no` = `User`.`no` 
 WHERE `Board`.`user_no` = 25;