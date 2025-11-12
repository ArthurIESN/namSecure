
import React, { ReactNode } from 'react';
import { BottomSheet, Host } from '@expo/ui/swift-ui';
import { useWindowDimensions, View } from 'react-native';

interface IBottomSheetProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
}

export default function NativeBottomSheet({ isOpen, onClose, children }: IBottomSheetProps) {
    const { width } = useWindowDimensions();

    return (
        <>
            <View style={{ position: 'absolute', width, backgroundColor: 'transparent' }} />
            <Host style={{ position: 'absolute', width, backgroundColor: 'transparent' }}>
                <BottomSheet
                    isOpened={isOpen}
                    onIsOpenedChange={(opened) => {
                        if (!opened) {
                            onClose();
                        }
                    }}
                >
                    {children}
                </BottomSheet>
            </Host>
        </>
    );
}
