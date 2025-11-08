import { View } from 'react-native';
import ErrorMessage from './ErrorMessage';
import { styles } from '@/styles/components/ui/feedback/errorMessageContainer';

interface ErrorMessageContainerProps {
    message: string | null;
}

export default function ErrorMessageContainer({ message }: ErrorMessageContainerProps)
{
    return (
        <View style={styles.container}>
            {message && <ErrorMessage message={message} />}
        </View>
    );
}
