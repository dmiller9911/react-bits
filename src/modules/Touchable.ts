// tslint:disable
import * as React from 'react';
import * as PropTypes from 'prop-types';
import * as TimerMixin from 'react-timer-mixin';
import * as createReactClass from 'create-react-class';
import {
  GestureResponderEvent,
  LayoutChangeEvent,
  StyleSheet as StyleSheetRN,
  Animated as AnimatedRN,
} from 'react-native';
import { throttle } from '../util/throttle';
import { PlatformStatic } from './Platform';

const ensurePositiveDelayProps = (_props: any) => {
  // invariant(
  //   !(props.delayPressIn < 0 || props.delayPressOut < 0 || props.delayLongPress < 0),
  //   'Touchable components cannot have negative delay properties'
  // );
};

export interface InsetProp {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

const InsetPropType = PropTypes.shape({
  top: PropTypes.number,
  left: PropTypes.number,
  bottom: PropTypes.number,
  right: PropTypes.number,
});

/**
 * A wrapper for making views respond properly to touches.
 * On press down, the opacity of the wrapped view is decreased, dimming it.
 * This is done without actually changing the view hierarchy, and in general is
 * easy to add to an app without weird side-effects.
 *
 * Example:
 *
 * ```
 * renderButton: function() {
 *   return (
 *     <Touchable press={anim} onPress={this._onPressButton}>
 *       <Image
 *         style={styles.button}
 *         source={require('image!myButton')}
 *       />
 *     </Touchable>
 *   );
 * },
 * ```
 */

export type PressEvent = GestureResponderEvent | React.MouseEvent<any>;

export interface TouchableProps {
  accessible?: boolean;
  disabled?: boolean;
  onPress?(event: PressEvent): void;
  onPressIn?(event: PressEvent): void;
  onPressOut?(event: PressEvent): void;
  onLongPress?(event: PressEvent): void;
  onLayout?(event: LayoutChangeEvent): void;
  /**
   * Delay in ms, from the start of the touch, before onPressIn is called.
   */
  delayPressIn?: number;
  /**
   * Delay in ms, from the release of the touch, before onPressOut is called.
   */
  delayPressOut?: number;
  /**
   * Delay in ms, from onPressIn, before onLongPress is called.
   */
  delayLongPress?: number;
  /**
   * When the scroll view is disabled, this defines how far your touch may
   * move off of the button, before deactivating the button. Once deactivated,
   * try moving it back and you'll see that the button is once again
   * reactivated! Move it back and forth several times while the scroll view
   * is disabled. Ensure you pass in a constant to reduce memory allocations.
   */
  pressRetentionOffset?: InsetProp;
  /**
   * This defines how far your touch can start away from the button. This is
   * added to `pressRetentionOffset` when moving off of the button.
   * ** NOTE **
   * The touch area never extends past the parent view bounds and the Z-index
   * of sibling views always takes precedence if a touch hits two overlapping
   * views.
   */
  hitSlop?: InsetProp;
  activeValue?: number;
  press?: typeof AnimatedRN['Value'];
  pressDuration?: number;
  children?: React.ReactNode;
}

export type TouchableStatic = React.ComponentClass<TouchableProps>;

export const createTouchable = (
  Animated: typeof AnimatedRN,
  StyleSheet: typeof StyleSheetRN,
  Platform: PlatformStatic,
  TouchableMixin: any,
): React.ComponentClass<TouchableProps> => {
  const styles = StyleSheet.create({
    touchable: Platform.select({
      web: {
        cursor: 'pointer',
      },
      ios: {},
      android: {},
      sketch: {},
      vr: {},
    }),
  });

  const propTypes: PropTypes.ValidationMap<TouchableProps> = {
    accessible: PropTypes.bool,
    disabled: PropTypes.bool,
    onPress: PropTypes.func,
    onPressIn: PropTypes.func,
    onPressOut: PropTypes.func,
    onLayout: PropTypes.func,
    onLongPress: PropTypes.func,
    delayPressIn: PropTypes.number,
    delayPressOut: PropTypes.number,
    delayLongPress: PropTypes.number,
    pressRetentionOffset: InsetPropType,
    hitSlop: InsetPropType,
    activeValue: PropTypes.number,
    press: PropTypes.instanceOf(Animated.Value),
    pressDuration: PropTypes.number,
    children: PropTypes.node,
  };

  return createReactClass({
    propTypes,
    displayName: 'Touchable',

    mixins: [TimerMixin, TouchableMixin],

    statics: {
      Mixin: TouchableMixin,
    },

    getDefaultProps() {
      return {
        activeValue: 1,
        delayPressIn: 0,
        delayPressOut: 100,
        delayLongPress: 500,
        pressDuration: 150,
        pressRetentionOffset: {
          top: 20,
          left: 20,
          right: 20,
          bottom: 30,
        },
        press: new Animated.Value(0),
      };
    },

    getInitialState() {
      return this.touchableGetInitialState();
    },

    componentDidMount() {
      ensurePositiveDelayProps(this.props);
    },

    componentWillReceiveProps(nextProps: TouchableProps) {
      ensurePositiveDelayProps(nextProps);
    },

    setPressValue(toValue: number) {
      Animated.timing(
        this.props.press,
        {
          toValue,
          duration: this.props.pressDuration,
          // easing: Easing.inOut(Easing.quad),
        },
      ).start();
    },

    /**
     * `Touchable.Mixin` self callbacks. The mixin will invoke these if they are
     * defined on your component.
     */
    touchableHandleActivePressIn: throttle(function(e: PressEvent) {
      if ((e as any).dispatchConfig && (e as any).dispatchConfig.registrationName === 'onResponderGrant') {
        this._setActive(0);
      } else {
        this._setActive(150);
      }
      this.props.onPressIn && this.props.onPressIn(e);
    }),

    touchableHandleActivePressOut: throttle(function(e: PressEvent) {
      this._setInactive(250);
      this.props.onPressOut && this.props.onPressOut(e);
    }),

    touchableHandlePress: throttle(function(e: PressEvent) {
      this.props.onPress && this.props.onPress(e);
    }),

    touchableHandleLongPress: throttle(function(e: PressEvent) {
      this.props.onLongPress && this.props.onLongPress(e);
    }),

    touchableGetPressRectOffset() {
      return this.props.pressRetentionOffset;
    },

    touchableGetHitSlop() {
      return this.props.hitSlop;
    },

    touchableGetHighlightDelayMS() {
      return this.props.delayPressIn;
    },

    touchableGetLongPressDelayMS() {
      return this.props.delayLongPress;
    },

    touchableGetPressOutDelayMS() {
      return this.props.delayPressOut;
    },

    _setActive(duration: number) {
      this.setPressValue(1, duration);
    },

    _setInactive(duration: number) {
      this.setPressValue(0, duration);
    },

    render() {
      const child = this.props.children;
      const childStyle = child && child.props && child.props.style;
      return React.cloneElement(child, {
        onStartShouldSetResponder: this.touchableHandleStartShouldSetResponder,
        onResponderTerminationRequest: this.touchableHandleResponderTerminationRequest,
        onResponderGrant: this.touchableHandleResponderGrant,
        onResponderMove: this.touchableHandleResponderMove,
        onResponderRelease: this.touchableHandleResponderRelease,
        onResponderTerminate: this.touchableHandleResponderTerminate,
        style: [
          styles.touchable,
          childStyle,
        ],
      });
    },
  });
};
