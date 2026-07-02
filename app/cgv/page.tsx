import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "CGV du voyage — TimeTravel Agency",
  description:
    "Conditions générales de vente (fictives) des séjours temporels TimeTravel Agency.",
};

export default function CgvPage() {
  return (
    <LegalPage
      title="CGV du voyage"
      intro="Conditions générales de vente applicables aux séjours temporels. Document fictif fourni à titre de démonstration."
    >
      <LegalSection heading="Objet">
        <p>
          Les présentes conditions encadrent la réservation et le déroulement des
          séjours temporels proposés par TimeTravel Agency. Elles sont fournies
          uniquement à titre illustratif.
        </p>
      </LegalSection>

      <LegalSection heading="Réservation">
        <p>
          Le parcours de réservation consiste à choisir une destination, à
          échanger avec notre agent Chronos pour affiner l&apos;itinéraire, puis à
          valider les dates. La réservation et le paiement en ligne seront proposés
          dans une prochaine version.
        </p>
      </LegalSection>

      <LegalSection heading="Tarifs">
        <p>
          Les tarifs indiqués sont fictifs et exprimés par personne. Ils peuvent
          varier selon la formule choisie (Découverte ou Prestige) et ne
          constituent pas une offre commerciale.
        </p>
      </LegalSection>

      <LegalSection heading="Annulation">
        <p>
          S&apos;agissant d&apos;un projet de démonstration, aucune transaction
          réelle n&apos;a lieu et aucune condition d&apos;annulation contraignante
          ne s&apos;applique.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
