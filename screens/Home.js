import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Linking } from 'react-native';
import axios from 'axios';
import { auth } from '../firebase';

// Component
const Home = () => {
    const navigation = useNavigation();
    const [userActivityData, setUserActivityData] = useState([]);
    const [showData, setShowData] = useState(false);

    // Sign out the user
    const handleSignOut = () => {
        auth.signOut();
        navigation.navigate('Login');
    };

    // Open extension popup
    const openExtensionPopup = async () => {
        const extensionURL =
            'chrome-extension://jkomgjfbbjocikdmilgaehbfpllalmia/popup.html';

        const isExtensionAvailable = await Linking.canOpenURL(extensionURL);

        if (isExtensionAvailable) {
            console.log('Extension is already installed.');
        } else {
            Linking.openURL(extensionURL).catch((err) =>
                console.error('An error occurred', err)
            );
        }
    };

    // Fetch user activity data from the server
    useEffect(() => {
        const fetchUserActivityData = async () => {
            try {
                const response = await axios.get(
                    'http://localhost:19008/user-activity'
                );
                console.log('Data received from the server:', response.data);

                if (Array.isArray(response.data) && response.data.length > 0) {
                    const fetchedData = response.data;

                    const allUserActivity = fetchedData.map((item) => ({
                        currentWeekData: item.activityData.currentWeekData || [],
                        previousWeekData: item.activityData.previousWeekData || [],
                    }));
                    console.log('All user activity:', allUserActivity);

                    setUserActivityData(allUserActivity);
                }
            } catch (error) {
                console.error('Error fetching data from the server:', error);
            }
        };

        fetchUserActivityData();
    }, []);
    return (
        <View style={styles.container}>
            <Text style={styles.appTitle}>NotAvailable</Text>
            <Text>{auth.currentUser?.email}</Text>
            <View style={styles.buttonContainer}>
                <Pressable style={styles.button} onPress={handleSignOut}>
                    <Text style={styles.buttonText}>Sign Out!</Text>
                </Pressable>
                <Pressable style={styles.button} onPress={openExtensionPopup}>
                    <Text style={styles.buttonText}>Install Extension</Text>
                </Pressable>
                <Pressable style={styles.button} onPress={() => setShowData(!showData)}>
                    <Text style={styles.buttonText}>
                        {showData ? 'Hide Screentime Data' : 'Current Browsing History'}
                    </Text>
                </Pressable>
            </View>
            {showData && (
                <View style={styles.dataContainer}>
                    <Text style={styles.title}>Current Week Data:</Text>
                    <ScrollView contentContainerStyle={styles.scrollViewContent}>
                        {userActivityData?.map((userData, userIndex) => (
                            <View key={userIndex}>
                                {Object.entries(userData.currentWeekData[0] || {}).map(
                                    ([url, timeSpent], index) => (
                                        <View key={index} style={styles.box}>
                                            <Text style={styles.item}>{`URL: ${url}`}</Text>
                                            <Text style={styles.item}>{`Time Spent: ${formatTime(timeSpent)}`}</Text>
                                        </View>
                                    )
                                )}
                            </View>
                        ))}
                    </ScrollView>
                </View>
            )}
        </View>
    );
};

const formatTime = (milliseconds) => {
    if (milliseconds === null || isNaN(milliseconds)) {
        return 'N/A';
    }

    const seconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (hours > 0) {
        return `${hours}h ${minutes % 60}m ${seconds % 60}s`;
    } else if (minutes > 0) {
        return `${minutes}m ${seconds % 60}s`;
    } else {
        return `${seconds}s`;
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginBottom: 10,
    },
    button: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
    },
    dataContainer: {
        flex: 1,
        width: '100%',
        maxWidth: 999,
        borderWidth: 1,
        borderColor: 'gray',
        marginVertical: 10,
        padding: 10,
        overflow: 'scroll',
    },
    scrollViewContent: {
        flexGrow: 1,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    appTitle: {
        fontSize: 66,
    },
    item: {
        fontSize: 16,
        marginBottom: 5,
    },
    box: {
        borderWidth: 1,
        borderColor: 'black',
        padding: 10,
        marginVertical: 5,
    },
});

export default Home;