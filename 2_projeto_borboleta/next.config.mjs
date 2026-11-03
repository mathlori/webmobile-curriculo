/** @type {import('next').NextConfig} */
const nextConfig = {
  // Habilita recursos experimentais utilizados pelo App Router deste projeto.
  experimental: {
    agentFeedback: true,
  },
  // Ativa cache de componentes, prefetch parcial e o compilador do React.
  cacheComponents: true,
  partialPrefetching: true,
  reactCompiler: true,
};

export default nextConfig;
