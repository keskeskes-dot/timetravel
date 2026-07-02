import type { Metadata } from "next";
import { LegalPage, LegalSection } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Politique temporelle — TimeTravel Agency",
  description:
    "Notre charte du voyage temporel responsable : sécurité, non-altération de l'Histoire et confidentialité (contenu fictif).",
};

export default function PolitiqueTemporellePage() {
  return (
    <LegalPage
      title="Politique temporelle"
      intro="Notre charte du voyage dans le temps responsable. Un cadre (fictif) pour explorer le passé sans jamais le modifier."
    >
      <LegalSection heading="Non-altération de l'Histoire">
        <p>
          Chaque voyageur s&apos;engage à observer sans intervenir. Aucune action
          susceptible de modifier le cours des événements historiques n&apos;est
          autorisée. Nos guides temporels certifiés veillent au respect de ce
          principe fondamental.
        </p>
      </LegalSection>

      <LegalSection heading="Sécurité des départs">
        <p>
          Chaque départ est encadré par un guide temporel certifié et une balise
          de rappel. En cas d&apos;imprévu, le retour à l&apos;époque
          d&apos;origine est déclenché automatiquement.
        </p>
      </LegalSection>

      <LegalSection heading="Souvenirs et objets">
        <p>
          Seuls les souvenirs immatériels (photos holographiques) sont autorisés.
          Aucun objet ne doit franchir la frontière temporelle, dans un sens comme
          dans l&apos;autre.
        </p>
      </LegalSection>

      <LegalSection heading="Confidentialité du voyageur">
        <p>
          Les données de synchronisation temporelle sont utilisées uniquement pour
          assurer la sécurité du séjour et ne sont jamais partagées avec des tiers.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
