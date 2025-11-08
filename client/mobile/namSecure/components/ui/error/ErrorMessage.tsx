import { Text, View } from 'react-native';
import { IErrorMessageProps } from '@/types/components/ui/feedback/errorMessage';
import { styles } from '@/styles/components/ui/feedback/errorMessage';

export default function ErrorMessage({ message }: IErrorMessageProps)
{
    return (
        <View style={styles.container}>
            <Text style={styles.errorText}>{message}</Text>
        </View>
    );
}
