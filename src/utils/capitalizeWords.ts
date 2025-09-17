export const capitalizeWords = (text: string) => {
    if (!text) return "";
    return text
      .toLowerCase()
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };
  