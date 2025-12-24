import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableWithoutFeedback } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const AnimatedButton = () => {
    const router = useRouter();

    const scale = useSharedValue(1);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [{ scale: scale.value }],
    }));

    const onPressIn = () => {
        scale.value = withSpring(0.85);
    };

    const onPressOut = () => {
        scale.value = withSpring(1);
    };

    return (
        <TouchableWithoutFeedback
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            onPress={() => console.log('Navigate to Profile')}
        >
            <Animated.View style={[styles.button, animatedStyle]}>
                <Text style={styles.text}>Go to Profile</Text>
            </Animated.View>
        </TouchableWithoutFeedback>
    );
};

export default AnimatedButton;

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#4F46E5',
        paddingVertical: 16,
        paddingHorizontal: 32,
        borderRadius: 12,
        alignItems: 'center',
    },
    text: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
