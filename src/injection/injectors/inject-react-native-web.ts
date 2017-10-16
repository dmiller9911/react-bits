import { ReactBits } from '../../ReactBits';
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  Platform,
  StyleSheet,
  Text,
  Touchable,
  View,
} from 'react-native-web';
import { createTouchable } from '../../modules/Touchable';
import StyleRegistry from 'react-native-web/dist/apis/StyleSheet/registry';

const emptyObject = {};

const resolve = (style: any) => {
  return StyleRegistry.resolve(style) || emptyObject;
};

ReactBits.inject({
  View,
  Text,
  Image,
  Easing,
  Animated,
  Dimensions,
  StyleSheet: {
    ...StyleSheet,
    resolve,
  } as any,
  Platform: {
    OS: Platform.OS,
    Version: Platform.Version,
  },
  Touchable: createTouchable(
    Animated,
    StyleSheet,
    Platform,
    Touchable.Mixin,
  ),
});
