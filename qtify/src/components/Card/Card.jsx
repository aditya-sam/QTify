import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Typography from "@mui/material/Typography";
import CardActionArea from "@mui/material/CardActionArea";
import Chip from "@mui/material/Chip";

export default function ActionAreaCard({ album }) {
  return (
    <>
      <Card sx={{ width: "100%", maxHeight: "auto", borderRadius: 2 }}>
        <CardActionArea sx={{ maxHeight: "auto" }}>
          <CardMedia
            component="img"
            height="170"
            image={album.image}
            alt={album.title}
          />
          <CardContent
            sx={{
              padding: "4px 8px",
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "flex-start",
              textAlign: "left",
            }}
          >
            <Chip
              label={
                album.follows
                  ? album.follows + " Follows"
                  : album.likes + " Likes"
              }
              sx={{
                backgroundColor: "black",
                color: "white",
                width: "auto",
                height: "24px",
                fontFamily: "Poppins",
                fontWeight: "400",
                fontSize: "10px",
              }}
            />
          </CardContent>
        </CardActionArea>
      </Card>
      <Typography
        style={{
          textAlign: "left",
          color: "white",
          height: "21px",
          fontFamily: "Poppins",
          fontWeight: "400",
          fontSize: "14px",
          paddingTop: "6px",
          width: "100%",
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {album.title}
      </Typography>
    </>
  );
}
