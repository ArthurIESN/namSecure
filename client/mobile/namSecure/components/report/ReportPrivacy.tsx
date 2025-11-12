import GlassButton from "@/components/ui/buttons/GlassButton";
import React, {JSX} from "react";

export default function ReportPrivacy () {
    return(
        <>
            <GlassButton
                icon="globe.europe.africa.fill"
                label="Public"
                onPress={() => {}}
                height={190}
                iconSize={60}
            />
            <GlassButton
                icon="person.3.fill"
                label="Private"
                onPress={() => {}}
                height={190}
                iconSize={60}
            />
        </>
    )
}
