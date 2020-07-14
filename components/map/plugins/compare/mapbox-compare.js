import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import syncMove from '@mapbox/mapbox-gl-sync-move';
import EventEmitter from 'events';

class MapboxCompare extends PureComponent {
  static propTypes = {
    options: PropTypes.object,
    swiper: PropTypes.object,
    leftRef: PropTypes.object,
    rightRef: PropTypes.object
  }

  static defaultProps = {
    options: {},
    swiper: null,
    leftRef: null,
    rightRef: null
  }

  componentDidMount() {
    this._swiper = this.props.swiper ? this.props.swiper.current : null;
    this._leftRef = this.props.leftRef ? this.props.leftRef : null;
    this._rightRef = this.props.rightRef ? this.props.rightRef : null;
    this._options = this.props.options || {};
    this._isHorizontal = this._options.orientation === 'horizontal';
    this._ev = new EventEmitter();

    this._bounds = this._rightRef ? this._rightRef.getContainer().getBoundingClientRect() : {};

    if (this._swiper) this._init();
  }

  componentWillUnmount() {
    this._rightRef.off('resize', this._onResize);

    if (this._options && this._options.mousemove) {
      this._leftRef.getContainer().removeEventListener('mousemove', this._onMove);
      this._rightRef.getContainer().removeEventListener('mousemove', this._onMove);
    }

    this._swiper.removeEventListener('mousedown', this._onDown);
    this._swiper.removeEventListener('touchstart', this._onDown);
  }

  _init = () => {
    const { options: { swiper } } = this.props;
    const swiperPosition = (this._horizontal ? this._bounds.height : this._bounds.width) / 2;
    this._setPosition(swiperPosition);
    syncMove(this._leftRef, this._rightRef);

    this._rightRef.on('resize', this._onResize);

    if (this.options && this.options.mousemove) {
      this._leftRef.getContainer().addEventListener('mousemove', this._onMove);
      this._rightRef.getContainer().addEventListener('mousemove', this._onMove);
    }

    this._swiper.addEventListener('mousedown', this._onDown);
    this._swiper.addEventListener('touchstart', this._onDown);

    if (swiper) {
      const { offset } = swiper;
      this._swiper.style.height = `calc(100% - ${offset}px)`;
    }
  }

  _setPointerEvents = (v) => {
    this._swiper.style.pointerEvents = v;
  }

  _onDown = (evt) => {
    if (evt.touches) {
      document.addEventListener('touchmove', this._onMove);
      document.addEventListener('touchend', this._onTouchEnd);
    } else {
      document.addEventListener('mousemove', this._onMove);
      document.addEventListener('mouseup', this._onMouseUp);
    }
  }

  _setPosition = (x) => {
    const _x = Math.min(x, this._horizontal
      ? this._bounds.height
      : this._bounds.width);
    const pos = this._horizontal
      ? `translate(0, ${x}px)`
      : `translate(${x}px, 0)`;
    this._swiper.style.transform = pos;
    this._swiper.style.left = 0;
    const clip = this._horizontal
      ? `rect(${x}px, 999em, ${this._bounds.width}px, 0)`
      : `rect(0, 999em, ${this._bounds.height}px, ${x}px)`;
    this._rightRef.getContainer().style.clip = clip;
    this.currentPosition = _x;
  }

  _onMove = (evt) => {
    if (this.options && this.options.mousemove) {
      this._setPointerEvents(evt.touches ? 'auto' : 'none');
    }

    if (this._horizontal) this._setPosition(this._getY(evt));
    else this._setPosition(this._getX(evt));
  }

  _onMouseUp = () => {
    document.removeEventListener('mousemove', this._onMove);
    document.removeEventListener('mouseup', this._onMouseUp);
    this.fire('slideend', { currentPosition: this.currentPosition });
  }

  _onTouchEnd = () => {
    document.removeEventListener('touchmove', this._onMove);
    document.removeEventListener('touchend', this._onTouchEnd);
  }

  _onResize = () => {
    this._bounds = this._rightRef.getContainer().getBoundingClientRect();
    if (this.currentPosition) this._setPosition(this.currentPosition);
  }

  _getX = (e) => {
    const _e = e.touches ? e.touches[0] : e;
    let x = _e.clientX - this._bounds.left;
    if (x < 0) x = 0;
    if (x > this._bounds.width) x = this._bounds.width;
    return x;
  }

  _getY = (e) => {
    const _e = e.touches ? e.touches[0] : e;
    let y = _e.clientY - this._bounds.top;
    if (y < 0) y = 0;
    if (y > this._bounds.height) y = this._bounds.height;
    return y;
  }

  on = (type, fn) => {
    this._ev.on(type, fn);
    return this;
  }

  fire = (type, data) => {
    this._ev.emit(type, data);
    return this;
  }

  off = (type, fn) => {
    this._ev.removeListener(type, fn);
    return this;
  }

  render() {
    return null;
  }
}

export default MapboxCompare;
