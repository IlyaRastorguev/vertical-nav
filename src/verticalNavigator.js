import React from "react";
import PropTypes from "prop-types";
import _ from "lodash";

import NavigatorComponent from "./navigatorComponent";
import Selector from "./selector";
import "./styles.css";

class Navigator extends React.Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.element),
      PropTypes.element
    ]).isRequired,
    path: PropTypes.string
  };
  static defaultProps = {
    path: "name"
  };

  constructor(props) {
    super(props);
    this.state = {
      selected: 0
    };
    const refs = [];

    props.children.forEach(() => {
      refs.push(React.createRef());
    });

    this.anchors = refs;
    this.selectorAction = this.selectorAction.bind(this);
    this.contentRef = React.createRef();
    this.stepperRef = React.createRef();
    this.test = this.handleScroll.bind(this);
    this.updateStepperPosition = this.updateStepperPosition.bind(this);
    this.lastContentPosition = 0;
  }

  componentDidMount() {
    window.addEventListener("scroll", this.test);
    window.addEventListener("scroll", this.updateStepperPosition);
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.test);
    window.removeEventListener("scroll", this.updateStepperPosition);
  }

  getSelectors() {
    return this.names.map((i, index) => (
      <Selector
        name={i}
        callback={this.selectorAction}
        index={index}
        className={`step ${this.state.selected === index &&
          "selected"} ellipsis`}
      />
    ));
  }

  getScrollDirection() {
    const contentCoords = this.contentRef.current.getBoundingClientRect();

    if (contentCoords.top < this.lastContentPosition) {
      this.lastContentPosition = contentCoords.top;
      return "UP";
    } else {
      this.lastContentPosition = contentCoords.top;
      return "DOWN";
    }
  }

  handleScroll() {
    const nextSelectedUp = this.anchors[this.state.selected - 1]
      ? this.anchors[this.state.selected - 1].current.getBoundingClientRect()
      : this.anchors[0].current.getBoundingClientRect();
    const nextSelectedDown = this.anchors[this.state.selected + 1]
      ? this.anchors[this.state.selected + 1].current.getBoundingClientRect()
      : this.anchors[this.anchors.length - 1].current.getBoundingClientRect();
    const direction = this.getScrollDirection();

    console.warn(direction);

    if (nextSelectedDown.top < window.innerHeight && direction === "UP") {
      this.setState({
        selected:
          this.state.selected !== this.anchors.length - 1
            ? this.state.selected + 1
            : this.anchors.length - 1
      });
    } else if (nextSelectedUp.bottom > 0 && direction === "DOWN") {
      this.setState({
        selected: this.state.selected - 1 > 0 ? this.state.selected - 1 : 0
      });
    }

    return true;
  }

  updateStepperPosition() {
    const contentTopPosition = this.contentRef.current.getBoundingClientRect()
      .top;
    const contentBottomPosition = this.contentRef.current.getBoundingClientRect()
      .bottom;

    if (contentBottomPosition <= this.stepperRef.current.clientHeight) {
      this.stepperRef.current.classList.remove("fixed");
      this.stepperRef.current.classList.add("bottom");
    } else if (contentTopPosition <= 0) {
      this.stepperRef.current.classList.add("fixed");
      this.stepperRef.current.classList.remove("bottom");
    } else {
      this.stepperRef.current.classList.remove("fixed");
      this.stepperRef.current.classList.remove("bottom");
    }
  }

  selectorAction(i) {
    this.anchors[i].current.scrollIntoView({
      block: "start",
      inline: "end",
      behavior: "smooth"
    });

    this.setState({
      selected: i
    });
  }

  wrapComponents(components, selectedStyle = {}) {
    const names = [];
    const wrappedComponents = components.map((i, index) => {
      names.push(_.get(i, `props.${this.props.path}`, ""));

      return (
        <NavigatorComponent
          anchorRef={this.anchors[index]}
          style={index === this.state.selected ? selectedStyle : {}}
        >
          {i}
        </NavigatorComponent>
      );
    });

    this.names = names;
    return wrappedComponents;
  }

  render() {
    return (
      <div className="navigator">
        <div className="content" ref={this.contentRef}>
          {this.wrapComponents(this.props.children)}
        </div>
        <div className="stepper-wrapper">
          <div className="stepper" ref={this.stepperRef}>
            {this.getSelectors()}
          </div>
        </div>
      </div>
    );
  }
}

export default Navigator;
