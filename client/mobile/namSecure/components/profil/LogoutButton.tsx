import {ReactElement} from "react";
import GlassedProfileButton from "@/components/profil/GlassedProfileButton";
import {useAuth} from "@/providers/AuthProvider";

export default function LogoutButton(): ReactElement
{
    const { logout } = useAuth();

    async function handleLogout()
    {
        await logout();
    }

    return(
        <GlassedProfileButton
            label="Log Out"
            glassStyleEffect={"regular"}
            onPress={handleLogout}
            icon="arrow.right.to.line"
            variant="danger"
        />
    );
}