import { useContext } from 'react';
import FavoritesContext from '../store/FavoritesContext';
import MeetupList from '../components/meetups/MeetupList';

const Favorites = () => {
  const favoritesCxt = useContext(FavoritesContext);
  const content = favoritesCxt.favoriteCnt ? (
    <MeetupList meetup={favoritesCxt.favorites} />
  ) : (
    <p>You got no favorites yet. Start adding some?</p>
  );

  return (
    <section>
      <h1>My Favorites</h1>
      {content}
    </section>
  );
};

export default Favorites;
