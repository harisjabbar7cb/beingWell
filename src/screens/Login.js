import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const Login = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Login Screen</Text>
            <Button
                title="Go to User Dashboard"
                onPress={() => navigation.navigate('UserDashboard')}
            />
            {/*random text to see if render works */}
            <Text style={styles.debugText}>trejigdgkdjdkj</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    text: {
        fontSize: 20,
        marginBottom: 20,
    },
    debugText: {
        marginTop: 20,
        color: 'red',//Debug text delete later
    },
});

export default Login;
