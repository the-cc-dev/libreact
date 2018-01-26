import {Component, Children} from 'react';
import {h, noop} from '../util';
const screenfull = require('screenfull');

export interface IFullScreenProps {
  children?;
  video?: HTMLVideoElement;
  innerRef?: (el) => void;
  on?: boolean;
  onClose?: () => void;
  tag?: keyof React.ReactHTML;
}

export interface IFullScreenState {

}

export class FullScreen extends Component<IFullScreenProps, IFullScreenState> {
  static defaultProps = {
    onClose: noop,
    innerRef: noop,
    tag: 'div'
  };

  el: HTMLElement = null;

  ref = (el) => {
    this.el = el;
    this.props.innerRef(el);
  };

  componentDidMount () {
    screenfull.on('change', this.onChange);
  }

  componentDidUpdate (props) {
    if (!props.on && this.props.on) {
      this.enter();
    } else if (props.on && !this.props.on) {
      this.leave();
    }
  }

  componentWillUnmount () {
    screenfull.off('change', this.onChange);
  }

  enter () {
    if (this.el && screenfull.enabled) {
      try {
        screenfull.request(this.el);
      } catch {}
    }
  }

  leave () {
    try {
      screenfull.exit();
    } catch {}
  }

  onChange = () => {
    const isFullScreen = screenfull.element === this.el;

    if (!isFullScreen) {
      (this.props.onClose || noop)();
    }
  };

  render () {
    const {video, innerRef, on, onClose, tag, children, ...rest} = this.props;

    (rest as any).ref = this.ref;

    return h(tag, rest, ...Children.toArray(children));
  }
}
