import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth } from "firebase/auth";
import { getFirestore, collection, query, onSnapshot, addDoc, Timestamp, doc, setDoc } from 'firebase/firestore';
import { deleteDoc } from 'firebase/firestore';


const Forum = () => {

    const [posts, setPosts] = useState([]);
    const [newPostTitle, setNewPostTitle] = useState('');
    const [newPostContent, setNewPostContent] = useState('');
    const db = getFirestore();
    const auth = getAuth();
    const navigation = useNavigation()

    useEffect(() => {
        const unsubscribe = onSnapshot(query(collection(db, "forum")), (querySnapshot) => {
            const postsArray = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            setPosts(postsArray);
        });
        return () => unsubscribe(); // Cleanup on unmount
    }, []);

    const handlePostCreation = async () => {
        if (!auth.currentUser) {
            Alert.alert("You must be logged in to post.");
            return;
        }
        if (newPostTitle.trim() === '' || newPostContent.trim() === '') {
            Alert.alert("Please fill in all fields.");
            return;
        }
        const post = {
            title: newPostTitle,
            content: newPostContent,
            userName: auth.currentUser.email,
            date: Timestamp.fromDate(new Date()),
        };
        try {
            await addDoc(collection(db, "forum"), post);
            setNewPostTitle('');
            setNewPostContent('');
        } catch (error) {
            console.error("Error adding document: ", error);
            Alert.alert("Error posting message.");
        }
    };

    const handleDeletePost = async (postId) => {
        try {
            await deleteDoc(doc(db, "forum", postId));
            Alert.alert("Post deleted successfully.");
        } catch (error) {
            console.error("Error deleting post: ", error);
            Alert.alert("Failed to delete post.");
        }
    };


    return (

        <View style={styles.container}>
            <Text style={styles.title}>Let's Talk</Text>
            <TextInput
                placeholder="Title"
                value={newPostTitle}
                onChangeText={setNewPostTitle}
                style={styles.input}
            />
            <TextInput
                placeholder="Your message"
                value={newPostContent}
                onChangeText={setNewPostContent}
                style={[styles.input, { height: 100 }]}
                multiline
            />
            <TouchableOpacity onPress={handlePostCreation} style={styles.button}>
                <Text style={styles.buttonText}>Post</Text>
            </TouchableOpacity>
            <FlatList
                data={posts}
                renderItem={({ item }) => (
                    <View style={styles.postContainer}>
                        {auth.currentUser?.email === item.userName && (
                            <TouchableOpacity
                                style={styles.deleteButton}
                                onPress={() => handleDeletePost(item.id)}
                            >
                                <Text style={styles.deleteButtonText}>Delete</Text>
                            </TouchableOpacity>
                        )}
                        <Text style={styles.postTitle}>{item.title}</Text>
                        <Text>{item.content}</Text>
                        <Text style={styles.postDetails}>Posted by {item.userName} on {item.date.toDate().toDateString()}</Text>
                        <TouchableOpacity
                            style={[styles.replyButton, {marginTop: 10}]} // Adjust styling as needed
                            onPress={() => navigation.navigate('post', { postId: item.id })}
                        >
                            <Text style={styles.replyButtonText}>Reply</Text>
                        </TouchableOpacity>
                    </View>
                )}
                keyExtractor={item => item.id}
            />

            <View style={styles.footer}>
                <TouchableOpacity onPress={() => navigation.navigate('UserDashboard')} style={styles.dashboardButton}>
                    <Text style={styles.dashboardButtonText}>Dashboard</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#5264af',
        alignSelf: 'center',
        margin: 20,
        paddingTop:25
    },
    container: {
        flex: 1,
        backgroundColor: "#F5EEE6",
        padding: 20,
    },
    input: {
        backgroundColor: "#FFF8E3",
        borderColor: "#F3D7CA",
        borderWidth: 1,
        borderRadius: 5,
        padding: 10,
        width: '100%',
        marginBottom: 20,
    },
    button: {
        backgroundColor: "#C3ACD0",
        padding: 15,
        borderRadius: 5,
        alignItems: "center",
        marginBottom: 20,
    },
    buttonText: {
        color: "#FFF8E3",
    },
    postContainer: {
        marginBottom: 20,
        padding: 10,
        backgroundColor: "#FFF8E3",
        borderRadius: 5,
    },
    postTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    postDetails: {
        fontSize: 12,
        color: 'gray',
    },

    footer: {
        flex: 1,
        justifyContent: 'flex-end',
        marginBottom: 36,
    },
    dashboardButton: {
        position: 'absolute',
        bottom: 20,
        right: 20,
        backgroundColor: '#D9534F',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    dashboardButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
    },
    deleteButton: {
        position: 'absolute',
        right: 10,
        top: 10,
        backgroundColor: "transparent",
        padding: 5,
        zIndex: 1,
    },
    deleteButtonText: {
        color: "#D9534F",
        fontWeight: 'bold',
    },


});
export default Forum;
