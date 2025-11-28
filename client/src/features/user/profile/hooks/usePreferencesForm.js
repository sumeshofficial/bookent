import { useForm } from "react-hook-form";
import { useMemo, useRef } from "react";
import { isEqual } from "lodash";

export const usePreferencesForm = (user) => {
  const initialPrefRef = useRef({
    sport: user?.preferences?.sport || "Football",
    venue: user?.preferences?.venue || "Kochi",
    matchTime: user?.preferences?.matchTime || "Afternoon",
    priceRange: user?.preferences?.priceRange || "500 - 2000",
  });

  const form = useForm({
    defaultValues: initialPrefRef.current,
  });

  const { watch, formState, reset } = form;
  const watched = watch();

  const isChanged = useMemo(
    () => !isEqual(watched, initialPrefRef.current),
    [watched]
  );

  const syncInitialPreferences = (newPrefs) => {
    initialPrefRef.current = newPrefs;
    reset(newPrefs);
  };

  return { form, isChanged, formState, syncInitialPreferences };
};
