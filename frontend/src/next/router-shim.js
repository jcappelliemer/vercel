import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

export const Link = ({ to, href, children, ...props }) => {
  const targetHref = href || to || '/';
  return (
    <NextLink href={targetHref} {...props}>
      {children}
    </NextLink>
  );
};

export const useLocation = () => {
  const router = useRouter();
  const asPath = router.asPath || '/';
  const [pathnameWithQuery = '/', hash = ''] = asPath.split('#');
  const [pathname = '/', search = ''] = pathnameWithQuery.split('?');

  return {
    pathname,
    search: search ? `?${search}` : '',
    hash: hash ? `#${hash}` : '',
  };
};

export const useParams = () => {
  const router = useRouter();
  return router.query || {};
};

export const useNavigate = () => {
  const router = useRouter();
  return (to, options = {}) => {
    if (options.replace) {
      router.replace(to);
      return;
    }
    router.push(to);
  };
};

export const Navigate = ({ to, replace = false }) => {
  const router = useRouter();

  useEffect(() => {
    if (replace) {
      router.replace(to);
      return;
    }
    router.push(to);
  }, [replace, router, to]);

  return null;
};
