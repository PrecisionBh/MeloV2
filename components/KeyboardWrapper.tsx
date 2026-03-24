import React, { useEffect, useState } from "react"
import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    TouchableWithoutFeedback,
    ViewStyle,
} from "react-native"

type Props = {
  children: React.ReactNode
  contentContainerStyle?: ViewStyle
}

export default function KeyboardWrapper({
  children,
  contentContainerStyle,
}: Props) {
  const [keyboardVisible, setKeyboardVisible] = useState(false)

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () =>
      setKeyboardVisible(true)
    )
    const hideSub = Keyboard.addListener("keyboardDidHide", () =>
      setKeyboardVisible(false)
    )

    return () => {
      showSub.remove()
      hideSub.remove()
    }
  }, [])

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={
        Platform.OS === "ios" && keyboardVisible ? "padding" : undefined
      }
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={[
            {
              flexGrow: 1,
              paddingBottom: keyboardVisible ? 120 : 0,
            },
            contentContainerStyle,
          ]}
        >
          {children}
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}