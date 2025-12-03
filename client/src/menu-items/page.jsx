// assets
import { LoginOutlined, ProfileOutlined } from '@ant-design/icons';

// icons
const icons = {
  LoginOutlined,
  ProfileOutlined
};

// ==============================|| MENU ITEMS - EXTRA PAGES ||============================== //

const pages = {
  id: 'pages',
  title: 'Pages',
  type: 'group',
  children: [
    {
      id: 'categories',
      title: 'Categories',
      type: 'item',
      url: '/admin/categories',
      icon: icons.LoginOutlined,
      target: false
    },
    {
      id: 'tags',
      title: 'Tags',
      type: 'item',
      url: '/admin/tags',
      icon: icons.ProfileOutlined,
      target: false
    },
    {
      id: 'posts',
      title: 'Posts',
      type: 'item',
      url: '/admin/posts',
      icon: icons.ProfileOutlined,
      target: false
    },
    {
      id: 'comments',
      title: 'Comments',
      type: 'item',
      url: '/admin/comments',
      icon: icons.ProfileOutlined,
      target: false
    }
  ]
};

export default pages;
