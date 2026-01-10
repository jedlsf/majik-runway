import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

let isNavigating = false;

const normalizePath = (path: string) => path.replace(/\/+$/, "");

/**
 * Waits until the window location matches the expected path.
 * Useful if you want to ensure the React Router navigation has finished.
 */
const waitForPathChange = (
  expectedPath: string,
  timeout = 20000
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const start = Date.now();

    const interval = setInterval(() => {
      if (
        normalizePath(window.location.pathname) === normalizePath(expectedPath)
      ) {
        clearInterval(interval);
        resolve();
      } else if (Date.now() - start > timeout) {
        clearInterval(interval);
        window.location.href = expectedPath; // fallback hard reload
        reject(new Error("Navigation timeout exceeded"));
      }
    }, 50);
  });
};

/**
 * SPA-style preloaded navigation for Vite + React + Electron
 * @param path - Target route (React Router path)
 * @param navigate - navigate instance
 * @param options - Optional toast messages
 */
export async function preloadedNavigation(
  path: string,
  navigate: ReturnType<typeof useNavigate>,
  options?: {
    loadingMessage?: string;
    successMessage?: string;
    errorMessage?: string;
  }
) {
  if (isNavigating) {
    console.warn("Navigation already in progress, ignoring duplicate trigger.");
    return;
  }

  isNavigating = true;

  const navigateWithPreloader = async () => {
    try {
      // SPA navigation
      navigate(path);

      // Wait until location actually changes (optional)
      await waitForPathChange(path);
    } catch (error) {
      console.warn("Navigation issue detected, forcing hard reload:", error);

      // Fallback for Electron or dev server
      window.location.href = path;
    }
  };

  toast.promise(navigateWithPreloader(), {
    loading: options?.loadingMessage ?? "Loading page...",
    success: () => {
      isNavigating = false;
      return options?.successMessage ?? "Navigation successful!";
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    error: (error: any) =>
      options?.errorMessage ?? `Navigation failed: ${error.message}`,
  });
}
