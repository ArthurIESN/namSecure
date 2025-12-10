import { View } from 'react-native';
import Text from '@/components/ui/Text';
import { IErrorMessageProps } from '@/types/components/ui/feedback/errorMessage';
import { styles as createStyles } from '@/styles/components/ui/feedback/errorMessage';
import {useTheme} from "@/providers/ThemeProvider";

export default function ErrorMessage({ message }: IErrorMessageProps)
{
    const { colorScheme } = useTheme();
    const styles = createStyles(colorScheme);

    return (
        <View style={styles.container}>
            <Text style={styles.errorText}>{message}</Text>
        </View>
    );
}
