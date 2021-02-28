const apiKey = 'ab4e7e59e4124d54bb72e2c3fef25476';

// I have used react-bootstrap for quicker development experience.  I personally use npm and cdn packages quaite often (that's why I love React Native also), but there is no reason why this could't be written in normal bootrap for lower bundle size :)

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
  const [error, setError] = useState(false);

  //Handlers
  const shortDescriptionHandler = (description, maxLenght) =>
    description.slice(0, maxLenght) + '...';

  const fetchData = async () => {
    keyword !== '' && setLoading(true);
    await fetch(
      `https://newsapi.org/v2/everything?q=${keyword}&pageSize=10&page=1&apiKey=${apiKey}`
    ).then(async res => {
      const fetchedResponse = await res.json();
      if (res.ok) {
        setFetchedNews(fetchedResponse.articles);
        setLoading(false);
      } else {
        setError(fetchedResponse);
        setLoading(false);
      }
    });
  };

  // new component did mount hook
  useEffect(() => {
    setError(false);
    // setting timout for limiting requests
    const timeout = setTimeout(fetchData, [700]);

    return () => clearTimeout(timeout);
  }, [keyword]);

  return (
    <BS.Container>
      <BS.Form>
        <BS.Form.Group controlId="SearchNews">
          <BS.Form.Label>Search you news:</BS.Form.Label>
          <BS.Form.Control
            value={keyword}
            onChange={e => {
              setLoading(true);
              setKeyword(e.target.value);
            }}
            type="text"
            placeholder="Please search..."
          />
        </BS.Form.Group>
      </BS.Form>
      <BS.Row>
        {fetchedNews && !loading
          ? fetchedNews.map(card => (
              <BS.Col
                xs={12}
                md={6}
                lg={4}
                className="d-flex align-items-stretch"
              >
                <Card
                  title={card.title ? card.title : ''}
                  author={card.author ? card.author : ''}
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
          : keyword !== ''
          ? !error && <h1>Loading...</h1>
          : !error && (
              <h2>Please type something that interest you in search bar</h2>
            )}
      </BS.Row>
      {error && <BS.Alert variant="danger">{error.message}</BS.Alert>}
    </BS.Container>
  );
};

const rootElement = document.getElementById('search-app');
ReactDOM.render(<App />, rootElement);
