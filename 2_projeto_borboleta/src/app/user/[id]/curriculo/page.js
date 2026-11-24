import { Suspense } from "react";
import Curriculo from "../../../curriculo/Curriculo";

export default function CurriculoUsuarioPage({ params }) {
  return (
    <Suspense fallback={<main aria-busy="true"><p>Carregando currículo...</p></main>}>
      {params.then(({ id }) => (
        <Curriculo rotaBase={`/user/${encodeURIComponent(id)}/curriculo`} />
      ))}
    </Suspense>
  );
}
