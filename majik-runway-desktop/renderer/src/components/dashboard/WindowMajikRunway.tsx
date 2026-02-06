"use client";

import { useEffect, useState } from "react";
import styled from "styled-components";

import { isDevEnvironment, secureTimecode } from "../../utils/helper";

import { trackEvent } from "../../utils/analytics";

import { toast } from "sonner";

import SetupMajikRunway from "./SetupMajikRunway";

import LoadingPage from "../../components/functional/LoadingPage";
import DashboardMajikRunway from "./DashboardMajikRunway";
import { deleteBlob } from "../../lib/idb/idb-majik-system";

import { base64DecodeUtf8, base64EncodeUtf8 } from "../../lib/majik-file-utils";
import type { MajikRunway } from "@thezelijah/majik-runway";

import { useMajik } from "../majik-session-wrapper/use-majik";
import {
  MajikRunwaySession,
  type MajikRunwaySessionJSON,
} from "@/SDK/majik-runway-session";

import APITranscoder, {
  type SerializedEncryptedData,
} from "@/utils/APITranscoder";

const RootContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: 0.4em 0em;
  width: 100%;

  gap: 15px;
  background-color: transparent;
  align-items: center;

  /* Hide scrollbar for Webkit browsers (Chrome, Safari, etc.) */
  &::-webkit-scrollbar {
    display: none;
  }
  /* Hide scrollbar for IE, Edge, and Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`;

const globalToolID = "majik-runway";

// Type guard for Electron API
const isElectron = () => typeof window !== "undefined" && window.electron;

export const WindowMajikRunway = () => {
  const { majik, loading, updateRunway, updateInstance, clearSession } =
    useMajik();

  const [, setRefreshKey] = useState<number>(0);

  useEffect(() => {
    trackEvent("views", `Tools_View_${globalToolID}`, 1);
  }, []);

  // Handle import from Electron menu
  useEffect(() => {
    if (!isElectron()) return;

    const handleImport = async () => {
      try {
        const result = await window.electron.importData();
        if (!result) return;

        const { base64Content } = result;

        // Decrypt using your existing logic
        const jsonString = base64DecodeUtf8(base64Content);
        const parsedData = JSON.parse(jsonString) as SerializedEncryptedData;
        const decryptedData = APITranscoder.decryptPayload(parsedData);

        // Parse as MajikFileData
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const majikData = decryptedData as any;
        const parsedNewInstance = MajikRunwaySession.parseSessionFromJSON(
          majikData.j as MajikRunwaySessionJSON
        );

        updateInstance(parsedNewInstance);
        toast.success("Import successful!");
      } catch (error) {
        console.error(error);
        toast.error("Failed to import file");
      }
    };

    const handleExport = async () => {
      if (!majik) {
        toast.error("No data to export");
        return;
      }

      try {
        const jsonDocument = majik.toSessionJSON();

        // Encrypt using your existing logic
        const rawData = {
          j: jsonDocument,
          s: secureTimecode(),
          v: "1.0.0",
        };

        const generatedRQC = APITranscoder.generateRQC();
        const encryptedData = APITranscoder.encryptPayload(
          rawData,
          generatedRQC
        );
        const dataString = JSON.stringify(encryptedData);
        const base64Content = base64EncodeUtf8(dataString);

        const success = await window.electron.exportData({
          base64Content,
          fileName: "Majik Runway.mjkb",
        });

        if (success) {
          toast.success("Export successful!");
        }
      } catch (error) {
        console.error(error);
        toast.error("Failed to export file");
      }
    };

    const handleClearSession = async () => {
      if (!majik) return;
      if (isDevEnvironment()) console.log("Clearing session");
      deleteBlob(globalToolID);
      clearSession();

      toast.success("Session Reset Successfully", {
        description:
          "All existing runway settings are now cleared and reset. You may now start a new session.",
      });
    };
    const removeClearListener =
      window.electron.onClearTriggered(handleClearSession);

    const removeImportListener =
      window.electron.onImportTriggered(handleImport);
    const removeExportListener =
      window.electron.onExportTriggered(handleExport);

    return () => {
      removeImportListener();
      removeExportListener();
      removeClearListener();
    };
  }, [majik, updateInstance, clearSession]);

  const handleRefreshInstance = (data: MajikRunway) => {
    console.log("Update Received: ", data);
    setRefreshKey((prev) => prev + 1);
    updateRunway(data);
  };

  return (
    <RootContainer className="rootWindowMajikRunway">
      {!majik || loading ? (
        <LoadingPage seconds={2} text="Loading Majik Runway...">
          <SetupMajikRunway onUpdate={handleRefreshInstance} />
        </LoadingPage>
      ) : (
        <DashboardMajikRunway
          runway={majik.runway}
          onUpdate={handleRefreshInstance}
        />
      )}
    </RootContainer>
  );
};
export default WindowMajikRunway;
