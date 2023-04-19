import React, { useState, useEffect } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";

const News = (props) => {
  const [totalResults, setTotalResults] = useState(0);
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const updateNews = async () => {
    props.setProgress(10);
    let url = `https://newsapi.org/v2/top-headlines?country=${props.country}&category=${props.category}&apiKey=${props.apiKey}&page=${page}&pageSize=${props.pageSize}`;

    setLoading(true);
    let data = await fetch(url);
    props.setProgress(30);
    let parsedData = await data.json();
    props.setProgress(70);

    setArticles(parsedData.articles);
    setTotalResults(parsedData.totalResults);
    setLoading(false);
    props.setProgress(100);
  };

  useEffect(() => {
    document.title = `${capitalizeWord(props.category)} | News Express`;
    updateNews();
  }, []);

  // const fetchPreviousNews = () => {
  //   console.log("click prev");
  //   setPage(page - 1);
  //   updateNews();
  // };

  // const fetchNextNews = () => {
  //   console.log("click next");
  //   if (
  //     !(
  //       page + 1 >
  //       Math.ceil(totalResults / props.pageSize)
  //     )
  //   ) {
  //     setPage(page + 1);
  //     updateNews();
  //   }
  // };

  const fetchMoreData = async () => {
    let url = `https://newsapi.org/v2/top-headlines?country=${
      props.country
    }&category=${props.category}&apiKey=${props.apiKey}&page=${
      page + 1
    }&pageSize=${props.pageSize}`;
    setPage(page + 1);
    setLoading(true);
    let data = await fetch(url);
    let parsedData = await data.json();

    setArticles(articles.concat(parsedData.articles));
    setTotalResults(parsedData.totalResults);
    setLoading(false);
  };

  const capitalizeWord = (word) => {
    return `${word.charAt(0).toUpperCase() + word.slice(1)}`;
  };

  return (
    <>
      <div className="container">
        <div className="row">
          <h1 style={{ margin: "70px 0px 0px 0px" }}>
            Top Headlines - {capitalizeWord(props.category)}
          </h1>
        </div>
      </div>
      {loading && <Spinner />}
      <InfiniteScroll
        dataLength={articles.length}
        next={fetchMoreData}
        hasMore={articles.length !== totalResults}
        loader={<Spinner />}
      >
        <div className="container">
          <div className="row">
            {articles.map((news) => {
              let {
                title,
                description,
                url,
                urlToImage,
                author,
                publishedAt,
                source,
              } = news;
              return (
                <div className="col-md-4" key={news.url}>
                  <NewsItem
                    title={title ? title : ""}
                    description={description ? description : ""}
                    author={author}
                    date={publishedAt}
                    source={source ? source.name : "Unknown"}
                    newsUrl={url}
                    imageUrl={urlToImage}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </InfiniteScroll>

      {/* <div className="container d-flex justify-content-between">
          <button
            className="btn btn-dark"
            type="button"
            disabled={page <= 1}
            onClick={fetchPreviousNews}
          >
            {" "}
            &larr; Previous
          </button>
          <button
            className="btn btn-dark"
            type="button"
            disabled={
              page + 1 >
              Math.ceil(totalResults / props.pageSize)
            }
            onClick={fetchNextNews}
          >
            Next &rarr;
          </button>
        </div> */}
    </>
  );
};

News.defaultProps = {
  pageSize: 9,
  country: "in",
  category: "science",
};

News.propTypes = {
  pageSize: PropTypes.number,
  country: PropTypes.string,
  category: PropTypes.string,
  apiKey: PropTypes.string,
};

export default News;
