import "./App.css";
import ReduxProvider from "./redux/ReduxProvider";
import ThemeProviderWrapper from "./globals/ThemeProviderWrapper";
import { MajikRunwayWrapper } from "./components/majik-session-wrapper/MajikRunwayWrapper";
import WindowMajikRunway from "./components/dashboard/WindowMajikRunway";
import { BrowserRouter } from "react-router-dom";
import { ShepherdProvider } from "./lib/shepherd-js/ShepherdTourContext";
import { ErrorBoundary } from "./components/functional/ErrorBoundary";
import ConnectionDetector from "./components/functional/ConnectionDetector";
import { Toaster } from "sonner";

function App() {
  return (
    <>
      <ReduxProvider>
        <ThemeProviderWrapper>
          <BrowserRouter>
            <ErrorBoundary>
              <ConnectionDetector>
                <ShepherdProvider>
                  <MajikRunwayWrapper>
                    <WindowMajikRunway />
                    <Toaster
                      expand={true}
                      position="top-center"
                      toastOptions={{
                        classNames: {
                          toast: "toast-main",
                          title: "toast-title",
                          description: "toast-description",
                          actionButton: "toast-action-button",
                          cancelButton: "toast-cancel-button",
                          closeButton: "toast-close-button",
                        },
                      }}
                    />
                  </MajikRunwayWrapper>
                </ShepherdProvider>
              </ConnectionDetector>
            </ErrorBoundary>
          </BrowserRouter>
        </ThemeProviderWrapper>
      </ReduxProvider>
    </>
  );
}

export default App;
