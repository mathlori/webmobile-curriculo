import { Suspense } from "react";
import Concluido from "../../../../curriculo/concluido/Concluido";

export default function ConcluidoUsuarioPage({ params }) {
  return (
    <Suspense fallback={<main aria-busy="true"><p>Carregando currículo...</p></main>}>
      {params.then(({ id }) => (
        <Concluido rotaBase={`/user/${encodeURIComponent(id)}/curriculo`} />
      ))}
    </Suspense>
  );
}
