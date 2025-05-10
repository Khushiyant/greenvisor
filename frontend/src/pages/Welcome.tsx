import { useTranslation } from "react-i18next";
import ChatBot from "@/components/ChatBot";

export default function Welcome() {
  const { t } = useTranslation();

  return (
    <div
      className="relative h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/background.jpg')" }}
    >
      <div className="absolute inset-0 bg-green-800 bg-opacity-70" />

      <div className="relative z-10 flex flex-col justify-center h-full px-12 max-w-5xl">
        <h1 className="text-white text-5xl font-bold mb-4">
          {t("welcome.headline")}
        </h1>
        <p className="text-white text-lg max-w-xl">{t("welcome.subline")}</p>
      </div>

      <ChatBot />
    </div>
  );
}
