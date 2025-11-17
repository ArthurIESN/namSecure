import GlassButton from "@/components/ui/buttons/GlassButton";
import React from "react";
import { useDispatch } from "react-redux";
import {updateEvent, pastStep, nextStep} from "@/store/ReportCreateSlice";

export default function ReportCategory() {

const dispatch = useDispatch();

    return(
        <>
            <GlassButton
                icon="car.side.rear.and.collision.and.car.side.front"
                label="Accident"
                onPress={() => dispatch(updateEvent({ category: 'accident' },), dispatch(nextStep()))}

            />
            <GlassButton
                icon="eye.fill"
                label="Stalker"
                onPress={() => {}}
            />
            <GlassButton
                icon="figure.boxing"
                label="Combat"
                onPress={() => {}}
            />
            <GlassButton
                icon="creditcard.trianglebadge.exclamationmark.fill"
                label="Vol"
                onPress={() => {}}
            />
            <GlassButton
                icon="alert-circle"
                label="Alert"
                onPress={() => {}}
            />
            <GlassButton
                icon="car"
                label="Vehicle"
                onPress={() => {}}
            />
            <GlassButton
                icon="home"
                label="Home"
                onPress={() => {}}
            />
            <GlassButton
                icon="leaf"
                label="Nature"
                onPress={() => {}}
            />
        </>
    )
}
