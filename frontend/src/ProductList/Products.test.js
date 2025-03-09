import { renderHook, act } from "@testing-library/react";
import { useState } from "react";

describe("ProductList state tests", () => {
  test("initial state values", () => {
    const { result } = renderHook(() => {
      const [priceRange, setPriceRange] = useState([0, 10000]);
      const [selectedCategories, setSelectedCategories] = useState([]);
      const [searchQuery, setSearchQuery] = useState("");
      const [products, setProducts] = useState([]);
      const [categories, setCategories] = useState([]);
      return { priceRange, selectedCategories, searchQuery, products, categories };
    });

    expect(result.current.priceRange).toEqual([0, 10000]);
    expect(result.current.selectedCategories).toEqual([]);
    expect(result.current.searchQuery).toBe("");
    expect(result.current.products).toEqual([]);
    expect(result.current.categories).toEqual([]);
  });

  test("update state values", () => {
    const { result } = renderHook(() => {
      const [priceRange, setPriceRange] = useState([0, 10000]);
      const [selectedCategories, setSelectedCategories] = useState([]);
      const [searchQuery, setSearchQuery] = useState("");
      const [products, setProducts] = useState([]);
      const [categories, setCategories] = useState([]);
      return { priceRange, setPriceRange, selectedCategories, setSelectedCategories, searchQuery, setSearchQuery, products, setProducts, categories, setCategories };
    });

    act(() => {
      result.current.setPriceRange([500, 5000]);
      result.current.setSelectedCategories(["Electronics", "Clothing"]);
      result.current.setSearchQuery("laptop");
      result.current.setProducts([{ id: 1, name: "Laptop" }]);
      result.current.setCategories(["Electronics", "Clothing", "Home"]);
    });

    expect(result.current.priceRange).toEqual([500, 5000]);
    expect(result.current.selectedCategories).toEqual(["Electronics", "Clothing"]);
    expect(result.current.searchQuery).toBe("laptop");
    expect(result.current.products).toEqual([{ id: 1, name: "Laptop" }]);
    expect(result.current.categories).toEqual(["Electronics", "Clothing", "Home"]);
  });
});
