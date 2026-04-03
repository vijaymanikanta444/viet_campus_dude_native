import { TextInput, StyleProp, TextInputProps, ViewStyle } from 'react-native';
import { useTheme, useThemedStyles } from '../theme';
import { Theme } from '../theme/theme';

type ThemedInputProps = TextInputProps & {
  placeholder?: string;
  style?: StyleProp<ViewStyle>;
  error?: boolean;
  errorMessage?: string;
};

export function ThemedInput({
  placeholder,
  style,
  error = false,
  errorMessage,
  ...props
}: ThemedInputProps) {
  const { theme } = useTheme();
  const styles = useThemedStyles(createStyles);

  return (
    <TextInput
      placeholder={placeholder}
      placeholderTextColor={theme.colors.textMuted}
      style={[
        styles.input,
        styles.inputBase,
        {
          borderColor: error ? theme.colors.danger : theme.colors.border,
          color: theme.colors.textPrimary,
        },
        style,
      ]}
      {...props}
    />
  );
}

const createStyles = (theme: Theme) => ({
  input: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderRadius: theme.radius.md,
    fontSize: 16,
  },
  inputBase: {
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
});
