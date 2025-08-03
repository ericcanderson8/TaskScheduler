import React from 'react';
import { TextInput as RNTextInput, Platform } from 'react-native';
import { TextInput } from 'react-native-paper';

interface CustomPasswordInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  style?: any;
}

const CustomPasswordInput: React.FC<CustomPasswordInputProps> = ({
  label,
  value,
  onChangeText,
  style,
}) => {
  return (
    <TextInput
      label={label}
      value={value}
      onChangeText={onChangeText}
      mode="outlined"
      style={style}
      secureTextEntry
      textContentType="none"
      autoCapitalize="none"
      autoCorrect={false}
      spellCheck={false}
      autoComplete="off"
      importantForAutofill="no"
      {...(Platform.OS === 'ios' && {
        textContentType: 'none',
        autoComplete: 'off',
        importantForAutofill: 'no',
      })}
    />
  );
};

export default CustomPasswordInput; 