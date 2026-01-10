"use client";

// ShepherdTourContext.tsx
import React from "react";
import Shepherd from "shepherd.js";
import "shepherd.js/dist/css/shepherd.css";
import { ShepherdFactoryContext } from "./shepherd-context";

export const ShepherdProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const createTour = () =>
    new Shepherd.Tour({
      useModalOverlay: true,
      defaultStepOptions: {
        classes: "custom-tour-step",
        scrollTo: true,
        cancelIcon: { enabled: true },
      },
    });

  return (
    <ShepherdFactoryContext.Provider value={createTour}>
      {children}
    </ShepherdFactoryContext.Provider>
  );
};
