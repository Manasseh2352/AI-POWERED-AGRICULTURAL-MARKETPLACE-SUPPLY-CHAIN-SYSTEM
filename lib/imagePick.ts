import * as ImagePicker from "expo-image-picker";

import { toast } from "@/store/toastStore";

type PickOptions = { square?: boolean };

async function launch(
  kind: "camera" | "library",
  opts: PickOptions
): Promise<string | null> {
  // Request the relevant permission first.
  if (kind === "camera") {
    const perm = await ImagePicker.requestCameraPermissionsAsync();
    if (!perm.granted) {
      toast.error(
        "Camera permission needed",
        "Enable camera access in Settings to take a photo."
      );
      return null;
    }
  } else {
    const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!perm.granted) {
      toast.error(
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

// Present a Camera / Library choice as a multi-action toast and resolve with
// the picked local URI (or null if the user cancels, dismisses the toast, or
// denies permission).
export function chooseImageSource(
  opts: PickOptions = {}
): Promise<string | null> {
  return new Promise((resolve) => {
    let settled = false;
    const settle = (value: string | null) => {
      if (settled) return;
      settled = true;
      resolve(value);
    };
    // Once a source is chosen the picker may auto-dismiss while the camera /
    // library is still open — that dismissal must NOT resolve the promise.
    let chosen = false;

    toast.choose({
      title: "Add photo",
      message: "Choose a source",
      // A little longer than the default so there's time to pick a source.
      durationMs: 6000,
      actions: [
        {
          label: "Take Photo",
          onPress: () => {
            chosen = true;
            void takePhoto(opts).then(settle);
          },
        },
        {
          label: "Choose from Library",
          onPress: () => {
            chosen = true;
            void pickFromLibrary(opts).then(settle);
          },
        },
        {
          label: "Cancel",
          onPress: () => {
            chosen = true;
            settle(null);
          },
        },
      ],
      // Auto-dismiss (or another toast taking over) without a selection
      // counts as cancel.
      onDismiss: () => {
        if (!chosen) settle(null);
      },
    });
  });
}
