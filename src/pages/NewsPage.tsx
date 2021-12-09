import { useEffect } from "react";
import { useDispatch } from "react-redux";
import News from "../components/news/News";
import { fetchNewsData } from "../store/cryptocurrencies-actions";

const NewsPage = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchNewsData());
  }, []);
  return <News />;
};

export default NewsPage;
