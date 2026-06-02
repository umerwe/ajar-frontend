const isDateOnly = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value);
const DAY_MS = 1000 * 60 * 60 * 24;
const HOUR_MS = 1000 * 60 * 60;

const toDateKey = (date: Date) => date.toISOString().split("T")[0];
const toLocalDateKey = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
};

const getDynamicPriceForDate = (
    date: Date,
    dynamicPricing?: PriceCalculationInput["dynamicPricing"],
    useLocalDate = false,
) => {
    if (!dynamicPricing?.startDate || !dynamicPricing?.endDate) return null;

    const dateKey = useLocalDate ? toLocalDateKey(date) : toDateKey(date);
    const startDateKey = dynamicPricing.startDate.slice(0, 10);
    const endDateKey = dynamicPricing.endDate.slice(0, 10);

    if (dateKey >= startDateKey && dateKey <= endDateKey) {
        return Number(dynamicPricing.price);
    }

    return null;
};

const getPriceForDate = (
    date: Date,
    basePrice: number,
    dynamicPricing?: PriceCalculationInput["dynamicPricing"],
    useLocalDate = false,
) => {
    const dynamicPrice = getDynamicPriceForDate(date, dynamicPricing, useLocalDate);
    return dynamicPrice !== null && Number.isFinite(dynamicPrice) ? dynamicPrice : basePrice;
};

export const calculateFrontendPrice = ({
    basePrice,
    unit,
    startDate,
    endDate,
    adminCommissionRate,
    taxRate,
    dynamicPricing,
}: PriceCalculationInput) => {
    if (!startDate || !endDate) return null;

    let checkIn = new Date(startDate);
    let checkOut = new Date(endDate);

    if (isDateOnly(startDate) && isDateOnly(endDate)) {
        checkIn.setUTCHours(0, 0, 0, 0);
        checkOut.setUTCHours(23, 59, 59, 999);
    }

    let duration = 0;
    switch (unit) {
        case "hour":
            duration = Math.ceil((checkOut.getTime() - checkIn.getTime()) / HOUR_MS);
            break;
        case "day":
            duration = Math.ceil((checkOut.getTime() - checkIn.getTime()) / DAY_MS);
            break;
        case "month": {
            const inDay = isDateOnly(startDate) ? checkIn.getUTCDate() : checkIn.getDate();
            const outDay = isDateOnly(endDate) ? checkOut.getUTCDate() : checkOut.getDate();
            duration = (checkOut.getFullYear() - checkIn.getFullYear()) * 12 + (checkOut.getMonth() - checkIn.getMonth());
            if (outDay < inDay) duration -= 1;
            else if (outDay > inDay) duration += 1;
            duration = Math.max(duration, 1);
            break;
        }
        case "year": {
            let years = checkOut.getFullYear() - checkIn.getFullYear();

            const anniversaryDate = new Date(checkIn);
            anniversaryDate.setFullYear(checkIn.getFullYear() + years);

            const outDay = isDateOnly(endDate) ? checkOut.getUTCDate() : checkOut.getDate();
            const outMonth = checkOut.getUTCMonth();
            const annDay = anniversaryDate.getUTCDate();
            const annMonth = anniversaryDate.getUTCMonth();

            if (outMonth > annMonth || (outMonth === annMonth && outDay > annDay)) {
                years += 1;
            }

            duration = Math.max(years, 1);
            break;
        }
    }

    let calculatedBasePrice = duration * basePrice;

    if (unit === "day") {
        calculatedBasePrice = 0;
        const current = new Date(checkIn);
        for (let index = 0; index < duration; index += 1) {
            calculatedBasePrice += getPriceForDate(current, basePrice, dynamicPricing);
            current.setUTCDate(current.getUTCDate() + 1);
        }
    }

    if (unit === "hour") {
        calculatedBasePrice = 0;
        const current = new Date(checkIn);
        for (let index = 0; index < duration; index += 1) {
            calculatedBasePrice += getPriceForDate(current, basePrice, dynamicPricing, true);
            current.setTime(current.getTime() + HOUR_MS);
        }
    }

    // FIXED LOGIC: Admin Fee aur Tax dono single unit (basePrice) par calculate honge
    const adminFee = adminCommissionRate;

    // Yahan 'calculatedBasePrice' ki jagah 'basePrice' use kiya hai taake tax fixed rahe
    const tax = taxRate;

    const totalPrice = calculatedBasePrice + adminFee + tax;

    return {
        duration,
        basePrice: calculatedBasePrice,
        adminFee,
        tax,
        totalPrice,
    };
};
