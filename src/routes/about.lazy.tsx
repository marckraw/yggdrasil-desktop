import React from "react";
import { createLazyFileRoute } from "@tanstack/react-router";
import { AboutView } from "../ui/components/AboutView/AboutView";

export const Route = createLazyFileRoute("/about")({
  component: About,
});

function About() {
  return (
    <>
      <AboutView />
    </>
  );
}
