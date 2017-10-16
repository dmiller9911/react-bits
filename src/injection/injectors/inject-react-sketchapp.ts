import { ReactBits } from '../../ReactBits';
import * as Animated from 'animated';
import * as Easing from 'animated/lib/Easing';
import {
  View,
  Text,
  Image,
  StyleSheet,
} from 'react-sketchapp';
import { createTouchable } from '../../modules/Touchable';

const TouchableMixin = {
  componentWillUnmount() {},
  touchableGetInitialState() {
    return {
      touchable: {
        touchState: undefined,
        responderID: null,
      } as any,
    };
  },
  touchableHandleResponderTerminationRequest() { return false; },
  touchableHandleStartShouldSetResponder() { return false; },
  touchableLongPressCancelsPress() { return true; },
  touchableHandleResponderGrant() {},
  touchableHandleResponderRelease() {},
  touchableHandleResponderTerminate() {},
  touchableHandleResponderMove() {},
};

Animated.inject.FlattenStyle(StyleSheet.flatten);

ReactBits.inject({
  StyleSheet,
  View,
  Text,
  Image,
  Easing,
  Animated: {
    ...Animated,
    View: Animated.createAnimatedComponent(View),
    Text: Animated.createAnimatedComponent(Text),
    Image: Animated.createAnimatedComponent(Image),
  },
  Platform: {
    OS: 'sketch',
    Version: 1,
  },
});

ReactBits.inject({
  Touchable: createTouchable(
    Animated,
    StyleSheet,
    ReactBits.Platform,
    TouchableMixin,
  ),
});
