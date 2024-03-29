import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    Alert,
    Image
} from 'react-native';
import {
    getFirestore,
    doc,
    getDoc,
    collection,
    addDoc,
    query,
    onSnapshot,
    Timestamp
} from 'firebase/firestore';
import { getAuth } from "firebase/auth";
import { useNavigation } from "@react-navigation/native";
import { deleteDoc } from 'firebase/firestore';

const PostDetail = ({ route }) => {
    const { postId } = route.params;
    const [post, setPost] = useState(null);
    const [replies, setReplies] = useState([]);
    const [newReply, setNewReply] = useState('');
    const db = getFirestore();
    const auth = getAuth();
    const navigation = useNavigation();

    useEffect(() => {
        const fetchPostAndReplies = async () => {
            const docRef = doc(db, "forum", postId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                setPost({ id: docSnap.id, ...docSnap.data() });
            } else {
                console.log("No such document!");
            }

            const unsubscribe = onSnapshot(query(collection(db, "forum", postId, "replies")), (querySnapshot) => {
                const repliesArray = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
                setReplies(repliesArray);
            });
            return unsubscribe;
        };

        fetchPostAndReplies();
    }, [postId]);

    const handleDeleteReply = async (replyId) => {
        Alert.alert(
            "Delete Reply",
            "Are you sure you want to delete this reply?",
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
                            await deleteDoc(doc(db, "forum", postId, "replies", replyId));
                            Alert.alert("Reply deleted successfully.");
                        } catch (error) {
                            console.error("Error deleting reply: ", error);
                            Alert.alert("Failed to delete reply.");
                        }
                    }
                }
            ],
            { cancelable: false }
        );
    };

    const handleReply = async () => {
        if (!auth.currentUser) {
            Alert.alert("You must be logged in to reply.");
            return;
        }
        if (newReply.trim() === '') {
            Alert.alert("Please enter a reply.");
            return;
        }
        const reply = {
            content: newReply,
            userName: auth.currentUser.email.split('@')[0],
            date: Timestamp.fromDate(new Date()),
        };
        try {
            await addDoc(collection(db, "forum", postId, "replies"), reply);
            setNewReply('');
        } catch (error) {
            console.error("Error adding reply: ", error);
            Alert.alert("Error posting reply.");
        }
    };

    if (!post) return <Text>Loading...</Text>;

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

            <Text style={styles.postTitle}>{post.title}</Text>
            <Text style={styles.postContent}>{post.content}</Text>
            <Text style={styles.postDetails}>Posted by {post.userName} on {post.date?.toDate().toDateString()}</Text>

            <FlatList
                data={replies}
                renderItem={({ item }) => (
                    <View style={styles.replyContainer}>
                        <Text style={styles.replyContent}>{item.content}</Text>
                        <Text style={styles.replyDetails}>Reply by {item.userName} on {item.date?.toDate().toDateString()}</Text>
                        {auth.currentUser?.email.split('@')[0] === item.userName && (
                            <TouchableOpacity
                                style={styles.deleteReplyButton}
                                onPress={() => handleDeleteReply(item.id)}
                            >
                                <Text style={styles.deleteReplyButtonText}>Delete</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                )}
                keyExtractor={item => item.id}
                ListHeaderComponent={<Text style={styles.repliesHeader}>Replies</Text>}
            />

            <TextInput
                style={styles.input}
                value={newReply}
                onChangeText={setNewReply}
                placeholder="Write a reply..."
                multiline
                numberOfLines={4}
            />
            <TouchableOpacity onPress={handleReply} style={styles.replyButton}>
                <Text style={styles.buttonText}>Post Reply</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 100,
        backgroundColor: "#F5EEE6",
    },
    postTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    postContent: {
        fontSize: 16,
        marginBottom: 10,
    },
    postDetails: {
        fontSize: 12,
        color: 'gray',
        marginBottom: 20,
    },
    replyContainer: {
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
    replyContent: {
        fontSize: 14,
    },
    replyDetails: {
        fontSize: 12,
        color: 'gray',
        marginTop: 10,
    },
    repliesHeader: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
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
    },
    replyButton: {
        backgroundColor: "#a16dbe",
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 25,
        alignItems: "center",
        justifyContent: "center",
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    buttonText: {
        color: "#FFFFFF",
        fontSize: 18,
        fontWeight: "600",
    },
    deleteReplyButton: {
        marginTop: 10,
        backgroundColor: '#D9534F',
        padding: 5,
        borderRadius: 5,
        alignSelf: 'flex-end',
    },
    deleteReplyButtonText: {
        color: '#FFFFFF',
        fontSize: 12,
    },
    backButton: {
        position: 'absolute',
        top: 40,
        left: 10,
        zIndex: 10,
    },
    backImage: {
        width: 50,
        height: 50,
    },
});

export default PostDetail;
