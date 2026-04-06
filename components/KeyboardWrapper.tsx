import React from "react"
import {
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  ViewStyle,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

type Props = {
  children: React.ReactNode
  contentContainerStyle?: ViewStyle
}

export default function KeyboardWrapper({
  children,
  contentContainerStyle,
}: Props) {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={[
              {
                flexGrow: 1,
                paddingBottom: 40,
              },
              contentContainerStyle,
            ]}
          >
            {children}
          </ScrollView>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}