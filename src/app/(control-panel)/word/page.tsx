'use client';

import { useEffect, useState, useMemo } from 'react';
import { Paper, Typography, Box, Button } from '@mui/material';
import DataTable from 'src/components/data-table/DataTable';
import FuseLoading from '@fuse/core/FuseLoading';
import { showMessage } from '@fuse/core/FuseMessage/fuseMessageSlice';
import { useAppDispatch } from '@/store/hooks';
import { all } from '@/services/reminder.service';
import { type MRT_ColumnDef } from 'material-react-table';
import MenuActions from '@/components/MenuActions';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import { useRouter } from 'next/navigation';

function WordList() {
  const dispatch = useAppDispatch();
  const [data, setData] = useState<IWordResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Faz a requisição para obter a lista de palavras
    all()
      .then((response) => {
        setData(response.data);
        // dispatch(showMessage({ message: 'Dados carregados com sucesso', variant: 'success' }));
      })
      .catch(() => {
        setError('Erro ao carregar dados');
        dispatch(showMessage({ message: 'Erro ao carregar dados', variant: 'error' }));
      })
      .finally(() => {
        setLoading(false);
      });
  }, [dispatch]);

  // Definição das colunas para a tabela
  const columns = useMemo<MRT_ColumnDef<IWordResponse>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        size: 200,
      },
      {
        accessorKey: 'word',
        header: 'Palavra',
      },
      {
        accessorKey: 'response',
        header: 'Resposta',
      },
      {
        accessorKey: 'rating',
        header: 'Avaliação',
      },
      {
        accessorKey: 'actions',
        header: 'Ações',
        Cell: ({ row }: { row: { original: IWordResponse } }) => {
          return (
            <MenuActions
              actions={[
                {
                  label: 'Atulizar',
                  icon: <ModeEditIcon/>,
                  function: () => router.push(`/word/${row.original.id}/edit`),
                },
                {
                  label: 'Remover',
                  icon: <DeleteOutlineIcon/>,
                  function: () => router.push(`/word/${row.original.id}`),
                },
              ]}
            />
          )
        },
      },
 
    ],
    []
  );

  if (loading) {
    return <FuseLoading />;
  }

  if (error) {
    return (
      <Box p={2}>
        <Typography variant="body1" align="center" color="error">
          {error}
        </Typography>
      </Box>
    );
  }

  return (
    <Paper
      className="flex flex-col flex-auto shadow-1 rounded-t-lg overflow-hidden rounded-b-none w-full h-full"
      elevation={0}
    >
      <Box p={2} display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" gutterBottom className='mb-0'>
          Lista de Palavras
        </Typography>
        <Button variant='contained' onClick={() => router.push('/word/create')}>
          Criar nova
        </Button>
      </Box>

      <DataTable
        initialState={{
          density: 'comfortable', 
          showColumnFilters: false,
          showGlobalFilter: true,
          pagination: {
            pageIndex: 0,
            pageSize: 10,
          },
        }}
        data={data}
        columns={columns}
        enableColumnOrdering={true}
				enableGrouping={true}
				enableColumnPinning={true}
				enableFacetedValues={true}
				enableRowActions={false}
				enableRowSelection={true}
      />
    </Paper>
  );
}

export default WordList;
