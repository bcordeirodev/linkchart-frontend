'use client';

import WordEdit from './WordEdit';
import { useParams } from 'next/navigation';

const WordEditPage = () => {
  const { id } = useParams<{ id: string }>()

  if (!id) return <p>Carregando...</p>;

  return <WordEdit id={id} />;
};

export default WordEditPage;
