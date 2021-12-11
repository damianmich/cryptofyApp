import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import News from "../components/news/News";
import LoadingSpinner from "../components/UI/LoadingSpinner";
import { RootState } from "../store";
import { fetchNewsData } from "../store/cryptocurrencies-actions";

const NewsPage = () => {
  const isLoading = useSelector(
    (store: RootState) => store.cryptocurrencies.isLoading
  );
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchNewsData());
  }, [dispatch]);
  if (isLoading) {
    return <LoadingSpinner />;
  } else return <News />;
};

export default NewsPage;
