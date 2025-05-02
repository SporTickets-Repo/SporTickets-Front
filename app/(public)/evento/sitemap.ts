import { MetadataRoute } from 'next'
import { eventService } from '@/service/event'
import { EventStatus } from '@/interface/event'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://sportickets.com.br'
  
  try {
    const events = await eventService.getAllEvents(1, 1000, "name")
    const publicEvents = events.filter(
      event => event.status !== EventStatus.DRAFT && event.status !== EventStatus.CANCELLED
    )

    return publicEvents.map(event => ({
      url: `${baseUrl}/evento/${event.slug}`,
      lastModified: new Date(event.updatedAt),
      changeFrequency: 'daily' as const,
      priority: 0.9,
    }))
  } catch (error) {
    console.error('Erro ao gerar sitemap de eventos:', error)
    return []
  }
} 