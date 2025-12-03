import { INKTHINK_LOGO_URL } from '../../utils/supabase';

// ==============================|| INKTHINK LOGO ||============================== //

const Logo = () => {
  return (
    <img
      src={INKTHINK_LOGO_URL}
      alt="InkThink"
      height="50"
      style={{ display: 'block', maxWidth: '180px', objectFit: 'contain' }}
    />
  );
};

export default Logo;
