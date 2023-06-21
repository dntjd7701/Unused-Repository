import { useHistory } from 'react-router-dom';
import NewMeetupForm from '../components/meetups/NewMeetupForm';
import { useEffect } from 'react';

const NewMeetup = () => {
  const history = useHistory();
  const onAddMeetupHandler = (data) => {
    fetch(
      'https://react-course-b5931-default-rtdb.firebaseio.com/meetups.json',
      {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          'Content-type': 'application/json',
        },
      }
    ).then(() => {
      history.replace('/');
    });
  };

  return (
    <section>
      <h1>New Meetup</h1>
      <NewMeetupForm onAddMeetup={onAddMeetupHandler} />
    </section>
  );
};

export default NewMeetup;
