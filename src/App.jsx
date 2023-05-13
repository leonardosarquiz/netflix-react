import './App.css';
import Tmdb from './Tmdb';
import { useEffect, useState } from 'react';
import MovieRow from './components/MovieRow';
import FeaturedMovie from './components/FeaturedMovie';
import Header from './components/Header';
function App() {
  const [movieList, setMovieList] = useState([]);
  const [FeaturedData, setFeaturedData] = useState(null);
  const [blackHeader, setBlackHeader] = useState(false);
  useEffect(() => {
    const loadALL = async () => {
      // pegando a lista total
      let list = await Tmdb.getHomeList();
      setMovieList(list);

      // pegando o featured
      let originals = list.filter((i) => i.slug === 'originals');
      let randomChosen = Math.floor(
        Math.random() * (originals[0].items.results.length - 1),
      );
      let chosen = originals[0].items.results[randomChosen];
      let chosenInfo = await Tmdb.getMovieInfo(chosen.id, 'tv');
      setFeaturedData(chosenInfo);
    };
    loadALL();
  }, []);

  useEffect(() => {
    const scrollListener = () => {
      if (window.scrollY > 10) {
        setBlackHeader(true);
      } else {
        setBlackHeader(false);
      }
    };
    window.addEventListener('scroll', scrollListener);
    return () => {
      window.removeEventListener('scroll', scrollListener);
    };
  }, []);
  return (
    <div className="page">
      <Header black={blackHeader} />
      {FeaturedData && <FeaturedMovie item={FeaturedData} />}

      <section className="lists">
        {movieList.map((item, key) => (
          <MovieRow key={key} title={item.title} items={item.items} />
        ))}
      </section>

      <footer>
        <p>
          Feito com carinho
          <br /> Direitos de imagem para Netflix
          <br /> Dados pegos do site Themoviedb.org
        </p>
      </footer>
      {movieList <= 0 && (
        <div className="loading">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/7/75/Netflix_icon.svg"
            alt="carregando"
          />
        </div>
      )}
    </div>
  );
}

export default App;
