import { Ionicons } from "@expo/vector-icons"
import * as ImageManipulator from "expo-image-manipulator"
import * as ImagePicker from "expo-image-picker"
import { useState } from "react"
import {
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native"

import { handleAppError } from "@/lib/errors/appError"

type Props = {
  images: string[]
  setImages: (images: string[] | ((prev: string[]) => string[])) => void
  max?: number
}

export default function ImageUpload({
  images,
  setImages,
  max = 7,
}: Props) {
  const [showPicker, setShowPicker] = useState(false)

  /* ---------------- LIBRARY ---------------- */

  const pickImage = async () => {
    try {
      setShowPicker(false)

      if (images.length >= max) {
        Alert.alert("Limit reached", `You can upload up to ${max} photos.`)
        return
      }

      const remainingSlots = max - images.length

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        quality: 0.35,
        allowsMultipleSelection: true,
        selectionLimit: remainingSlots,
      })

      if (!result.canceled && result.assets?.length > 0) {
        const convertedUris = await Promise.all(
          result.assets.map(async (asset) => {
            const converted = await ImageManipulator.manipulateAsync(
              asset.uri,
              [{ resize: { width: 1200 } }],
              {
                compress: 0.25,
                format: ImageManipulator.SaveFormat.JPEG,
              }
            )
            return converted.uri
          })
        )

        setImages((prev) => {
          const combined = [...prev, ...convertedUris]
          return combined.slice(0, max)
        })
      }
    } catch (err) {
      handleAppError(err, {
        context: "image_upload_picker",
      })
    }
  }

  /* ---------------- CAMERA ---------------- */

  const takePhoto = async () => {
    try {
      setShowPicker(false)

      if (images.length >= max) {
        Alert.alert("Limit reached", `You can upload up to ${max} photos.`)
        return
      }

      const permission = await ImagePicker.requestCameraPermissionsAsync()

      if (!permission.granted) {
        Alert.alert("Permission required", "Enable camera access.")
        return
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        quality: 0.35,
      })

      if (!result.canceled && result.assets?.length > 0) {
        const asset = result.assets[0]

        const converted = await ImageManipulator.manipulateAsync(
          asset.uri,
          [{ resize: { width: 1200 } }],
          {
            compress: 0.25,
            format: ImageManipulator.SaveFormat.JPEG,
          }
        )

        setImages((prev) => {
          const combined = [...prev, converted.uri]
          return combined.slice(0, max)
        })
      }
    } catch (err) {
      handleAppError(err, {
        context: "image_upload_camera",
      })
    }
  }

  /* ---------------- REMOVE ---------------- */

  const removeImage = (uri: string) => {
    setImages((prev) => prev.filter((img) => img !== uri))
  }

  const remainingSlots = Math.max(max - images.length, 0)

  return (
    <View style={styles.fullBleedSection}>
      <View style={styles.inner}>
        <Text style={styles.title}>Photos *</Text>
        <Text style={styles.subText}>
          Add up to {max} photos. First photo will be the cover.
        </Text>

        <View style={styles.divider} />

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.row}
        >
          {images.map((uri, index) => (
            <View key={`${uri}-${index}`} style={styles.squareWrapper}>
              <Image source={{ uri }} style={styles.squareImage} />

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => removeImage(uri)}
              >
                <Ionicons name="close" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
          ))}

          {Array.from({ length: remainingSlots }).map((_, i) => {
            const isFirstSlot = images.length === 0 && i === 0

            return (
              <TouchableOpacity
                key={`empty-${i}`}
                style={styles.addSquare}
                onPress={() => setShowPicker(true)}
              >
                <Ionicons
                  name={isFirstSlot ? "camera-outline" : "add"}
                  size={30}
                  color="#7FAF9B"
                />
              </TouchableOpacity>
            )
          })}
        </ScrollView>
      </View>

      {/* 🔥 CUSTOM MODAL */}
      <Modal
        visible={showPicker}
        transparent
        animationType="fade"
        onRequestClose={() => setShowPicker(false)}
      >
        <Pressable style={styles.overlay} onPress={() => setShowPicker(false)}>
          <View style={styles.modal}>
            <TouchableOpacity style={styles.option} onPress={takePhoto}>
              <Ionicons name="camera" size={20} color="#0F1E17" />
              <Text style={styles.optionText}>Take Photo</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.option} onPress={pickImage}>
              <Ionicons name="images" size={20} color="#0F1E17" />
              <Text style={styles.optionText}>Choose from Library</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.option, styles.cancel]}
              onPress={() => setShowPicker(false)}
            >
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  )
}

/* ---------------- STYLES ---------------- */

const styles = StyleSheet.create({
  fullBleedSection: {
    marginHorizontal: -16,
    backgroundColor: "#EEF6F2",
  },
  inner: {
    paddingTop: 16,
    paddingBottom: 18,
  },
  title: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0F1E17",
    paddingHorizontal: 16,
  },
  subText: {
    fontSize: 12,
    color: "#323232",
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  divider: {
    height: 1,
    backgroundColor: "#DCEAE4",
    marginBottom: 14,
  },
  row: {
    flexDirection: "row",
    paddingHorizontal: 16,
    gap: 12,
  },
  squareWrapper: {
    width: 120,
    height: 120,
  },
  squareImage: {
    width: "100%",
    height: "100%",
  },
  addSquare: {
    width: 120,
    height: 120,
    borderWidth: 1,
    borderColor: "#CFE3DA",
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  deleteButton: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "#E5484D",
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  /* MODAL */
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.35)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "80%",
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
  },
  optionText: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F1E17",
  },
  cancel: {
    justifyContent: "center",
    marginTop: 6,
  },
  cancelText: {
    textAlign: "center",
    fontWeight: "700",
    color: "#999",
  },
})