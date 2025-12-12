import {ReactElement} from "react";
import {TouchableOpacity} from "react-native";
import Text from "@/components/ui/Text";
import {api} from "@/utils/api/api";
import {useAuth} from "@/providers/AuthProvider";
import {useTheme} from "@/providers/ThemeProvider";
import {styles as createStyles} from "@/styles/components/profil/logoutButton";

export default function LogoutButton(): ReactElement
{
    const { logout } = useAuth();
    const { colorScheme } = useTheme();
    const styles = createStyles(colorScheme);

    async function handleLogout()
    {
        await logout();
    }

    return(
        <TouchableOpacity onPress={handleLogout} style={styles.button}>
            <Text style={styles.text}>Log Out</Text>
        </TouchableOpacity>
    )
}