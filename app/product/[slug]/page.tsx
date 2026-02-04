import { redirect } from 'next/navigation';

export default function ProductRootRedirect({ params }: { params: { slug: string } }) {
  const slug = params?.slug;
  redirect(`/en/product/${slug}`);
}

