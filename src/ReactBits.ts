import {
  Animated,
  Dimensions,
  EasingStatic,
  ImageStatic,
  StyleSheet,
  TextStatic,
  ViewStatic,
} from 'react-native';
import { Platform, PlatformStatic } from './modules/Platform';
import { PixelRatio, PixelRatioStatic } from './modules/PixelRatio';
import { TouchableStatic } from './modules/Touchable';

const hasOwnProperty = Object.prototype.hasOwnProperty;

export type AnimatedStatic = typeof Animated;
export type StyleSheetStatic = typeof StyleSheet;
export type DimensionsStatic = typeof Dimensions;
export {
  ViewStatic,
  TextStatic,
  PixelRatioStatic,
  PlatformStatic,
  ImageStatic,
  TouchableStatic,
  EasingStatic,
};

export interface InjectStatic {
  (api: Partial<ReactBitsStatic>): void;
}

export interface ReactBitsStatic {
  Animated: AnimatedStatic;
  Dimensions: DimensionsStatic;
  Easing: EasingStatic;
  Image: ImageStatic;
  PixelRatio: PixelRatioStatic;
  Platform: PlatformStatic;
  StyleSheet: StyleSheetStatic;
  Text: TextStatic;
  Touchable: TouchableStatic;
  View: ViewStatic;
  inject: InjectStatic;
}

export const ReactBits: ReactBitsStatic = {
  Platform,
  PixelRatio,
  StyleSheet: null,
  View: null,
  Text: null,
  Image: null,
  Touchable: null,
  Easing: null,
  Animated: null,
  Dimensions: null,
  inject: (api) => {
    Object.keys(api).forEach((key: keyof ReactBitsStatic) => {
      ReactBits;
      if (hasOwnProperty.call(ReactBits ,key) && key !== 'Platform') {
        ReactBits[key] = api[key];
      }
    });

    if (api.Platform) {
      ReactBits.Platform.inject(api.Platform);
    }
  },
};
