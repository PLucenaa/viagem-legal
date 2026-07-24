import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "@/components/ui/sonner";
import { HomePage } from "@/pages/HomePage";
import { SolicitarPage } from "@/pages/SolicitarPage";
import { AcompanharPage } from "@/pages/AcompanharPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/solicitar" element={<SolicitarPage />} />
        <Route path="/acompanhar" element={<AcompanharPage />} />
      </Routes>
      <Toaster richColors position="top-center" />
    </BrowserRouter>
  );
}
