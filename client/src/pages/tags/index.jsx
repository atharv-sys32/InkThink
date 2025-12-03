import React, { useState } from 'react';
import MUIDataTable from 'mui-datatables';
import { useMutation, useQuery } from '@apollo/client';
import { DELETE_TAG, GET_TAGS } from '../../graphql/Tag';
import Loader from 'components/Loader';
import { Button, Chip } from '@mui/material';
import { PlusCircleOutlined } from '@ant-design/icons';
import CreateTagModal from './form';
import { Box } from '@mui/system';
import { toast } from 'react-toastify';
import ConfirmDialog from 'components/ConfirmDialog';

export const TagsPage = () => {
  const { loading, error, data, refetch } = useQuery(GET_TAGS);
  const [removeTag] = useMutation(DELETE_TAG);

  const [addTag, setAddTag] = useState(false);
  const [editTag, setEditTag] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isEdit, setIsEdit] = useState(false);

  const handleOpenConfirmDialog = (id) => {
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDialog = () => {
    setSelectedRows([]);
    setEditTag(null);
    setIsEdit(false);
    setOpenConfirmDialog(false);
  };

  const handleCreate = () => {
    setEditTag(null);
    setIsEdit(false);
    setAddTag(true);
  };

  const handleEdit = (tag) => {
    setEditTag(tag);
    setAddTag(true);
    setIsEdit(true);
  };

  const handleDelete = async () => {
    try {
      const results = await Promise.all(
        selectedRows.map(async (row) => {
          const id = data.tags[row].id;
          const response = await removeTag({
            variables: {
              id
            }
          });

          return response.data.removeTag;
        })
      );

      const successfulDeletes = results.filter((result) => result === true);
      const failedDeletes = results.filter((result) => result !== true);

      if (successfulDeletes.length > 0) {
        toast.success(`${successfulDeletes.length} tag(s) deleted successfully.`);
      }

      if (failedDeletes.length > 0) {
        toast.error('Some tags could not be deleted.');
      }

      await refetch();
      handleCloseConfirmDialog();
    } catch (error) {
      toast.error(error.message);
    }
  };

  if (loading) return <Loader />;
  if (error) {
    toast.error(error.message);
    return null;
  }

  if (!data || !data.tags) {
    return <div>No tags data available. Please check your backend GraphQL resolver.</div>;
  }

  const columns = [
    {
      name: 's.n',
      label: 'S.N.',
      options: {
        filter: true,
        sort: true
      }
    },
    {
      name: 'name',
      label: 'Name',
      options: {
        filter: true,
        sort: true
      }
    },
    {
      name: 'slug',
      label: 'Slug',
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: 'status',
      label: 'Status',
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value) => (
          <Chip label={value === 'ACTIVE' ? 'Active' : 'Inactive'} color={value === 'ACTIVE' ? 'success' : 'warning'} variant="outlined" />
        )
      }
    },
    {
      name: 'actions',
      label: 'Actions',
      options: {
        filter: true,
        sort: false,
        empty: true,
        customBodyRender: (value, tableMeta, updateValue) => {
          const tag = data.tags[tableMeta.rowIndex];
          return (
            <>
              <Box display="flex" gap={1}>
                <Button variant="contained" color="info" size="small" onClick={() => window.open(`/admin/posts?tagId=${tag.id}`, '_self')}>
                  View Posts
                </Button>
                <Button variant="contained" color="primary" size="small" onClick={() => handleEdit(tag)}>
                  Edit
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={() => {
                    setSelectedRows([tableMeta.rowIndex]);
                    handleOpenConfirmDialog();
                  }}
                >
                  Delete
                </Button>
              </Box>
            </>
          );
        }
      }
    }
  ];

  const rows = data.tags.map((row, index) => ({
    's.n': index + 1,
    name: row.name,
    slug: row.slug,
    status: row.status
  }));

  const options = {
    rowsSelected: selectedRows,
    onRowSelectionChange: (rowsSelectedData, allRows, rowsSelected) => {
      setSelectedRows(rowsSelected);
    },
    customToolbarSelect: (selectedRows, displayData, setSelectedRows) => (
      <Button style={{ marginRight: '6px' }} variant="contained" color="error" onClick={handleOpenConfirmDialog}>
        Delete All
      </Button>
    )
  };

  return (
    <>
      <Button variant="outlined" startIcon={<PlusCircleOutlined />} style={{ marginBottom: '20px' }} onClick={handleCreate}>
        Add Tag
      </Button>
      <MUIDataTable title={'Tags List'} data={rows} columns={columns} options={options} />
      {addTag && <CreateTagModal addTag={addTag} setAddTag={setAddTag} refetch={refetch} initialData={editTag} isEdit={isEdit} />}

      {/* CONFIRM DIALOG BOX */}
      <ConfirmDialog
        open={openConfirmDialog}
        handleClose={handleCloseConfirmDialog}
        handleConfirm={handleDelete}
        title="Confirm Delete"
        desc="Are you sure you want to delete this item?"
      />
    </>
  );
};
