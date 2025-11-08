import { View } from 'react-native';
import Loading from './Loading';
import { styles } from '@/styles/components/ui/feedback/loadingContainer';

interface LoadingContainerProps {
    visible: boolean;
}

export default function LoadingContainer({ visible }: LoadingContainerProps)
{
    return (
        <View style={[styles.container, !visible && { display: 'none' }]}>
            {visible && <Loading />}
        </View>
    );
}
