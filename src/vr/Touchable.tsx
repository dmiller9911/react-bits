// tslint:disable
import * as React from 'react';
import * as PropTypes from 'prop-types';
import * as createReactClass from 'create-react-class';
import { VrButton } from 'react-vr';
import { StyleSheetStatic, AnimatedStatic, PlatformStatic } from '../ReactBits';
import { TouchableStatic, TouchableProps, PressEvent } from '../modules/Touchable';
import { StyleSheet as RNStyleSheet, Animated as RNAnimated } from 'react-native';
import { throttle } from '../util/throttle';

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
export const createTouchable = (Animated: AnimatedStatic): TouchableStatic => {
  return createReactClass({
    displayName: 'Touchable',
    propTypes: {
      accessible: PropTypes.bool,

      // TODO:
      // accessibilityComponentType: PropTypes.oneOf(View.AccessibilityComponentType),
      // accessibilityTraits: PropTypes.oneOfType([
      //   PropTypes.oneOf(View.AccessibilityTraits),
      //   PropTypes.arrayOf(PropTypes.oneOf(View.AccessibilityTraits)),
      // ]),
      /**
       * If true, disable all interactions for this component.
       */
      disabled: PropTypes.bool,
      /**
       * Called when the touch is released, but not if cancelled (e.g. by a scroll
       * that steals the responder lock).
       */
      onPress: PropTypes.func,
      onPressIn: PropTypes.func,
      onPressOut: PropTypes.func,
      /**
       * Invoked on mount and layout changes with
       *
       *   `{nativeEvent: {layout: {x, y, width, height}}}`
       */
      onLayout: PropTypes.func,

      onLongPress: PropTypes.func,

      /**
       * Delay in ms, from the start of the touch, before onPressIn is called.
       */
      delayPressIn: PropTypes.number,
      /**
       * Delay in ms, from the release of the touch, before onPressOut is called.
       */
      delayPressOut: PropTypes.number,
      /**
       * Delay in ms, from onPressIn, before onLongPress is called.
       */
      delayLongPress: PropTypes.number,
      /**
       * When the scroll view is disabled, this defines how far your touch may
       * move off of the button, before deactivating the button. Once deactivated,
       * try moving it back and you'll see that the button is once again
       * reactivated! Move it back and forth several times while the scroll view
       * is disabled. Ensure you pass in a constant to reduce memory allocations.
       */
      pressRetentionOffset: InsetPropType,
      /**
       * This defines how far your touch can start away from the button. This is
       * added to `pressRetentionOffset` when moving off of the button.
       * ** NOTE **
       * The touch area never extends past the parent view bounds and the Z-index
       * of sibling views always takes precedence if a touch hits two overlapping
       * views.
       */
      hitSlop: InsetPropType,
      activeValue: PropTypes.number,
      press: PropTypes.instanceOf(Animated.Value),

      pressDuration: PropTypes.number,
      children: PropTypes.node,
    },

    mixins: [],

    statics: {
      Mixin: null,
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


    touchableHandleActivePressIn: throttle(function(e: PressEvent) {
      this._setActive(150);
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

    _setActive(duration: number) {
      this.setPressValue(1, duration);
    },

    _setInactive(duration: number) {
      this.setPressValue(0, duration);
    },

    render() {
      const child = this.props.children;
      return (
        <VrButton
          accessible={this.props.accessible}
          disabled={this.props.disabled}
          onLayout={this.props.onLayout}
          onButtonPress={this.touchableHandleActivePressIn}
          onButtonRelease={this.touchableHandleActivePressOut}
          onClick={this.touchableHandlePress}
          onLongClick={this.touchableHandleLongPress}
        >
          {child}
        </VrButton>
      );
    },
  });
};
