import React from "react";

interface BorderedImageProps {
    imgSrc: string;
    altText?: string;
}

export default function BorderedImage({ imgSrc, altText }: BorderedImageProps) {
    return (
        <div className="relative isolate rounded-xl">
            <div className="relative">
                <img src={imgSrc} alt={altText} className="shadow-xl rounded-xl" />
                <div className="absolute -top-4 left-4 bottom-4 -right-4 -z-10 bg-sky-500 rounded-xl"></div>
            </div>
        </div>
    );
}
