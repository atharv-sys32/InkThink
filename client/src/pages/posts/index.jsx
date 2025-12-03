import React, { useState, useMemo } from 'react';
import MUIDataTable from 'mui-datatables';
import { useMutation, useQuery } from '@apollo/client';
import { DELETE_POST, GET_POSTS } from '../../graphql/Post';
import Loader from 'components/Loader';
import { Button, Chip, Typography, Alert } from '@mui/material';
import { PlusCircleOutlined } from '@ant-design/icons';
import CreatePostModal from './form';
import { Box } from '@mui/system';
import { toast } from 'react-toastify';
import ConfirmDialog from 'components/ConfirmDialog';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export const PostsPage = () => {
  const { loading, error, data, refetch } = useQuery(GET_POSTS);
  const [removePost] = useMutation(DELETE_POST);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [addPost, setAddPost] = useState(false);
  const [editPost, setEditPost] = useState(null);
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

  // Get filter parameters from URL - MUST be before any conditional returns
  const categoryId = searchParams.get('categoryId');
  const tagId = searchParams.get('tagId');

  // Filter posts based on URL parameters and current user - MUST be before any conditional returns
  const filteredPosts = useMemo(() => {
    if (!data?.posts) return [];

    let posts = data.posts;

    // In admin panel, only show current user's posts
    if (currentUserId) {
      posts = posts.filter((post) => post.user?.id === parseInt(currentUserId));
    }

    if (categoryId) {
      posts = posts.filter((post) => post.category?.id === parseInt(categoryId));
    }

    if (tagId) {
      posts = posts.filter((post) => post.tags?.some((tag) => tag.id === parseInt(tagId)));
    }

    return posts;
  }, [data?.posts, categoryId, tagId, currentUserId]);

  // Get filter info for display - MUST be before any conditional returns
  const filterInfo = useMemo(() => {
    if (!data?.posts) return null;

    if (categoryId) {
      const category = data.posts.find((p) => p.category?.id === parseInt(categoryId))?.category;
      return category ? `Filtered by Category: ${category.name}` : 'Filtered by Category';
    }
    if (tagId) {
      const tag = data.posts.find((p) => p.tags?.some((t) => t.id === parseInt(tagId)))?.tags?.find((t) => t.id === parseInt(tagId));
      return tag ? `Filtered by Tag: ${tag.name}` : 'Filtered by Tag';
    }
    return null;
  }, [data?.posts, categoryId, tagId]);

  const handleOpenConfirmDialog = (id) => {
    setOpenConfirmDialog(true);
  };

  const handleCloseConfirmDialog = () => {
    setSelectedRows([]);
    setEditPost(null);
    setIsEdit(false);
    setOpenConfirmDialog(false);
  };

  const handleCreate = () => {
    setEditPost(null);
    setIsEdit(false);
    setAddPost(true);
  };

  const handleEdit = (post) => {
    setEditPost(post);
    setAddPost(true);
    setIsEdit(true);
  };

  const handleDelete = async () => {
    try {
      const results = await Promise.all(
        selectedRows.map(async (row) => {
          const id = data.posts[row].id;
          const response = await removePost({
            variables: {
              id
            }
          });

          return response.data.removePost;
        })
      );

      const successfulDeletes = results.filter((result) => result && result.id);
      const failedDeletes = results.filter((result) => !result || !result.id);

      if (successfulDeletes.length > 0) {
        toast.success(`${successfulDeletes.length} post(s) deleted successfully.`);
      }

      if (failedDeletes.length > 0) {
        toast.error('Some posts could not be deleted.');
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

  if (!data || !data.posts) {
    return <div>No posts data available. Please check your backend GraphQL resolver.</div>;
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
      label: 'Title',
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
      name: 'category',
      label: 'Category',
      options: {
        filter: true,
        sort: true,
        customBodyRender: (value) => value || 'No Category'
      }
    },
    {
      name: 'tags',
      label: 'Tags',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value) => (
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            {value && value.length > 0 ? (
              value.map((tag, index) => <Chip key={index} label={tag} size="small" variant="outlined" />)
            ) : (
              <Typography variant="body2" color="text.secondary">
                No tags
              </Typography>
            )}
          </Box>
        )
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
            label={value === 'ACTIVE' ? 'Active' : value === 'DRAFT' ? 'Draft' : 'Inactive'}
            color={value === 'ACTIVE' ? 'success' : value === 'DRAFT' ? 'info' : 'warning'}
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
          const post = filteredPosts[tableMeta.rowIndex];
          return (
            <>
              <Box display="flex" gap={1}>
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEdit(post);
                  }}
                >
                  Edit
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
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

  const rows = filteredPosts.map((row, index) => ({
    's.n': index + 1,
    name: row.name,
    slug: row.slug,
    category: row.category?.name || 'No Category',
    tags: row.tags?.map((tag) => tag.name) || [],
    status: row.status
  }));

  const options = {
    rowsSelected: selectedRows,
    onRowSelectionChange: (rowsSelectedData, allRows, rowsSelected) => {
      setSelectedRows(rowsSelected);
    },
    onRowClick: (rowData, rowMeta) => {
      const post = filteredPosts[rowMeta.dataIndex];
      navigate(`/admin/posts/${post.id}`);
    },
    customToolbarSelect: (selectedRows, displayData, setSelectedRows) => (
      <Button style={{ marginRight: '6px' }} variant="contained" color="error" onClick={handleOpenConfirmDialog}>
        Delete All
      </Button>
    ),
    selectableRowsOnClick: false
  };

  return (
    <>
      {filterInfo && (
        <Alert severity="info" sx={{ marginBottom: '20px' }}>
          {filterInfo}
          <Button size="small" onClick={() => (window.location.href = '/admin/posts')} sx={{ marginLeft: 2 }}>
            Clear Filter
          </Button>
        </Alert>
      )}
      <Button variant="outlined" startIcon={<PlusCircleOutlined />} style={{ marginBottom: '20px' }} onClick={handleCreate}>
        Add Post
      </Button>
      <MUIDataTable title={'Posts List'} data={rows} columns={columns} options={options} />
      {addPost && <CreatePostModal addPost={addPost} setAddPost={setAddPost} refetch={refetch} initialData={editPost} isEdit={isEdit} />}

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
