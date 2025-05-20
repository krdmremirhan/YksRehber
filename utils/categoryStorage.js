import AsyncStorage from "@react-native-async-storage/async-storage";

// Tüm kategorileri getir
export const getCategories = async () => {
  try {
    const stored = await AsyncStorage.getItem("categories");
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    console.error("Kategoriler alınamadı", e);
    return [];
  }
};

// Yeni kategori ekle
export const addCategory = async (newCategory) => {
  try {
    const categories = await getCategories();
    const updated = [...categories, newCategory];
    await AsyncStorage.setItem("categories", JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error("Kategori eklenemedi", e);
  }
};

// Kategori sil (isteğe bağlı)
export const deleteCategory = async (nameToDelete) => {
  try {
    const categories = await getCategories();
    const updated = categories.filter(c => c.name !== nameToDelete);
    await AsyncStorage.setItem("categories", JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error("Kategori silinemedi", e);
  }
};
