import React from "react";
import { createLazyFileRoute } from "@tanstack/react-router";
import { DashboardView } from "../ui/components/DashboardView/DashboardView";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <>
      <DashboardView />
    </>
  );
}
