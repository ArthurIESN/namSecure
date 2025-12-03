import GlassButton from "@/components/ui/buttons/GlassButton";
import {nextStep, updateReport} from "@/store/ReportCreateSlice";
import {useDispatch} from "react-redux";


export default function ReportPrivacy () {
const dispatch = useDispatch();

    return(
        <>
            <GlassButton
                icon="xmark"
                label="No"
                onPress={() => {
                    dispatch(updateReport({ forPolice: false }));
                    dispatch(nextStep("finalStep"));
                }}
                //color={"FF232350"}
                height={290}
                iconSize={40}
                iconColor={"FF232390"}
            />

            <GlassButton

                icon="checkmark"
                label="Yes"
                onPress={() => {
                    dispatch(updateReport({ forPolice: true }));
                    dispatch(nextStep("finalStep"));
                }}
                //color={"50E45B50"}
                height={290}
                iconSize={40}
                iconColor={"50E45B90"}
            />
        </>
    )
}
