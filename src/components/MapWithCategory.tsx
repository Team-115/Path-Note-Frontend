import { useState } from 'react';
import CategoryFilter from './CategoryFilter';
import CategoryPlaceCard from './CategoryPlaceCard';

const places = [
  {
    id: 1,
    category: '서울',
    title: '서울 성수동 나들이',
    time: '07:30 - 20:00 / 12시간 30분',
    tags: ['#성수동', '#뚝섬', '#패션', '#팝업'],
    details: '성수 감자탕 -> 무신사 -> 마땅킴 -> 팝업 구경',
  },
  {
    id: 2,
    category: '서울',
    title: '서울 을지로 뿌시',
    time: '07:30 - 20:00 / 12시간 30분',
    tags: ['#을지로', '#힙합', '#노포'],
    details: '카페 -> 닭 한마리 -> 카페 -> 타코 -> 맥주',
  },
  {
    id: 3,
    category: '부산',
    title: '부산 광안리 해변 산책',
    time: '08:00 - 18:00 / 10시간',
    tags: ['#광안리', '#바다', '#분위기'],
    details: '카페 -> 광안대교 뷰 -> 횟집',
  },
  {
    id: 3,
    category: '서울',
    title: '서울 을지로 뿌시',
    time: '07:30 - 20:00 / 12시간 30분',
    tags: ['#을지로', '#힙합', '#노포'],
    details: '카페 -> 닭 한마리 -> 카페 -> 타코 -> 맥주',
  },
  {
    id: 4,
    category: '서울',
    title: '서울 을지로 뿌시',
    time: '07:30 - 20:00 / 12시간 30분',
    tags: ['#을지로', '#힙합', '#노포'],
    details: '카페 -> 닭 한마리 -> 카페 -> 타코 -> 맥주',
  },
  {
    id: 5,
    category: '서울',
    title: '서울 을지로 뿌시',
    time: '07:30 - 20:00 / 12시간 30분',
    tags: ['#을지로', '#힙합', '#노포'],
    details: '카페 -> 닭 한마리 -> 카페 -> 타코 -> 맥주',
  },
  {
    id: 6,
    category: '서울',
    title: '서울 을지로 뿌시',
    time: '07:30 - 20:00 / 12시간 30분',
    tags: ['#을지로', '#힙합', '#노포'],
    details: '카페 -> 닭 한마리 -> 카페 -> 타코 -> 맥주',
  },
  {
    id: 7,
    category: '서울',
    title: '서울 을지로 뿌시',
    time: '07:30 - 20:00 / 12시간 30분',
    tags: ['#을지로', '#힙합', '#노포'],
    details: '카페 -> 닭 한마리 -> 카페 -> 타코 -> 맥주',
  },
  {
    id: 8,
    category: '경상남도',
    title: '진주 투어',
    time: '07:30 - 20:00 / 12시간 30분',
    tags: ['#을지로', '#힙합', '#노포'],
    details: '카페 -> 닭 한마리 -> 카페 -> 타코 -> 맥주',
  },
];

export default function MapWithCategory() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // 선택된 카테고리에 해당하는 장소 필터링
  const filteredPlaces =
    selectedCategory && selectedCategory !== '+'
      ? places.filter(place => place.category === selectedCategory)
      : [];

  return (
    <>
      <CategoryFilter
        selected={selectedCategory}
        onSelect={setSelectedCategory}
      />
      <CategoryPlaceCard places={filteredPlaces} />
    </>
  );
}
