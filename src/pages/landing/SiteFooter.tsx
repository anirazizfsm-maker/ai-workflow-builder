import { useNavigate } from "react-router";
import GradualBlur from "@/components/GradualBlur";

export default function SiteFooter() {
  const navigate = useNavigate();

  return (
    <>
      <footer className="border-t border-[#142554]">
        <div className="mx-auto max-w-7xl px-6 md:px-8 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span className="text-[#8fa2c9]">© {new Date().getFullYear()} Lethimdo</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-[#8fa2c9]">
            <button className="hover:text-white" onClick={() => navigate("/")}>About</button>
            <button className="hover:text-white" onClick={() => navigate("/pricing")}>Pricing</button>
            <button className="hover:text-white" onClick={() => navigate("/docs")}>Documentation</button>
            <button className="hover:text-white" onClick={() => navigate("/support")}>Support</button>
          </div>
        </div>
      </footer>

      <GradualBlur
        preset="page-footer"
        animated="scroll"
        height="3.5rem"
        divCount={6}
        strength={1.4}
        opacity={0.7}
        curve="bezier"
        className="pointer-events-none"
        style={{ zIndex: 20 }}
      />
    </>
  );
}
