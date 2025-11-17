import GlassButton from "@/components/ui/buttons/GlassButton";
import React, {JSX} from "react";
import {nextStep, pastStep, updateEvent} from "@/store/ReportCreateSlice";
import {useDispatch} from "react-redux";


export default function ReportPrivacy () {
const dispatch = useDispatch();

    return(
        <>
            <GlassButton
                icon="checkmark"
                label="Yes"
                onPress={() => {
                    dispatch(updateEvent({ privacy: true }));
                    dispatch(nextStep());
                }}
                color={"D7F1D750"}
                height={190}
                iconSize={40}
            />

            <GlassButton
                icon="xmark"
                label="No"
                onPress={() => {
                    dispatch(updateEvent({ privacy: false }));
                    dispatch(nextStep());
                }}
                color={"FF232330"}
                height={190}
                iconSize={40}
            />
        </>
    )
}
