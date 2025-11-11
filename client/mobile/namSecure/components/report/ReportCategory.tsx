import GlassButton from "@/components/ui/buttons/GlassButton";
import React from "react";

export default function ReportCategory() {
    return(
        <>
            <GlassButton
                icon="car.side.rear.and.collision.and.car.side.front"
                label="Accident"
                onPress={() => {}}
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
