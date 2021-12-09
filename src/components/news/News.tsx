import { List } from "antd";
import { useSelector } from "react-redux";
import { RootState } from "../../store";

const News = () => {
  const newsList = useSelector(
    (state: RootState) => state.cryptocurrencies.newsData
  );

  return (
    <List
      itemLayout="vertical"
      size="large"
      pagination={{
        pageSize: 3,
      }}
      dataSource={newsList}
      renderItem={(item: typeof newsList) => (
        <List.Item
          key={item.title}
          extra={<img width={272} alt={"img"} src={item.imgURL} />}
        >
          <List.Item.Meta
            title={
              <a href={item.link} target="_blank">
                {item.title}{" "}
              </a>
            }
            description={item.feedDate}
          />
          {item.description}
        </List.Item>
      )}
    />
  );
};

export default News;
