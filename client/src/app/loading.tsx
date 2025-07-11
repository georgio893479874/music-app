import { Helix } from "ldrs/react";
import "ldrs/react/helix.css";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#111]">
      <Helix size="45" speed="2.5" color="white" />
    </div>
  );
}
