import { createContext, useEffect, useState } from "react";
import { Ingredient } from "../pages/ingredients";
import { Region } from "../pages/locations";
import { Recipe } from "../pages/recipes";

export function getModalValue(): string {
  for (const query of window?.location?.search.substring(1).split("&")) {
      if (query.split("=")[0] == "modal") {
          return query.split("=")[1];
      }
  }
  
  return "";
}

export function getSpecialEffectValue(): string {
  for (const query of window?.location?.search.substring(1).split("&")) {
      if (query.split("=")[0] == "special-effect") {
          return query.split("=")[1];
      }
  }
  
  return "";
}

export function getSearchValue(): string {
  for (const query of window?.location?.search.substring(1).split("&")) {
      if (query.split("=")[0] == "q") {
          return query.split("=")[1];
      }
  }
  
  return "";
}

export function getLocationValue(): string {
  for (const query of window?.location?.search.substring(1).split("&")) {
      if (query.split("=")[0] == "location") {
          return  decodeURI(query.split("=")[1]);
      }
  }

  return "";
}

export interface GlobalContextSpecialEffect {
  name: string
  imgSrc: string
}

export const GlobalContext = createContext<{
  searchQuery: string,
  setSearchQuery: (value: string) => void,
  
  modalQuery: string,
  setModalQuery: (value: string) => void,

  locationQuery: string,
  setLocationQuery: (value: string) => void,

  specialEffectQuery: string,
  setSpecialEffectQuery: (value: string) => void,
}>({
  searchQuery: "",
  setSearchQuery: () => {},

  modalQuery: "",
  setModalQuery: () => {},

  locationQuery: "",
  setLocationQuery: () => {},

  specialEffectQuery: "",
  setSpecialEffectQuery: () => {},
});

function useGlobalContext() {
  const [searchQuery, setSearchQuery] = useState(getSearchValue());
  const [locationQuery, setLocationQuery] = useState(getLocationValue());
  const [specialEffectQuery, setSpecialEffectQuery] = useState(getSpecialEffectValue());
  const [modalQuery, setModalQuery] = useState(getModalValue());
  const [ignoreModalQueryChange, setIgnoreModalQueryChange] = useState(false);
  const [ignoreQueryChange, setIgnoreQueryChange] = useState(false);

  function handleLocationChange() {
    setIgnoreModalQueryChange(true);
    setIgnoreQueryChange(true);
    setSpecialEffectQuery(getSpecialEffectValue());
    setSearchQuery(getSearchValue());
    setLocationQuery(getLocationValue());
    setModalQuery(getModalValue());
  }

  useEffect(() => {
    window.addEventListener('popstate', handleLocationChange)
    return () => window.removeEventListener('popstate', handleLocationChange)
  }, []);

  useEffect(() => {
    if (ignoreModalQueryChange) {
      setIgnoreModalQueryChange(false);
      return;
    }
    window.history.pushState({}, "", `${window.location.pathname}${(locationQuery || searchQuery || specialEffectQuery || modalQuery) ? "?" : ""}${searchQuery ? `q=${encodeURI(searchQuery)}` : ""}${specialEffectQuery ? `special-effect=${encodeURI(specialEffectQuery)}` : ""}${locationQuery ? `location=${encodeURI(locationQuery)}` : ""}${modalQuery ? `modal=${encodeURI(modalQuery)}` : ""}`);
  }, [modalQuery])

  useEffect(() => {
    if (ignoreQueryChange) {
      setIgnoreQueryChange(false);
      return;
    }
    window.history.replaceState({}, "", `${window.location.pathname}${(locationQuery || searchQuery || specialEffectQuery || modalQuery) ? "?" : ""}${searchQuery ? `q=${encodeURI(searchQuery)}` : ""}${specialEffectQuery ? `special-effect=${encodeURI(specialEffectQuery)}` : ""}${locationQuery ? `location=${encodeURI(locationQuery)}` : ""}${modalQuery ? `modal=${encodeURI(modalQuery)}` : ""}`);
  }, [searchQuery, locationQuery, location, specialEffectQuery]);

    return [{
      searchQuery, setSearchQuery,
      locationQuery, setLocationQuery,
      modalQuery, setModalQuery,
      specialEffectQuery, setSpecialEffectQuery
    }];
}


export default useGlobalContext;