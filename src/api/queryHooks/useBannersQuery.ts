import { useQuery } from '@tanstack/react-query';
import { apiGet } from '..';

import { type Banner } from '../../services/api';

const BANNERS_ENDPOINT = '/student/home/banners';

export const EXAMPLE_BANNERS_RESPONSE: Banner[] = [
  {
    id: 'banner-1',
    imageUrl:
      'https://images.unsplash.com/photo-1462539405390-d0bdb635c7d1?auto=format&fit=crop&w=1200&q=80',
    type: 'EVENT',
    redirectId: 'event-101',
  },
  {
    id: 'banner-2',
    imageUrl:
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1200&q=80',
    type: 'ANNOUNCEMENT',
    redirectId: 'announcement-45',
  },
  {
    id: 'banner-3',
    imageUrl:
      'https://images.unsplash.com/photo-1559136555-9303baea8ebd?auto=format&fit=crop&w=1200&q=80',
    type: 'EVENT',
    redirectId: 'event-114',
  },
];

/**
 * GET /student/home/banners
 * Example response:
 * [
 *   {
 *     "id": "banner-1",
 *     "imageUrl": "https://...",
 *     "type": "EVENT",
 *     "redirectId": "event-101"
 *   }
 * ]
 */
const getBanners = async () => {
  const response = await apiGet<Banner[]>(BANNERS_ENDPOINT);
  return response.data ?? EXAMPLE_BANNERS_RESPONSE;
};

export const useBannersQuery = () =>
  useQuery<Banner[]>({
    queryKey: ['banners'],
    queryFn: getBanners,
  });
