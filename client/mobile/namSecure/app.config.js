import 'dotenv/config';

export default {
  expo: {
    name: "namSecure",
    slug: "namSecure",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/images/icon.png",
    scheme: "namsecure",
    userInterfaceStyle: "automatic",
    newArchEnabled: true,
      updates: {
          url: "https://u.expo.dev/b8640280-306c-4f24-a6a1-b9018d00112a"
      },
      runtimeVersion: {
          policy: "appVersion"
      },
    ios: {
          config:
          {
            googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY
          },
        infoPlist:
        {
            ITSAppUsesNonExemptEncryption: false,
            NSLocationAlwaysAndWhenInUseUsageDescription: "NamSecure needs your background location to share your position with your team in real-time",
            UIBackgroundModes: ['location']
        },
        icon:
        {
            light: "./assets/images/icon.png",
            dark: "./assets/images/icon.png"
        },
      supportsTablet: true,
      bundleIdentifier: "com.namsecure.app"
    },
    android: {
      adaptiveIcon: {
        backgroundColor: "#E6F4FE",
        foregroundImage: "./assets/images/android-icon-foreground.png",
        backgroundImage: "./assets/images/android-icon-background.png",
        monochromeImage: "./assets/images/android-icon-monochrome.png"
      },
      edgeToEdgeEnabled: true,
      predictiveBackGestureEnabled: false,
      permissions: [
            "android.permission.USE_BIOMETRIC",
            "android.permission.USE_FINGERPRINT",
            "ACCESS_FINE_LOCATION",
            "ACCESS_COARSE_LOCATION",
            "ACCESS_BACKGROUND_LOCATION"
      ],
      package: "com.namsecure.app"
    },
    web: {
      output: "static",
      favicon: "./assets/images/favicon.png"
    },
    plugins:
        [
            [
                "expo-router",
                {
                    "origin": "https://namsecure.app"
                }
            ],
            [
                "expo-notifications",
                {
                    "icon": "./assets/images/icon.png",
                    "color": "#1E88E5",
                    "mode": "default"
                }
            ],
            [
                "expo-splash-screen",
                {
                    image: "./assets/images/icon.png",
                    imageWidth: 200,
                    resizeMode: "contain",
                    backgroundColor: "#eadec6",
                    dark:
                    {
                        backgroundColor: "#eadec6"
                    }
                }
            ],
            /*[
                "expo-apple-authentication",
                {
                    "isRequiredByDefault": false
                }
            ],*/
            [
                "expo-image-picker",
                {
                    "photosPermission": "The app accesses your photos to let you share them with your friends."
                }
            ],
            [
                "expo-local-authentication",
                {
                    "faceIDPermission": "Allow $(PRODUCT_NAME) to use Face ID"
                }
            ],
            [
                "expo-location",
                {
                    locationAlwaysAndWhenInUsePermission: "Allow NameSecure to use your location"
                }
            ],
            "expo-font",
            "expo-web-browser",
            "expo-secure-store"
        ],
    experiments: {
      typedRoutes: true,
      reactCompiler: true
    },
    extra: {
      googleMapsApiKey: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
        "eas": {
            "projectId": "b8640280-306c-4f24-a6a1-b9018d00112a"
        }
    }
  }
};
