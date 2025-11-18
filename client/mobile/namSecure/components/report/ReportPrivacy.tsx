import GlassButton from "@/components/ui/buttons/GlassButton";
import {nextStep, updateReport} from "@/store/ReportCreateSlice";
import {useDispatch} from "react-redux";


export default function ReportPrivacy () {
const dispatch = useDispatch();

    return(
        <>
            <GlassButton
                icon="globe.europe.africa.fill"
                label="Public"
                onPress={() => {
                    dispatch(updateReport({ isPublic: true, level: 3 }));
                    dispatch(nextStep("categoryStep"));
                }}
                height={190}
                iconSize={60}
            />

            <GlassButton
                icon="person.3.fill"
                label="Private"
                onPress={() => {
                    dispatch(updateReport({ isPublic: false }));
                    dispatch(nextStep("levelStep"));
                }}
                height={190}
                iconSize={60}
            />
        </>
    )
}
