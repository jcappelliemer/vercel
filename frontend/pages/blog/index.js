export default function BlogRedirectPage() {
  return null;
}

export const getServerSideProps = async () => ({
  redirect: {
    destination: '/lo-sapevi-che',
    permanent: true,
  },
});
