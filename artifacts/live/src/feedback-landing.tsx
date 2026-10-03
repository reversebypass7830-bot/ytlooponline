import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LandingFeedbackSection } from "./components/FeedbackShowcase";

const mountPoint = document.getElementById("landing-feedback-root");
if (!mountPoint) throw new Error("Landing feedback mount point is missing.");

const queryClient = new QueryClient();

createRoot(mountPoint).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <LandingFeedbackSection />
    </QueryClientProvider>
  </StrictMode>,
);