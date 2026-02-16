const isDateOnly = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value);

export const calculateFrontendPrice = ({
    basePrice,
    unit,
    startDate,
    endDate,
    adminCommissionRate,
    taxRate,
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
            duration = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60));
            break;
        case "day":
            duration = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
            break;
        case "month":
            duration = (checkOut.getFullYear() - checkIn.getFullYear()) * 12 + (checkOut.getMonth() - checkIn.getMonth());
            if (checkOut.getDate() < checkIn.getDate()) duration -= 1;
            else if (checkOut.getDate() > checkIn.getDate()) duration += 1;
            duration = Math.max(duration, 1);
            break;
        case "year": {
            let years = checkOut.getFullYear() - checkIn.getFullYear();

            const anniversaryDate = new Date(checkIn);
            anniversaryDate.setFullYear(checkIn.getFullYear() + years);

            if (checkOut.getTime() > anniversaryDate.getTime()) {
                years += 1;
            }

            duration = Math.max(years, 1);
            break;
        }
    }

    const calculatedBasePrice = duration * basePrice;

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