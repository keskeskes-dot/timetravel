import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Mentions légales — TimeTravel Agency",
  description:
    "Mentions légales de TimeTravel Agency, agence de voyage temporel fictive (projet étudiant).",
};

export default function MentionsLegalesPage() {
  return (
    <LegalPage
      title="Mentions légales"
      intro="Informations relatives à l'éditeur et à l'hébergement de ce site."
    >
      <LegalSection heading="Éditeur du site">
        <p>
          Ce site est édité par TimeTravel Agency, marque fictive créée dans le
          cadre d&apos;un projet pédagogique. Aucune société réelle n&apos;est
          représentée.
        </p>
      </LegalSection>

      <LegalSection heading="Directeur de la publication">
        <p>
          Le responsable de la publication est l&apos;équipe projet à
          l&apos;origine de cette réalisation étudiante.
        </p>
      </LegalSection>

      <LegalSection heading="Hébergement">
        <p>
          Le site est hébergé sur une plateforme d&apos;hébergement web
          (déploiement de type Vercel). Les coordonnées de l&apos;hébergeur sont
          disponibles sur le site de ce dernier.
        </p>
      </LegalSection>

      <LegalSection heading="Propriété intellectuelle">
        <p>
          Les visuels présentés sont générés par intelligence artificielle. Les
          textes et éléments graphiques sont fournis à titre de démonstration.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
