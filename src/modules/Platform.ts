const hasOwnProperty = Object.prototype.hasOwnProperty;
import { PlatformOSType as RNPlatformOSType } from 'react-native';

export type PlatformOSType = RNPlatformOSType | 'sketch' | 'vr' | 'unknown' | 'default';

export interface PlatformStatic {
  OS: PlatformOSType;
  Version: number;
  inject?(platform: PlatformType): void;
  select?<T>(specifics: { [platform in PlatformOSType]?: T; }): T;
}

export interface PlatformType {
  OS: PlatformStatic['OS'];
  Version: PlatformStatic['Version'];
}

export const Platform: PlatformStatic = {
  OS: 'unknown',
  Version: 0,
  select: (obj) => {
    if (hasOwnProperty.call(obj, Platform.OS)) {
      return obj[Platform.OS];
    }
    return obj.default;
  },
  inject: (platform: PlatformType) => {
    Platform.OS = platform.OS;
    Platform.Version = platform.Version;
  },
};
