import { redirect } from 'next/navigation'

export default function LinuxLessonsRedirect({ params }: { params: { slug: string[] } }) {
  const dest = `/lessons/${params.slug.join('/')}`
  redirect(dest)
}

