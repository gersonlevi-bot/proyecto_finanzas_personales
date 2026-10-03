export function getTimeZoneOffset(timeZone) {
    const formatter = new Intl.DateTimeFormat("en-CA", {
        timeZone: timeZone,
        timeZoneName: "longOffset"
    });

    const parts = formatter.formatToParts(new Date());
    const offsetPart = parts.find((part) => part.type === "timeZoneName");

    if (!offsetPart) return "+00:00";

    const offsetValue = offsetPart.value;

    if (offsetValue === "GMT") return "+00:00";

    return offsetValue.replace("GMT", "");
}
