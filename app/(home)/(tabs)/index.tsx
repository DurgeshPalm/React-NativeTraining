import { darkTheme, lightTheme } from "@/app/theme/style";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import GoogleLoginButton from '../../../components/googlelogin';
import { useUser } from '../../store/UserContext';
import { useFriendsStore } from "../../store/friendsStore";
import { useTheme } from '../../theme/ThemeContext';


export default function DashboardScreen() {
  const router = useRouter();
  const { logout } = useUser();
  const {name, email} = useLocalSearchParams();
  const { reset } = useFriendsStore();
  const { theme } = useTheme();
  const backgroundColor = theme === 'light' ? lightTheme.backgroundColor : darkTheme.backgroundColor;
  const textColor = theme === 'light' ? '#2f3640' : '#f5f6fa';
  const subtitleColor = theme === 'light' ? '#666' : '#ccc';
  const handleLogout = () => {
    reset();
    logout();
    router.push("/"); 
  };
     return (

  
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.title,{color:textColor}]}>Welcome {name || "Guest"}</Text>
      {email && <Text style={[styles.subtitle,{color:subtitleColor}]}>Your email: {email}</Text>}
      {!name && (
        <>
    <TouchableOpacity style={[styles.button]} onPress={() => router.push("../../login")}>
      <Text style={[styles.buttonText]}>Login</Text>
    </TouchableOpacity>
     <TouchableOpacity style={styles.button} onPress={() => router.push("../../signup")}>
      <Text style={[styles.buttonText]}>Signup</Text>
    </TouchableOpacity>
   <GoogleLoginButton />
    </>
      )}

      {name && (
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#2f3640",
    marginBottom: 30,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 20,
  },
   button: {
    width:'100%',
    backgroundColor: "#4cd137",
    padding: 15,
    borderRadius: 12,
    marginTop: 20,
    alignItems: "center",
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  loginButton: {
    backgroundColor: '#03DAC6', // Secondary color
  },
  loginButtonText: {
    color: '#000000',
  },
});