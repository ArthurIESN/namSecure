
import React, { ReactNode } from 'react';
import { ContextMenu, Host, BottomSheet } from '@expo/ui/jetpack-compose';
import { useWindowDimensions, View } from 'react-native';

interface IBottomSheetProps {
    isOpen: boolean;
    onClose: () => void;
    children: ReactNode;
}

export default function NativeBottomSheet({ isOpen, onClose, children }: IBottomSheetProps) {
    const { width } = useWindowDimensions();

    if (!isOpen) {
        return null;
    }

    return (
        <Host style={{ position: 'absolute', width }}>
            <BottomSheet isOpened={isOpen} >
                {children}
            </BottomSheet>
        </Host>
    );
}
