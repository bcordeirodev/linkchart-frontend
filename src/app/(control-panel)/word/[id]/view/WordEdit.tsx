'use client';

import { useEffect, useState } from 'react';
import { Alert, Typography } from '@mui/material';
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';
import { useAppDispatch } from '@/store/hooks';
import { all, findOne } from '@/services/reminder.service';

function WordEdit({id}: {id: string}) {
  const dispatch = useAppDispatch();
  const [data, setData] = useState<IWordResponse>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    findOne(id)
      .then((response) => {
        setData(response.data);
        dispatch(showMessage({ message: 'Dados carregados com sucesso', variant: 'success' }));
      })
      .catch((err) => {
        setError('Erro ao carregar dados');
        dispatch(showMessage({ message: 'Erro ao carregar dados', variant: 'error' }));
      });
  }, [dispatch]);

  // Caso ocorra algum erro, exibimos um alerta
  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if(!data) { 
    return <p>Carregando...</p>;
  }

  return (
    <div className="p-10">
      <Typography variant='h4'>Página de Visualização</Typography>
      {/* Exemplo simples de listagem dos dados retornados */}
        <div className="mb-4 mt-4">
          <hr />
          <Typography variant="body1"><strong>Word:</strong> {data.word}</Typography>
          <Typography variant="body1"><strong>Response:</strong> {data.response}</Typography>
          <Typography variant="body1"><strong>Rating:</strong> {data.rating}</Typography>
          <hr />
        </div> 
    </div>
  );
}

export default WordEdit;
