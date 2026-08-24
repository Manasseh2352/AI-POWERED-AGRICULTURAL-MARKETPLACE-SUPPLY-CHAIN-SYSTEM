import * as ImagePicker from "expo-image-picker";
import { Alert } from "react-native";

type PickOptions = { square?: boolean };

async function launch(
  kind: "camera" | "library",
  opts: PickOptions
): Promise<string | null> {
  // Request the relevant permission first.
  if (kind === "camera") {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      Alert.alert(
        "Camera permission needed",
        "Enable camera access in Settings to take a photo."
      );
      return null;
    }
  } else {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      Alert.alert(
        "Photos permission needed",
        "Enable photo library access in Settings to choose a picture."
      );
      return null;
    }
  }

  const common: ImagePicker.ImagePickerOptions = {
    mediaTypes: ["images"],
    quality: 0.6,
    allowsEditing: true,
    ...(opts.square ? { aspect: [1, 1] as [number, number] } : {}),
  };

  const result =
    kind === "camera"
      ? await ImagePicker.launchCameraAsync(common)
      : await ImagePicker.launchImageLibraryAsync(common);

  if (result.canceled || !result.assets?.length) return null;
  return result.assets[0].uri;
}

export function pickFromLibrary(opts: PickOptions = {}) {
  return launch("library", opts);
}

export function takePhoto(opts: PickOptions = {}) {
  return launch("camera", opts);
}

// Present a Camera / Library choice and resolve with the picked local URI
// (or null if the user cancels or denies permission).
export function chooseImageSource(
  opts: PickOptions = {}
): Promise<string | null> {
  return new Promise((resolve) => {
    Alert.alert(
      "Add photo",
      "Choose a source",
      [
        {
          text: "Take Photo",
          onPress: () => {
            void takePhoto(opts).then(resolve);
          },
        },
        {
          text: "Choose from Library",
          onPress: () => {
            void pickFromLibrary(opts).then(resolve);
          },
        },
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => resolve(null),
        },
      ],
      { cancelable: true, onDismiss: () => resolve(null) }
    );
  });
}
