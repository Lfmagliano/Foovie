import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import MenuPageClient from '@/components/menu/MenuPageClient'

export const revalidate = 60

export async function generateMetadata({ params }) {
  const { slug } = await params
  const supabase = await createClient()
  const { data } = await supabase
    .from('restaurants').select('name, address').eq('slug', slug).single()
  if (!data) return { title: 'Cardápio' }
  return { title: `${data.name} — Cardápio`, description: data.address ?? undefined }
}

export default async function MenuPage({ params }) {
  const { slug } = await params
  const supabase = await createClient()

  const { data: restaurant, error } = await supabase
    .from('restaurants').select('*').eq('slug', slug).single()

  if (error || !restaurant) notFound()

  const [{ data: categories }, { data: items }] = await Promise.all([
    supabase.from('categories').select('*')
      .eq('restaurant_id', restaurant.id).order('sort_order'),
    supabase.from('menu_items').select('*')
      .eq('restaurant_id', restaurant.id)
      .eq('is_available', true)
      .order('sort_order'),
  ])

  const featured = (items ?? []).find(i => i.is_featured) ?? (items ?? [])[0] ?? null

  const sections = (categories ?? []).map(cat => ({
    category: cat,
    items: (items ?? []).filter(i => i.category_id === cat.id),
  })).filter(s => s.items.length > 0)

  return (
    <MenuPageClient
      restaurant={restaurant}
      sections={sections}
      featured={featured}
    />
  )
}