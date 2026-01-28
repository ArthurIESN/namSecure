import React, { useState,useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Image } from 'react-native';
import BubblePopUp from "@/components/ui/cards/BubblePopUp";
import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { useMap } from '@/providers/MapProvider';
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
    const slideAnim = useRef(new Animated.Value(1200)).current;
    const step = useSelector((state: RootState) => state.reportCreation.step);
    const dispatch = useDispatch();
    const { mapScreenshot, captureMapScreenshot } = useMap();
    const isFocused = useIsFocused();

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
                slideAnim.setValue(1200);
                setShouldRender(false);
            };
        }, [captureMapScreenshot, slideAnim])
    );



    useEffect(() => {
        if (!isFocused) {
            slideAnim.stopAnimation();
            setShouldRender(false);
            return;
        }

        if (isVisible) {
            setShouldRender(true);
            slideAnim.setValue(1200);
            Animated.spring(slideAnim, {
                toValue: 880,
                useNativeDriver: true,
            }).start();
        } else if (shouldRender) {
            slideAnim.stopAnimation();
            Animated.timing(slideAnim, {
                toValue: 1200,
                duration: 150,
                useNativeDriver: true,
            }).start(() => {
                setShouldRender(false);
            });
        }
    }, [isVisible, slideAnim]);




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
            {mapScreenshot && <Image source={{ uri: mapScreenshot }} style={styles.imageBackground} />}
            {isFocused && (
                <View style={styles.contentContainer}>
                    {shouldRender && (
                        <Animated.View style={{transform: [{translateY: slideAnim}], opacity: 1}} pointerEvents="box-none">
                            <BubblePopUp
                                bubbleText = {getTextBubble()} >
                                {renderReport()}
                            </BubblePopUp>
                        </Animated.View>
                    )}
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: '#f0f0f0',
    },
    mapBackground: {
        ...StyleSheet.absoluteFillObject,
        zIndex: -1,
    },
    imageBackground: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
    },
    contentContainer: {
        flex: 1,
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
