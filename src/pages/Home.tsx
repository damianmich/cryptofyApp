import { Fragment } from "react";
import CSSTransition from "react-transition-group/CSSTransition";

const Home = () => {
  return (
    <Fragment>
      <CSSTransition timeout={1000} classNames="fade">
        <h1 className={"home"}>
          Welcome. <br />
          Please login or create a new account
        </h1>
      </CSSTransition>
    </Fragment>
  );
};

export default Home;
