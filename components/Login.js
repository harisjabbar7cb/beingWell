import React, { useState } from "react";
import { StyleSheet, Text, View, TextInput, Button} from "react-native";

const Login = () => {
    const [Username, serUsername] = useState('');
    const [Password, setPassword] = useState('');

    const LoginButton = () => {
      console.log('Login with: ', Username, Password)
    }

    return (
      <View style={styles.container}>
       <Text style = {styles.text}> BeingWell</Text>
       <Text/>
        {/* <StatusBar style="auto" /> */}

      <TextInput 
      style = {styles.login}
      name="Username"
      placeholder="Username"
      placeholderTextColor={'white'}
      value = {Username}
      />
        

      <TextInput 
      style = {styles.login}
      name ="Password"
      placeholder="Password"
      placeholderTextColor={'white'}
      value = {Password}
      secureTextEntry>


      </TextInput>

      <Button title="Login" onPress={LoginButton}/>
      </View>
    );
  };
  
const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "black",
      alignItems: "center",
      justifyContent: "center",
    }, 
    login:{
      height: 40,
      marginBottom: 20,
      borderWidth: 2,
      padding: 10,
      width: 150,
      borderColor: 'white'
    },
    text: {
      color: 'white',
    },
    
   

});

export default Login;
  