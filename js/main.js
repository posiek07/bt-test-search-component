const apiKey = '43a30ec4644c4472968a71804728a964';

// Card Component for quicker development experience. For lower bundle size can be rewritten in css/html bootstrap. I personally use them quaite often (also love React Native) as for other compenent in package the logic behind bootrap is out of box without jQuery.

const BS = ReactBootstrap; // react-bootsrap import

const Card = ({ author, title, description, imageUrl, link }) => (
  <BS.Card className="mt-3 mb-3">
    <BS.Card.Img
      variant="top"
      fluid="true"
      src={imageUrl}
      style={{ height: '37%' }}
    />
    <BS.Card.Header>{author}</BS.Card.Header>
    <BS.Card.Body>
      <BS.Card.Title>{title}</BS.Card.Title>
      <BS.Card.Text>{description}</BS.Card.Text>
      <BS.Button
        variant="primary"
        onClick={() => window.open(link, '_blank')}
        disabled={link === ''}
      >
        Read more
      </BS.Button>
    </BS.Card.Body>
  </BS.Card>
);

// Main App component

const { useState, useEffect } = React; // react hooks import

const App = props => {
  //State
  const [fetchedNews, setFetchedNews] = useState();
  const [keyword, setKeyword] = useState('apple');
  const [loading, setLoading] = useState(false);

  //Handlers
  const shortDescriptionHandler = (description, maxLenght) =>
    description.slice(0, maxLenght) + '...';

  const fetchData = async () => {
    try {
      keyword !== '' && setLoading(true);
      const feedData = await fetch(
        `https://newsapi.org/v2/everything?q=${keyword}&pageSize=10&page=1&apiKey=${apiKey}`
      );

      const fetchedResponse = await feedData.json();
      setFetchedNews(fetchedResponse.articles);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  // new component did mount hook
  useEffect(() => {
    // setting timout for limiting requests
    const timeout = setTimeout(fetchData, [700]);

    return () => clearTimeout(timeout);
  }, [keyword]);

  return (
    <div>
      <BS.Container>
        <BS.Form>
          <BS.Form.Group controlId="formGroupEmail">
            <BS.Form.Label>Search you news:</BS.Form.Label>
            <BS.Form.Control
              value={keyword}
              onChange={e => {
                setLoading(true);
                setKeyword(e.target.value);
              }}
              type="email"
              placeholder="Enter email"
            />
          </BS.Form.Group>
        </BS.Form>
        <BS.Row>
          {fetchedNews && !loading ? (
            fetchedNews.map(card => (
              <BS.Col
                xs={12}
                md={6}
                lg={4}
                className="d-flex align-items-stretch"
              >
                <Card
                  title={card.title ? card.title : ''}
                  author={card.author ? card.author : ' s'}
                  description={
                    card.description
                      ? shortDescriptionHandler(card.description, 150)
                      : ''
                  }
                  imageUrl={
                    card.urlToImage ? card.urlToImage : 'assets/no_picture.jpg'
                  }
                  link={card.url ? card.url : ''}
                />
              </BS.Col>
            ))
          ) : keyword !== '' ? (
            <h1>Loading...</h1>
          ) : (
            <h2>Please type something that interest you in search bar</h2>
          )}
        </BS.Row>
      </BS.Container>
    </div>
  );
};

const rootElement = document.getElementById('search-app');
ReactDOM.render(<App />, rootElement);
