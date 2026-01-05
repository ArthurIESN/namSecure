import React, { useState,useEffect, useRef } from 'react';
import { View, StyleSheet, Animated } from 'react-native';
import BubblePopUp from "@/components/ui/cards/BubblePopUp";
import Maps from '@/components/map/Maps';
import { useFocusEffect } from '@react-navigation/native';
import ReportCategory from "@/components/report/ReportCategory";
import ReportPrivacy from "@/components/report/ReportPrivacy";
import ReportPolice from "@/components/report/ReportPolice";
import ReportLevel from "@/components/report/ReportLevel";
import ReportPost from "@/components/report/ReportPost";
import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';
import {resetReport} from "@/store/ReportCreateSlice";
import { useDispatch } from 'react-redux';
import ReportPhoto from "@/components/report/ReportPhoto";
import BubbleMap from "@/components/map/BubbleMap";

export default function HomeScreen() {
    const [isVisible, setIsVisible] = useState(false);
    const [shouldRender, setShouldRender] = useState(false);
    const slideAnim = useRef(new Animated.Value(600)).current;
    const step = useSelector((state: RootState) => state.reportCreation.step);
    const dispatch = useDispatch();

    useEffect(() => {
        console.log('Current step:', step);
        if (step === "reset") {
            dispatch(resetReport());
            setIsVisible(false);
        }
    }, [step]);

    useFocusEffect(
        React.useCallback(() => {
            setIsVisible(true);

            return () => {
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
        if(step === "privacyStep"){
            return "Select the privacy of your report";
        }else if(step === "categoryStep"){
            return "Select the category of your report";
        }else if(step === "levelStep"){
            return "Select the gravity of your report";
        }else if( step === "policeStep"){
            return "Want to notify the police?";
        }else if ( step === "photoStep"){
            return "Add a photo to your report";
        } else if( step === "finalStep"){
            return "Let's finish your report";
        } else {
            return "Wrong step";
        }
    }

    function renderReport(){
        if(step === "privacyStep"){
            return <ReportPrivacy />;
        }else if(step === "categoryStep"){
            return <ReportCategory />;
        }else if(step === "levelStep"){
            return <ReportLevel />;
        }else if (step === "policeStep"){
            return <ReportPolice />;
        }else if ( step === "photoStep"){
            return <ReportPhoto />;
        } else if(step === "finalStep"){
            return <ReportPost />;
        }
    }

    return (
        <View style={styles.wrapper}>
            <Maps/>
            <BubbleMap/>
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
        ...StyleSheet.absoluteFillObject,
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 12,
    },
});
