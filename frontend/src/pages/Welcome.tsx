import { useTranslation } from "react-i18next";
import ChatBot from "@/components/ChatBot";
import bgImage from "@/assets/background.jpg";

export default function Welcome() {
  const { t } = useTranslation();

  return (
    <main
      className="relative h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      <div
        className="absolute inset-0 bg-green-800"
        style={{ backgroundColor: "rgba(34, 197, 94, 0.30)" }}
      />

      <div className="relative z-10 flex flex-col justify-center h-full px-12 max-w-5xl">
        <h1 className="text-white text-5xl font- mb-4">
          {t("welcome.headline")}
        </h1>
        <p className="text-white text-lg max-w-xl">{t("welcome.subline")}</p>
      </div>

      <ChatBot />
    </main>
  );
}
