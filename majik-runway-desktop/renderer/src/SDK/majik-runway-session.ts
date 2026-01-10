// MajikRunwaySession.ts

import {
  autoSaveMajikFileData,
  loadSavedMajikFileData,
} from "../lib/majik-file-utils";

import { idbLoadBlob, idbSaveBlob } from "../lib/idb/idb-majik-system";
import {
  autogenerateID,
  MajikRunway,
  type BusinessModel,
  type MajikRunwayJSON,
} from "@thezelijah/majik-runway";

export interface MajikRunwaySessionJSON {
  uid: string;
  runway: MajikRunwayJSON;
}

export class MajikRunwaySession {
  private autosaveTimer: number | null = null;
  private autosaveIntervalMs = 15000; // periodic backup interval
  private autosaveDebounceMs = 500; // debounce for rapid changes

  public uid: string;
  public runway: MajikRunway;

  constructor(
    runway?: MajikRunway,
    uid: string = autogenerateID("mjkrunway-session")
  ) {
    this.runway = runway ? runway : MajikRunway.initialize();
    this.uid = uid;
  }

  /**
   * Update the current session's MajikRunway state
   * without replacing the session instance.
   */
  updateFromRunway(
    runway: MajikRunway,
    options: { autosave: boolean } = {
      autosave: true,
    }
  ): this {
    this.runway = runway;

    if (options?.autosave !== false) {
      this.scheduleAutosave();
    }
    return this;
  }

  /* ================================
   * Persistence
   * ================================ */
  private autosaveIntervalId: number | null = null;

  private attachAutosaveHandlers() {
    if (typeof window !== "undefined") {
      // Save before unload (best-effort)
      try {
        window.addEventListener("beforeunload", () => {
          void this.saveState();
        });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (e) {
        // ignore
      }
      // Start periodic backups
      this.startAutosave();
    }
  }

  startAutosave() {
    if (this.autosaveIntervalId) return;
    if (typeof window === "undefined") return;
    this.autosaveIntervalId = window.setInterval(() => {
      void this.saveState();
    }, this.autosaveIntervalMs) as unknown as number;
  }

  stopAutosave() {
    if (!this.autosaveIntervalId) return;
    if (typeof window !== "undefined") {
      window.clearInterval(this.autosaveIntervalId);
    }
    this.autosaveIntervalId = null;
  }

  protected scheduleAutosave() {
    if (typeof window === "undefined") return;

    if (this.autosaveTimer) {
      window.clearTimeout(this.autosaveTimer);
    }

    this.autosaveTimer = window.setTimeout(() => {
      void this.saveState();
      this.autosaveTimer = null;
    }, this.autosaveDebounceMs);
  }

  static parseSessionFromJSON(
    json: string | MajikRunwaySessionJSON
  ): MajikRunwaySession {
    const raw: MajikRunwaySessionJSON =
      typeof json === "string" ? JSON.parse(json) : json;



    const runway = MajikRunway.parseFromJSON(raw.runway);


    const session = new MajikRunwaySession(runway, raw.uid);


    session.attachAutosaveHandlers();
    return session;
  }

  toSessionJSON(): MajikRunwaySessionJSON {


    return {
      uid: this.uid,
      runway: this.runway.toJSON(),
    };
  }

  /** Save current state into IndexedDB (autosave). */
  async saveState(): Promise<void> {
    try {
      const jsonDocument = this.toSessionJSON();


      const autosaveBlob = autoSaveMajikFileData(jsonDocument);
      await idbSaveBlob("majik-runway-state", autosaveBlob);
    } catch (err) {
      console.error("Failed to save MajikRunway state:", err);
    }
  }

  /**
   * Try to load an existing state from IDB; if none exists, create a fresh instance and save it.
   */
  static async loadOrCreate(
    model?: Partial<BusinessModel>,
    uid?: string
  ): Promise<MajikRunwaySession> {
    try {
      const saved = await idbLoadBlob("majik-runway-state");
      if (saved?.data) {
        const loaded = await loadSavedMajikFileData(saved.data);
        const parsed = loaded.j as MajikRunwaySessionJSON;

        const session = MajikRunwaySession.parseSessionFromJSON(parsed);
        console.log("Majik Runway Session loaded");
        return session;
      }
    } catch (err) {
      console.warn("Failed to load session, creating new runway session.", err);
    }

    const initRunway = MajikRunway.initialize(model);

    const fresh = new MajikRunwaySession(initRunway, uid);
    fresh.attachAutosaveHandlers();
    await fresh.saveState();
    return fresh;
  }
}

export default MajikRunwaySession;
