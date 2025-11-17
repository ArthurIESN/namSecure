import React, { useState,useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, TouchableOpacity} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import BubblePopUp from "@/components/ui/cards/BubblePopUp";
import Map from '@/components/map/Map';
import { useFocusEffect } from '@react-navigation/native';
import ReportCategory from "@/components/report/ReportCategory";
import ReportPrivacy from "@/components/report/ReportPrivacy";
import ReportPolice from "@/components/report/ReportPolice";
import ReportLevel from "@/components/report/ReportLevel";
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

export default function HomeScreen() {
    const [isVisible, setIsVisible] = useState(false);
    const [shouldRender, setShouldRender] = useState(false);
    const slideAnim = useRef(new Animated.Value(600)).current;
    const step = useSelector((state: RootState) => state.reportCreation.step);

    useEffect(() => {
        console.log('Current step:', step);
    }, [step]);

    useFocusEffect(
        React.useCallback(() => {
            return () => {
                // Quand on quitte la page
                setIsVisible(false);

            };
        }, [])
    );

    useEffect(() => {
        if (isVisible) {
            setShouldRender(true);
            slideAnim.setValue(600);
            Animated.spring(slideAnim, {
                toValue: 0,
                useNativeDriver: true,
                tension: 65,
                friction: 10,
            }).start();
        } else if (shouldRender) {
            Animated.timing(slideAnim, {
                toValue: 600,
                duration: 150,
                useNativeDriver: true,
            }).start(() => {
                setShouldRender(false);
            });
        }
    }, [isVisible]);

    function getTextBubble() {
        if(step === 1){
            return "Select the privacy of your report";
        }else if(step === 2){
            return "Select the category of your report";
        }else if(step === 3){
            return "Select the gravity of your report";
        }else{
            return "Want to notify the police?";
        }
    }

    function renderReport(){
        if(step === 1){
            return <ReportPrivacy />;
        }else if(step === 2){
            return <ReportCategory />;
        }else if(step === 3){
            return <ReportLevel />;
        }else{
            return <ReportPolice />;
        }
    }

    return (
        <View style={styles.wrapper}>
            <Map/>
            <TouchableOpacity
                style={styles.centerButton}
                onPress={() => setIsVisible(!isVisible)}
            >
                <Ionicons name={isVisible ? "close-circle" : "add-circle"} size={60} color="#007AFF" />
            </TouchableOpacity>

            {shouldRender && (
                <Animated.View style={{transform: [{translateY: slideAnim}]}}>
                    <BubblePopUp
                        bubbleText = {getTextBubble()} >
                        {renderReport()}
                    </BubblePopUp>
                </Animated.View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
    map: {
        ...StyleSheet.absoluteFillObject, // occupe tout l'écranca casse
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
    },
    centerButton: {
        position: 'absolute',
        alignSelf: 'center',
        top: '50%',
        backgroundColor: 'white',
        borderRadius: 50,
        padding: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },

});