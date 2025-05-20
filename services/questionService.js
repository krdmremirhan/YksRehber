export const fetchQuestionsFromAPI = async (category) => {
  try {
    const url = `https://rehberkocum.com/q/puzzle/${category}.json`;
    const response = await fetch(url);
    const data = await response.json();

    // 🔥 Tüm cevapları küçük harfe çevir
    const normalizedData = data.map((item) => ({
      ...item,
      answer: item.answer.toLowerCase(),
    }));

    return normalizedData;
  } catch (err) {
    console.error("API'den veri alınamadı:", err);
    return [];
  }
};
