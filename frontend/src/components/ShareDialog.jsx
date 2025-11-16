import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  IconButton,
  Box,
  Typography,
  InputAdornment
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import CheckIcon from '@mui/icons-material/Check';

const ShareDialog = ({ open, onClose, projectName = 'Project', projectId = 'proj-123', onInvite }) => {
  const [copied, setCopied] = useState(false);
  const [email, setEmail] = useState('');
  const inviteLink = `${window.location.origin}/projects/${projectId || ''}`;

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(inviteLink);
      } else {
        const tmp = document.createElement('textarea');
        tmp.value = inviteLink;
        tmp.style.position = 'fixed';
        tmp.style.left = '-9999px';
        document.body.appendChild(tmp);
        tmp.select();
        document.execCommand('copy');
        document.body.removeChild(tmp);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch (err) {
      console.error('Copy failed', err);
    }
  };

  const handleInvite = () => {
    if (!email.trim()) return;
    if (typeof onInvite === 'function') onInvite(email.trim());
    setEmail('');
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${projectName}`,
          text: `Join my project "${projectName}"`,
          url: inviteLink
        });
      } catch (err) {
      }
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Share project</DialogTitle>
      <DialogContent>
        <Typography variant="body2" sx={{ color: '#6b7280', mb: 2 }}>
          Share a link or invite by email to collaborate on <strong>{projectName}</strong>.
        </Typography>

        <TextField
          label="Shareable link"
          value={inviteLink}
          fullWidth
          InputProps={{
            readOnly: true,
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleCopy} size="small" edge="end">
                  {copied ? <CheckIcon color="success" fontSize="small" /> : <ContentCopyIcon fontSize="small" />}
                </IconButton>
              </InputAdornment>
            )
          }}
          sx={{ mb: 2 }}
        />

        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            label="Invite by email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            placeholder="email@example.com"
          />
          <Button variant="contained" onClick={handleInvite} disabled={!email.trim()} sx={{ textTransform: 'none' }}>
            Invite
          </Button>
        </Box>

        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
          <Button variant="outlined" onClick={handleNativeShare} sx={{ textTransform: 'none' }}>
            Use device share
          </Button>
          <Typography sx={{ color: '#9ca3af', fontSize: '0.85rem', alignSelf: 'center' }}>
            Works on supported mobile browsers
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 2 }}>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ShareDialog;
