import React, { useEffect, useState } from "react";
import MajikRunwaySession from "../../SDK/majik-runway-session";
import { MajikContext } from "./majik-context";
import type { MajikRunway } from "@thezelijah/majik-runway";

export const MajikRunwayWrapper: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [majik, setMajik] = useState<MajikRunwaySession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const instance = await MajikRunwaySession.loadOrCreate();

        if (!mounted) return;

        setMajik(instance);
      } catch (e) {
        console.error("Failed to initialize MajikRunway:", e);

        if (!mounted) return;

        const instance = new MajikRunwaySession();

        setMajik(instance);
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const updateInstance = (data: MajikRunwaySession) => {
    console.log("Update Received: ", data);
    setMajik(data);
  };

  const updateRunway = (data: MajikRunway) => {
    console.log("Update Received: ", data);

    setMajik((prev) => prev?.updateFromRunway(data) ?? null);
  };

  const clearSession = () => {
    console.log("Clearing Session");

    const instance = new MajikRunwaySession();

    setMajik(instance);
  };

  return (
    <MajikContext.Provider
      value={{
        majik,
        loading,
        updateInstance,
        updateRunway,
        clearSession,
      }}
    >
      {children}
    </MajikContext.Provider>
  );
};
