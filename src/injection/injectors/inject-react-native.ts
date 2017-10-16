import { ReactBits } from '../../ReactBits';
import {
  Animated,
  Dimensions,
  Easing,
  Image,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { createTouchable } from '../../modules/Touchable';
import * as Touchable from 'react-native/Libraries/Components/Touchable/Touchable';

ReactBits.inject({
  Animated,
  Dimensions,
  Easing,
  Image,
  StyleSheet,
  Text,
  View,
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
