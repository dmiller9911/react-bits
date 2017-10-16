import { ReactBits } from '../../ReactBits';
import { createTouchable } from '../../vr/Touchable';
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  View,
} from 'react-vr';

ReactBits.inject({
  Animated,
  Image,
  StyleSheet,
  Text,
  View,
  Platform: {
    OS: 'vr',
    Version: 1,
  },
  Touchable: createTouchable(Animated),
});
