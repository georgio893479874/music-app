import { useState, useEffect } from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { API_URL, menuSections } from '@/constants';

const AvatarMenu = () => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [user, setUser] = useState<{ firstname: string; lastname: string; avatarUrl?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      setIsLoading(false);
      return;
    }
    fetch(`${API_URL}/user/${userId}`)
      .then(res => res.json())
      .then(data => {
        setUser(data.user || data);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSignOut = () => {
    localStorage.removeItem('userId');
    document.cookie = 'authToken=; Max-Age=0; path=/';
    window.location.href = '/login';
  };

  const handleMyAccount = () => {
    handleClose();
    if (user) {
      router.push(`/user/${localStorage.getItem('userId')}`);
    }
  };

  const initials = user
    ? `${user.firstname?.[0] || ''}${user.lastname?.[0] || ''}`.toUpperCase()
    : '';

  return (
    <div>
      <IconButton onClick={handleClick} size="small">
        {!isLoading && (
          <Avatar src={user?.avatarUrl} sx={{ bgcolor: "#222", color: "#fff" }}>
            {initials}
          </Avatar>
        )}
      </IconButton>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        PaperProps={{
          sx: {
            bgcolor: "#111",
            color: "#fff",
            minWidth: 168.4,
            boxShadow: 8,
            borderRadius: 2,
            p: 0,
            '& .MuiMenuItem-root': {
              fontSize: 18,
              '&:hover': { bgcolor: "#222" },
              gap: 10,
              color: "#fff",
            },
            '& hr': {
              borderColor: "#222",
              margin: "4px 0",
            }
          }
        }}
      >
        <MenuItem
          onClick={handleMyAccount}
          sx={{
            fontWeight: 600,
            fontSize: 16,
            py: 1.5,
            borderBottom: "1px solid #222",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
            bgcolor: "#111"
          }}
          disableRipple
        >
          <span style={{ fontSize: 18, color: "#aaa" }}>
            My account
          </span>
        </MenuItem>
        {menuSections.map((section, idx) => (
          <div key={idx}>
            {section.map((item) =>
              item.action === "logout" ? (
                <MenuItem
                  key={item.label}
                  onClick={() => { handleClose(); handleSignOut(); }}
                  className="gap-2"
                >
                  {item.label}
                </MenuItem>
              ) : (
                <MenuItem
                  key={item.label}
                  onClick={handleClose}
                  className="gap-2"
                  component={Link}
                  href={item.href}
                >
                  {item.label}
                </MenuItem>
              )
            )}
            {idx !== menuSections.length - 1 && <Divider sx={{ bgcolor: "#222" }} />}
          </div>
        ))}
      </Menu>
    </div>
  );
};

export default AvatarMenu;