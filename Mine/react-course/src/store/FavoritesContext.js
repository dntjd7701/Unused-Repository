import { createContext, useEffect, useState } from 'react';

const FavoritesContext = createContext({
  favoriteCnt: 0,
  favorites: [],
  addFavoriteHandler: (favorite) => {}, //추가적인 검증?을 할 수 있다 ?
  removeFavoriteHandler: (meetupId) => {},
  itemIsFavoritesHandler: (meetupId) => {},
});

export const FavoritesProvider = (props) => {
  const [favorites, setFavorites] = useState([]);

  const addFavoriteHandler = (favorite) => {
    setFavorites((prevFavorites) => {
      return prevFavorites.concat(favorite);
    });
  };

  const removeFavoriteHandler = (meetupId) => {
    setFavorites((prevFavorites) => {
      return prevFavorites.filter((v) => v.id !== meetupId);
    });
  };

  const itemIsFavoritesHandler = (meetupId) => {
    return favorites.some((v) => v.id === meetupId);
  };

  const context = {
    favoriteCnt: favorites.length,
    favorites,
    addFavoriteHandler,
    removeFavoriteHandler,
    itemIsFavoritesHandler,
  };

  return (
    <FavoritesContext.Provider value={context}>
      {props.children}
    </FavoritesContext.Provider>
  );
};

export default FavoritesContext;
