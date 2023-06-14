import MeetupItem from './MeetupItem';
import classes from './MeetupList.module.css';

const MeetupList = (props) => {
  return (
    <ul className={classes.list}>
      {props.meetup.map((v) => (
        <MeetupItem key={v.id} {...v} />
      ))}
    </ul>
  );
};

export default MeetupList;
