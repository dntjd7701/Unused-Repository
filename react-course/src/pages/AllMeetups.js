import { useEffect, useState } from 'react';
import MeetupList from '../components/meetups/MeetupList';

const AllMeetups = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [meetupData, setMeetupData] = useState([]);

  useEffect(() => {
    fetch('https://react-course-b5931-default-rtdb.firebaseio.com/meetups.json')
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        const meetups = [];
        Object.keys(data).forEach((key) => {
          meetups.push({
            id: key,
            ...data[key],
          });
        });
        if (meetups.length > 0) {
          setIsLoading(false);
          setMeetupData(meetups);
        }
      });
  }, [isLoading]);

  if (isLoading) {
    return (
      <section>
        <p>is Loading...</p>
      </section>
    );
  } else {
    return (
      <section>
        <h1>All Meetups</h1>
        <MeetupList meetup={meetupData} />
      </section>
    );
  }
};

export default AllMeetups;
