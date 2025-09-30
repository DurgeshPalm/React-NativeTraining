import { StyleSheet, Text, TextInput, View } from "react-native";

 const  LoginInput = ({
  placeholder,
  secureTextEntry,
  value,
  onChangeText,
  onBlur,
  error,
  isFocused,
  setIsFocused,
  rightIcon,
}: {
  placeholder: string;
  secureTextEntry?: boolean;
  value: string;
  onChangeText: (text: string) => void;
  onBlur: () => void;
  error?: string;
  isFocused: boolean;
  setIsFocused: (focus: boolean) => void;
  rightIcon?: React.ReactNode;
}) => {
  return (
    <View style={[styles.inputContainer, isFocused && styles.inputContainerFocused]}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor="#999"
        secureTextEntry={secureTextEntry}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => {
          setIsFocused(false); 
          onBlur(); 
        }}
        
      />
      {rightIcon && <View style={styles.iconContainer}>{rightIcon}</View>}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create(
    {
         inputContainer: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingHorizontal: 15,
    paddingVertical: 12,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
    elevation: 3,
  },
  iconContainer: {
  position: 'absolute',
  right: 15,
  top: '35%',
},
 errorText: {
    color: '#e84118',
    marginTop: 5,
    fontSize: 12,
  },
    input: {
    fontSize: 16,
    color: '#2f3640',
  },
   inputContainerFocused: {
    borderColor: '#4cd137',
    shadowOpacity: 0.15,
    elevation: 5,
  },
}
);

export default  LoginInput ;