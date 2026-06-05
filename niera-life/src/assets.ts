// Exporting high-quality generated images for the NIERA LIFE branches
export const DIVISION_ASSETS = {
  spices: "/src/assets/images/niera_spices_hero_1780671021164.png",
  fashion: "/src/assets/images/niera_fashion_hero_1780671036505.png",
  drinks: "/src/assets/images/niera_drinks_hero_1780671051779.png",
  accessories: "/src/assets/images/niera_accessories_hero_1780671065326.png"
};

// Fallback high-quality placeholder generator
export const getPlaceholderImage = (category: string, index: number) => {
  const seeds: Record<string, string[]> = {
    spices: ["cinnamon", "cardamom", "pepper", "cloves"],
    fashion: ["linen", "silk", "saree", "tropical"],
    accessories: ["brass", "reed", "coconut", "shell"],
    drinks: ["coconut", "turmeric", "ginger", "tonic"]
  };
  const list = seeds[category] || ["niera"];
  const seed = list[index % list.length];
  return `https://picsum.photos/seed/${seed}/600/450`;
};
