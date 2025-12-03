import React, { useState, useMemo } from 'react';
import MUIDataTable from 'mui-datatables';
import { useMutation, useQuery } from '@apollo/client';
import { DELETE_COMMENT, GET_COMMENTS } from '../../graphql/Comment';
import Loader from 'components/Loader';
import { Button, Chip } from '@mui/material';
import { PlusCircleOutlined } from '@ant-design/icons';
import CreateCommentModal from './form';
import { Box } from '@mui/system';
import { toast } from 'react-toastify';
import ConfirmDialog from 'components/ConfirmDialog';
import { jwtDecode } from 'jwt-decode';

export const CommentsPage = () => {
  const { loading, error, data, refetch } = useQuery(GET_COMMENTS);
  const [removeComment] = useMutation(DELETE_COMMENT);

  const [addComment, setAddComment] = useState(false);
  const [editComment, setEditComment] = useState(null);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [selectedRows, setSelectedRows] = useState([]);
  const [isEdit, setIsEdit] = useState(false);

  // Get current user ID from token
  const getCurrentUserId = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        return decoded.sub;
      } catch (error) {
        return null;
      }
    }
    return null;
  };

  const currentUserId = getCurrentUserId();

  // Filter comments to show:
  // 1. Comments on posts owned by current user, OR
  // 2. Comments written by current user
  const userComments = useMemo(() => {
    if (!data?.comments || !currentUserId) return [];

    const userId = parseInt(currentUserId);

    // Show comments on user's posts OR comments written by user
    const filtered = data.comments.filter(
      (comment) =>
        comment.post?.user?.id === userId || // Comments on my posts
        comment.user?.id === userId           // Comments I wrote
    );

    return filtered;
  }, [data?.comments, currentUserId]);

  const handleOpenConfirmDialog = (id) => {
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDialog = () => {
    setSelectedRows([]);
    setEditComment(null);
    setIsEdit(false);
    setOpenConfirmDialog(false);
  };

  const handleCreate = () => {
    setEditComment(null);
    setIsEdit(false);
    setAddComment(true);
  };

  const handleEdit = (comment) => {
    setEditComment(comment);
    setAddComment(true);
    setIsEdit(true);
  };

  const handleDelete = async () => {
    try {
      const results = await Promise.all(
        selectedRows.map(async (row) => {
          const id = userComments[row].id;
          const response = await removeComment({
            variables: {
              id
            }
          });

          return response.data.removeComment;
        })
      );

      const successfulDeletes = results.filter((result) => result && result.id);
      const failedDeletes = results.filter((result) => !result || !result.id);

      if (successfulDeletes.length > 0) {
        toast.success(`${successfulDeletes.length} comment(s) deleted successfully.`);
      }

      if (failedDeletes.length > 0) {
        toast.error('Some comments could not be deleted.');
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

  if (!data || !data.comments) {
    return <div>No comments data available. Please check your backend GraphQL resolver.</div>;
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
      name: 'userName',
      label: 'Author',
      options: {
        filter: true,
        sort: true
      }
    },
    {
      name: 'userEmail',
      label: 'Email',
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: 'postName',
      label: 'Post',
      options: {
        filter: true,
        sort: false
      }
    },
    {
      name: 'content',
      label: 'Content',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value) => (value ? value.substring(0, 50) + '...' : '')
      }
    },
    {
      name: 'status',
      label: 'Status',
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value) => (
          <Chip
            label={value === 'INACTIVE' ? 'Spam' : 'Not Spam'}
            color={value === 'INACTIVE' ? 'error' : 'success'}
            variant="outlined"
          />
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
          const comment = userComments[tableMeta.rowIndex];
          return (
            <>
              <Box display="flex" gap={1}>
                <Button variant="contained" color="primary" size="small" onClick={() => handleEdit(comment)}>
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

  const rows = userComments.map((row, index) => ({
    's.n': index + 1,
    userName: row.user?.name || 'N/A',
    userEmail: row.user?.email || 'N/A',
    postName: row.post?.name || 'N/A',
    content: row.content,
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
        Add Comment
      </Button>
      <MUIDataTable title={'Comments List'} data={rows} columns={columns} options={options} />
      {addComment && (
        <CreateCommentModal addComment={addComment} setAddComment={setAddComment} refetch={refetch} initialData={editComment} isEdit={isEdit} />
      )}

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
