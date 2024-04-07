import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, Alert, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { getAuth } from "firebase/auth";
import { getFirestore, collection, query, onSnapshot, addDoc, Timestamp, doc, deleteDoc } from 'firebase/firestore';

const Forum = () => {
    const [posts, setPosts] = useState([]);
    const [newPostTitle, setNewPostTitle] = useState('');
    const [newPostContent, setNewPostContent] = useState('');
    const db = getFirestore();
    const auth = getAuth();
    const navigation = useNavigation();

    useEffect(() => {
        const unsubscribe = onSnapshot(query(collection(db, "forum")), (querySnapshot) => {
            const postsArray = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
            setPosts(postsArray);
        });
        return () => unsubscribe();
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
        Alert.alert(
            "Delete Post",
            "Are you sure you want to delete this post?",
            [
                {
                    text: "Cancel",
                    onPress: () => console.log("Cancel Pressed"),
                    style: "cancel"
                },
                {
                    text: "Yes",
                    onPress: async () => {
                        try {
                            await deleteDoc(doc(db, "forum", postId));
                            Alert.alert("Post deleted successfully.");
                        } catch (error) {
                            console.error("Error deleting post: ", error);
                            Alert.alert("Failed to delete post.");
                        }
                    }
                }
            ],
            { cancelable: false }
        );
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.backButton}
            >
                <Image
                    source={require('../image/back.png')}
                    style={styles.backImage}
                />
            </TouchableOpacity>

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
                            style={[styles.replyButton, {marginTop: 10}]}
                            onPress={() => navigation.navigate('post', { postId: item.id })}
                        >
                            <Text style={styles.replyButtonText}>View Replies</Text>
                        </TouchableOpacity>
                    </View>
                )}
                keyExtractor={item => item.id}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#F5EEE6",
        padding: 20,
    },
    title: {
        fontSize: 30,
        fontWeight: 'bold',
        color: '#5264af',
        alignSelf: 'center',
        margin: 20,
        paddingTop: 25,
    },
    input: {
        backgroundColor: "#FFFFFF",
        borderColor: "#B0BEC5",
        borderWidth: 1,
        borderRadius: 5,
        padding: 15,
        fontSize: 16,
        color: "#37474F",
        marginBottom: 15,
        width: '100%',
    },
    button: {
        backgroundColor: "#a16dbe",
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
        padding: 20,
        backgroundColor: "#fff8f2",
        borderRadius: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 5,
    },

    postTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    postDetails: {
        fontSize: 12,
        color: 'gray',
        marginTop: 12,
    },
    backButton: {
        paddingTop: 40,
        position: 'absolute',
        top: 10,
        left: 10,
        zIndex: 10,
    },
    backImage: {
        width: 50,
        height: 50,
    },
    deleteButton: {
        position: 'absolute',
        right: 10,
        top: 10,
        backgroundColor: "#D9534F",
        padding: 5,
        zIndex: 1,
        borderRadius:5
    },
    deleteButtonText: {
        color: "#FFF8E3",
        fontWeight: 'bold',
    },
    replyButton: {
        marginTop: 10,
        backgroundColor: "#78909C",
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 20,
        alignItems: "center",
        justifyContent: "center",
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.22,
        shadowRadius: 2.22,
    },
    replyButtonText: {
        color: "#FFFFFF",
        fontSize: 14,
        fontWeight: "500",
    },

});
export default Forum;
