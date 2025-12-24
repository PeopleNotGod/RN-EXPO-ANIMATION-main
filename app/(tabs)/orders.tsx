import React, { useEffect, useRef, useState } from 'react';
import { Text, View } from 'react-native';
import Animated, {
    FadeInRight,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

const Orders = () => {
    const translateY = useSharedValue(100);
    const [visible, setVisible] = useState(false);
    const hideTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleScroll = (event: any) => {
        const y = event.nativeEvent.contentOffset.y;

        if (y > 0) {
            setVisible(true);

            if (hideTimer.current) {
                clearTimeout(hideTimer.current);
            }

            hideTimer.current = setTimeout(() => {
                setVisible(false);
            }, 1000);
        }
    };

    useEffect(() => {
        translateY.value = withTiming(visible ? 0 : 100, {
            duration: 400,
        });
    }, [visible]);

    const buttonStyle = useAnimatedStyle(() => ({
        transform: [{ translateY: translateY.value }],
    }));

    return (
        <View style={{ flex: 1 }}>
            <Animated.ScrollView
                onScroll={handleScroll}
                scrollEventThrottle={16}
                showsVerticalScrollIndicator={false}
            >
                {Array.from({ length: 10 }).map((_, i) => (
                    <Animated.View
                        key={i}
                        entering={FadeInRight.delay(i * 100)}
                        style={{
                            marginVertical: 10,
                            marginHorizontal: 20,
                            height: 250,
                            backgroundColor: 'red',
                            justifyContent: 'center',
                        }}
                    >
                        <Text style={{ color: 'white', textAlign: 'center' }}>
                            {i}
                        </Text>
                    </Animated.View>
                ))}
            </Animated.ScrollView>

            <Animated.View
                style={[
                    {
                        position: 'absolute',
                        bottom: 10,
                        width: '96%',
                        marginHorizontal: 10,
                        height: 50,
                        borderRadius: 50,
                        backgroundColor: 'green',
                        justifyContent: 'center',
                        alignItems: 'center',
                    },
                    buttonStyle,
                ]}
            >
                <Text style={{ color: 'white', fontSize: 20 }}>
                    Button checkout
                </Text>
            </Animated.View>
        </View>
    );
};

export default Orders;
