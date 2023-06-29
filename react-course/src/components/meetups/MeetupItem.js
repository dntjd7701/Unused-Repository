import { useContext } from 'react';
import Card from '../ui/Card';
import classes from './MeetupItem.module.css';
import FavoritesContext from '../../store/FavoritesContext';

const MeetupItem = (props) => {
  const favoritesCxt = useContext(FavoritesContext);
  const itemIsInFavorites = favoritesCxt.itemIsFavoritesHandler(props.id);
  const toggleFavoriteBtn = () => {
    if (itemIsInFavorites) {
      favoritesCxt.removeFavoriteHandler(props.id);
    } else {
      favoritesCxt.addFavoriteHandler({
        id: props.id,
        image: props.image,
        title: props.title,
        address: props.address,
        description: props.description,
      });
    }
  };

  return (
    <li className={classes.item}>
      <Card>
        <div className={classes.image}>
          <img src={props.image} alt={props.title} />
        </div>
        <div className={classes.content}>
          <h3>{props.title}</h3>
          <address>{props.address}</address>
          <p>{props.description}</p>
        </div>
        <div className={classes.actions}>
          <button onClick={toggleFavoriteBtn}>
            {itemIsInFavorites ? 'Remove Favorite' : 'Add Favorite'}
          </button>
        </div>
      </Card>
    </li>
  );
};

export default MeetupItem;
