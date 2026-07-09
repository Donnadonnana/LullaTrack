import { NavLink } from "react-router-dom";
import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";

const drawerWidth = 240;

export default function Sidebar() {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          p: 2,
        },
      }}
    >
      <Typography variant="h5" component="h1" sx={{ fontWeight: 700, mb: 3 }}>
        LullaTrack
      </Typography>

      <Box component="nav">
        <List>
          <ListItemButton component={NavLink} to="/">
            <ListItemText primary="Dashboard" />
          </ListItemButton>

          <ListItemButton component={NavLink} to="/sleep">
            <ListItemText primary="Sleep" />
          </ListItemButton>

          <ListItemButton component={NavLink} to="/feeding">
            <ListItemText primary="Feeding" />
          </ListItemButton>
        </List>
      </Box>
    </Drawer>
  );
}