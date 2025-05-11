import { useTranslation } from "react-i18next";
import ChatBot from "@/components/ChatBot";
import bgImage from "@/assets/background.jpg";
import { Helmet } from "react-helmet-async";

export default function Welcome() {
  const { t } = useTranslation();

  return (
    <>
      <Helmet>
        <title>{t("GreenVisor")}</title>
        <meta name="description" content={t("welcome.description")} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
      </Helmet>
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
    </>
  );
}
