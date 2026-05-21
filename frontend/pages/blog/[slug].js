export const getServerSideProps = async ({ params }) => {
  const slug = (Array.isArray(params?.slug) ? params.slug : [params?.slug].filter(Boolean)).join('/');
  return {
    redirect: {
      destination: `/lo-sapevi-che/${slug}`,
      permanent: true,
    },
  };
};

export default function BlogSlugRedirectPage() {
  return null;
}
