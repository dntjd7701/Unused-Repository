import NewMeetupForm from '../components/meetups/NewMeetupForm';

const NewMeetup = () => {
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
    );
  };

  return (
    <section>
      <h1>New Meetup</h1>
      <NewMeetupForm onAddMeetup={onAddMeetupHandler} />
    </section>
  );
};

export default NewMeetup;
