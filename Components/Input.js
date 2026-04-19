import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Colors from '../constants/colors';
 
export default function Input({
  label,
  error,
  secureToggle = false,
  style,
  ...props
}) {
  const [visible, setVisible] = useState(!secureToggle);
  const [focused, setFocused] = useState(false);
 
  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[
          styles.inputRow,
          focused && styles.inputFocused,
          !!error && styles.inputError,
        ]}
      >
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={Colors.textMuted}
          secureTextEntry={!visible}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          autoCapitalize="none"
          autoCorrect={false}
          {...props}
        />
        {secureToggle && (
          <TouchableOpacity
            onPress={() => setVisible((v) => !v)}
            style={styles.toggle}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.toggleText}>{visible ? 'Hide' : 'Show'}</Text>
          </TouchableOpacity>
        )}
      </View>
      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}
 
const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.bark,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
    marginBottom: 7,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.parchment,
    borderWidth: 1,
    borderColor: Colors.inputBorder,
    borderRadius: 12,
    paddingHorizontal: 14,
  },
  inputFocused: {
    borderColor: Colors.moss,
    backgroundColor: Colors.white,
  },
  inputError: {
    borderColor: Colors.dangerText,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: Colors.textPrimary,
    paddingVertical: 13,
  },
  toggle: {
    paddingLeft: 10,
  },
  toggleText: {
    fontSize: 13,
    color: Colors.moss,
    fontWeight: '500',
  },
  errorText: {
    fontSize: 12,
    color: Colors.dangerText,
    marginTop: 5,
    marginLeft: 2,
  },
});