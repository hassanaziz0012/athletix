import React from "react";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
import ReactTimeAgo from "react-time-ago";

TimeAgo.addDefaultLocale(en);

export default function LastSeen({ date }: { date: Date | number }) {
    return <ReactTimeAgo date={date} />;
}
