function formatDate(date, format, now = new Date()) {
    if (!(date instanceof Date) || isNaN(date)) {
        throw new Error("Invalid date");
    }

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    if (format === "DD/MM/YYYY") {
        return `${day}/${month}/${year}`;
    }

    if (format === "YYYY-MM-DD") {
        return `${year}-${month}-${day}`;
    }

    if (format === "Month DD, YYYY") {
        const months = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
        ];

        return `${months[date.getMonth()]} ${day}, ${year}`;
    }

    if (format === "relative") {
        const difference = now - date;
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));

        if (days === 0) {
            return "today";
        }

        if (days === 1) {
            return "1 day ago";
        }

        return `${days} days ago`;
    }

    throw new Error("Invalid format");
}

module.exports = formatDate;