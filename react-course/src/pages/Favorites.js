import { useContext } from 'react';
import classes from '../components/meetups/MeetupItem.module.css';
import FavoritesContext from '../store/FavoritesContext';
import Card from '../components/ui/Card';

const Favorites = () => {
  const favoritesCxt = useContext(FavoritesContext);

  return (
    <ul className={classes.list}>
      {favoritesCxt.favorites.map((favorite) => {
        return (
          <li key={favorite.id} className={classes.item}>
            <Card>
              <div className={classes.image}>
                <img src={favorite.image} alt={favorite.title} />
              </div>
              <div className={classes.content}>
                <h3>{favorite.title}</h3>
                <address>{favorite.address}</address>
                <p>{favorite.description}</p>
              </div>
              <div className={classes.actions}>
                <button
                  onClick={() =>
                    favoritesCxt.removeFavoriteHandler(favorite.id)
                  }
                >
                  Remove Favorite
                </button>
              </div>
            </Card>
          </li>
        );
      }) || []}
    </ul>
  );
};

export default Favorites;
